// ---------------------------------------------------------------------------
// Derived variable calculator — ported from Python code_batch.py
// ---------------------------------------------------------------------------

import type { Case, Dyad, Incident } from './db';

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/** Parse a date string (YYYY-MM-DD or YYYY.MM.DD or YYYYMMDD) to Date. */
function parseDate(s: string | null | undefined): Date | null {
  if (!s || s.trim() === '') return null;
  const cleaned = s.trim().replace(/\./g, '-').replace(/\//g, '-');
  // Handle YYYYMMDD
  if (/^\d{8}$/.test(cleaned)) {
    const iso = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
}

/** Difference in days between two dates (b - a). */
function daysDiff(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// Per-incident calculations
// ---------------------------------------------------------------------------

/**
 * Calculate event_duration_N for each incident (days from event_start to event_end).
 * If start == end or end is missing, duration = 1.
 */
export function calcEventDurations(incidents: Incident[]): (number | null)[] {
  return incidents.map((inc) => {
    const start = parseDate(inc.event_start);
    const end = parseDate(inc.event_end);
    if (!start) return null;
    if (!end) return 1;
    const diff = daysDiff(start, end);
    return diff <= 0 ? 1 : diff;
  });
}

/**
 * Calculate gap_NtoN+1: days from end of incident N to start of incident N+1.
 * Returns array of length incidents.length - 1.
 */
export function calcGaps(incidents: Incident[]): (number | null)[] {
  const gaps: (number | null)[] = [];
  for (let i = 0; i < incidents.length - 1; i++) {
    const endCurr = parseDate(incidents[i].event_end) ?? parseDate(incidents[i].event_start);
    const startNext = parseDate(incidents[i + 1].event_start);
    if (!endCurr || !startNext) {
      gaps.push(null);
    } else {
      gaps.push(daysDiff(endCurr, startNext));
    }
  }
  return gaps;
}

// ---------------------------------------------------------------------------
// Case-level derived variables
// ---------------------------------------------------------------------------

export interface DerivedVars {
  rel_duration_days: number | null;
  max_event_seq: number | null;
  total_offense_count: number | null;
  total_offense_span: number | null;
  mean_gap_days: number | null;
  gap_trend: string;
  gap_trend_code: number | null;
  severity_first: number | null;
  severity_last: number | null;
  severity_max: number | null;
  escalation_present: number | null;
  cc_total: number | null;
  rel_start_to_first_days: number | null;
  breakup_to_first_days: number | null;
  event_durations: (number | null)[];
  gaps: (number | null)[];
}

/**
 * Calculate all derived variables for a case + its dyad.
 */
export function calculateDerived(c: Case, dyad: Dyad): DerivedVars {
  const incidents = (dyad.incidents || [])
    .filter((inc) => inc.seq > 0)
    .sort((a, b) => a.seq - b.seq);

  // --- rel_duration_days ---
  const relStart = parseDate(c.rel_start_date);
  const relEnd = parseDate(c.rel_end_date);
  const rel_duration_days =
    relStart && relEnd ? daysDiff(relStart, relEnd) : null;

  // --- max_event_seq ---
  const max_event_seq = incidents.length > 0 ? Math.max(...incidents.map((i) => i.seq)) : null;

  // --- total_offense_count ---
  const total_offense_count = incidents.length > 0 ? incidents.length : null;

  // --- event durations & gaps ---
  const event_durations = calcEventDurations(incidents);
  const gaps = calcGaps(incidents);

  // --- total_offense_span ---
  let total_offense_span: number | null = null;
  if (incidents.length >= 1) {
    const firstStart = parseDate(incidents[0].event_start);
    const lastEnd =
      parseDate(incidents[incidents.length - 1].event_end) ??
      parseDate(incidents[incidents.length - 1].event_start);
    if (firstStart && lastEnd) {
      total_offense_span = daysDiff(firstStart, lastEnd);
      if (total_offense_span <= 0) total_offense_span = 1;
    }
  }

  // --- mean_gap_days ---
  const validGaps = gaps.filter((g): g is number => g !== null);
  const mean_gap_days =
    validGaps.length > 0
      ? Math.round((validGaps.reduce((a, b) => a + b, 0) / validGaps.length) * 100) / 100
      : null;

  // --- gap_trend / gap_trend_code ---
  // Compare first half gaps vs second half gaps.
  // 1 = accelerating (gaps shrinking), 0 = stable, -1 = decelerating
  let gap_trend = '';
  let gap_trend_code: number | null = null;
  if (validGaps.length >= 2) {
    const mid = Math.floor(validGaps.length / 2);
    const firstHalf = validGaps.slice(0, mid);
    const secondHalf = validGaps.slice(mid);
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const threshold = avgFirst * 0.1; // 10% threshold
    if (avgSecond < avgFirst - threshold) {
      gap_trend = 'accelerating';
      gap_trend_code = 1;
    } else if (avgSecond > avgFirst + threshold) {
      gap_trend = 'decelerating';
      gap_trend_code = -1;
    } else {
      gap_trend = 'stable';
      gap_trend_code = 0;
    }
  }

  // --- severity_first / last / max ---
  const severities = incidents.map((i) => i.severity).filter((s): s is number => s !== null);
  const severity_first = severities.length > 0 ? severities[0] : null;
  const severity_last = severities.length > 0 ? severities[severities.length - 1] : null;
  const severity_max = severities.length > 0 ? Math.max(...severities) : null;

  // --- escalation_present ---
  // 1 if last severity > first severity, 0 otherwise
  let escalation_present: number | null = null;
  if (severity_first !== null && severity_last !== null) {
    escalation_present = severity_last > severity_first ? 1 : 0;
  }

  // --- cc_total (coercive control total) ---
  const ccFields: (keyof Case)[] = [
    'cc_surveillance',
    'cc_isolation',
    'cc_intimidation',
    'cc_emotional_abuse',
    'cc_digital_control',
    'cc_reputation_threat',
    'cc_refusal_to_separate',
    'cc_physical_control',
    'cc_economic_control',
  ];
  const ccValues = ccFields.map((f) => c[f] as number | null).filter((v): v is number => v !== null);
  const cc_total = ccValues.length > 0 ? ccValues.reduce((a, b) => a + b, 0) : null;

  // --- rel_start_to_first_days ---
  let rel_start_to_first_days: number | null = null;
  if (relStart && incidents.length > 0) {
    const firstEvent = parseDate(incidents[0].event_start);
    if (firstEvent) {
      rel_start_to_first_days = daysDiff(relStart, firstEvent);
    }
  }

  // --- breakup_to_first_days ---
  let breakup_to_first_days: number | null = null;
  if (relEnd && incidents.length > 0) {
    const firstEvent = parseDate(incidents[0].event_start);
    if (firstEvent) {
      breakup_to_first_days = daysDiff(relEnd, firstEvent);
    }
  }

  return {
    rel_duration_days,
    max_event_seq,
    total_offense_count,
    total_offense_span,
    mean_gap_days,
    gap_trend,
    gap_trend_code,
    severity_first,
    severity_last,
    severity_max,
    escalation_present,
    cc_total,
    rel_start_to_first_days,
    breakup_to_first_days,
    event_durations,
    gaps,
  };
}

/**
 * Apply all derived variables back to a Case and Dyad, returning updated copies.
 */
export function applyDerived(
  c: Case,
  dyad: Dyad,
): { updatedCase: Partial<Case>; updatedDyad: Partial<Dyad> } {
  const derived = calculateDerived(c, dyad);

  const updatedCase: Partial<Case> = {
    rel_duration_days: derived.rel_duration_days,
    max_event_seq: derived.max_event_seq,
    total_offense_count: derived.total_offense_count,
    total_offense_span: derived.total_offense_span,
    mean_gap_days: derived.mean_gap_days,
    gap_trend: derived.gap_trend,
    gap_trend_code: derived.gap_trend_code,
    severity_first: derived.severity_first,
    severity_last: derived.severity_last,
    severity_max: derived.severity_max,
    escalation_present: derived.escalation_present,
    cc_total: derived.cc_total,
    rel_start_to_first_days: derived.rel_start_to_first_days,
    breakup_to_first_days: derived.breakup_to_first_days,
  };

  const updatedDyad: Partial<Dyad> = {
    event_duration: derived.event_durations,
    gap: derived.gaps,
  };

  return { updatedCase, updatedDyad };
}
