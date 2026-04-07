import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  caseCount: number;
  codedCount: number;
}

export type CaseStatus =
  | 'pending'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'fetched'
  | 'coding'
  | 'coded'
  | 'reviewed'
  | 'error';

export interface Case {
  id: string;
  projectId: string;

  // identification
  key: number;
  case_id: string;
  court: string;
  case_no: string;
  judgment_date: string;
  final_instance: string;

  status: CaseStatus;
  sourceText: string;
  casenoteUrl: string;
  lboxUrl: string;
  errorMessage: string;

  // offender
  sex: string;
  age: number | null;
  employment: string;
  nationality: string;

  // victim
  victim_sex: string;
  victim_age: number | null;
  total_victims: number | null;

  // relationship
  rel_type: string;
  rel_type_code: number | null;
  rel_status_first: string;
  rel_start_date: string;
  rel_end_date: string;
  cohabit_at_first: string;
  cohabit_ever: string;

  // coercive control
  cc_surveillance: number | null;
  cc_isolation: number | null;
  cc_intimidation: number | null;
  cc_emotional_abuse: number | null;
  cc_digital_control: number | null;
  cc_reputation_threat: number | null;
  cc_refusal_to_separate: number | null;
  cc_physical_control: number | null;
  cc_economic_control: number | null;

  // sentencing
  disposition: string;
  disposition_code: number | null;
  prison_months: number | null;
  probation_months: number | null;
  fine_10k: number | null;
  admit: string;
  admit_code: number | null;
  settlement: string;
  deposit: string;
  deposit_amount: number | null;
  victim_punishment_wish: string;
  sentencing_text: string;

  // derived (calculated)
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
}

/** Per-incident variables (up to 10 incidents per case) */
export interface Incident {
  seq: number; // 1-10
  main_charge: string;
  charge_cat: string;
  event_start: string;
  event_end: string;
  severity: number | null;
  harm_level: number | null;
  weapon: string;
  body_force_type: string;
  trigger_cat: string;
  injury: string;
  treatment_days: number | null;
  digital_means: string;
  date_imputed: string;
}

export interface Dyad {
  id: string;
  caseId: string;
  projectId: string;
  incidents: Incident[];

  // per-incident gap fields (calculated)
  event_duration: (number | null)[]; // event_duration_N
  gap: (number | null)[];            // gap_NtoN+1
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DATA_DIR = path.resolve(process.cwd(), 'data');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

function readJson<T>(name: string, fallback: T): T {
  ensureDataDir();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return fallback;
  const raw = fs.readFileSync(fp, 'utf-8');
  return JSON.parse(raw) as T;
}

function writeJson<T>(name: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Default builders
// ---------------------------------------------------------------------------

function defaultCase(partial: Partial<Case> & { id: string; projectId: string }): Case {
  return {
    key: 0,
    case_id: '',
    court: '',
    case_no: '',
    judgment_date: '',
    final_instance: '',
    status: 'pending',
    sourceText: '',
    casenoteUrl: '',
    lboxUrl: '',
    errorMessage: '',
    sex: '',
    age: null,
    employment: '',
    nationality: '',
    victim_sex: '',
    victim_age: null,
    total_victims: null,
    rel_type: '',
    rel_type_code: null,
    rel_status_first: '',
    rel_start_date: '',
    rel_end_date: '',
    cohabit_at_first: '',
    cohabit_ever: '',
    cc_surveillance: null,
    cc_isolation: null,
    cc_intimidation: null,
    cc_emotional_abuse: null,
    cc_digital_control: null,
    cc_reputation_threat: null,
    cc_refusal_to_separate: null,
    cc_physical_control: null,
    cc_economic_control: null,
    disposition: '',
    disposition_code: null,
    prison_months: null,
    probation_months: null,
    fine_10k: null,
    admit: '',
    admit_code: null,
    settlement: '',
    deposit: '',
    deposit_amount: null,
    victim_punishment_wish: '',
    sentencing_text: '',
    rel_duration_days: null,
    max_event_seq: null,
    total_offense_count: null,
    total_offense_span: null,
    mean_gap_days: null,
    gap_trend: '',
    gap_trend_code: null,
    severity_first: null,
    severity_last: null,
    severity_max: null,
    escalation_present: null,
    cc_total: null,
    rel_start_to_first_days: null,
    breakup_to_first_days: null,
    ...partial,
  };
}

// ---------------------------------------------------------------------------
// Project CRUD
// ---------------------------------------------------------------------------

export function getProjects(): Project[] {
  return readJson<Project[]>('projects', []);
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function createProject(name: string): Project {
  const projects = getProjects();
  const project: Project = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    caseCount: 0,
    codedCount: 0,
  };
  projects.push(project);
  writeJson('projects', projects);
  return project;
}

export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  projects.splice(idx, 1);
  writeJson('projects', projects);
  // Clean up related files
  const casesPath = filePath(casesFile(id));
  const dyadsPath = filePath(dyadsFile(id));
  if (fs.existsSync(casesPath)) fs.unlinkSync(casesPath);
  if (fs.existsSync(dyadsPath)) fs.unlinkSync(dyadsPath);
  return true;
}

export function updateProject(id: string, patch: Partial<Project>): Project | undefined {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  projects[idx] = { ...projects[idx], ...patch, id };
  writeJson('projects', projects);
  return projects[idx];
}

// ---------------------------------------------------------------------------
// Case CRUD
// ---------------------------------------------------------------------------

function casesFile(projectId: string): string {
  return `cases_${projectId}`;
}

export function getCases(projectId: string): Case[] {
  return readJson<Case[]>(casesFile(projectId), []);
}

export function getCase(projectId: string, caseId: string): Case | undefined {
  return getCases(projectId).find((c) => c.id === caseId);
}

export function createCase(projectId: string, data: Partial<Case>): Case {
  const cases = getCases(projectId);
  const c = defaultCase({ ...data, id: generateId(), projectId });
  cases.push(c);
  writeJson(casesFile(projectId), cases);

  // update project counts
  const project = getProject(projectId);
  if (project) {
    updateProject(projectId, { caseCount: cases.length });
  }
  return c;
}

export function createCases(projectId: string, dataList: Partial<Case>[]): Case[] {
  const cases = getCases(projectId);
  const created: Case[] = [];
  for (const data of dataList) {
    const c = defaultCase({ ...data, id: generateId(), projectId });
    cases.push(c);
    created.push(c);
  }
  writeJson(casesFile(projectId), cases);
  const project = getProject(projectId);
  if (project) {
    updateProject(projectId, { caseCount: cases.length });
  }
  return created;
}

export function updateCase(projectId: string, caseId: string, patch: Partial<Case>): Case | undefined {
  const cases = getCases(projectId);
  const idx = cases.findIndex((c) => c.id === caseId);
  if (idx === -1) return undefined;
  cases[idx] = { ...cases[idx], ...patch, id: caseId, projectId };
  writeJson(casesFile(projectId), cases);

  // update coded count
  const codedCount = cases.filter((c) => c.status === 'coded' || c.status === 'reviewed').length;
  updateProject(projectId, { codedCount });

  return cases[idx];
}

// ---------------------------------------------------------------------------
// Dyad CRUD
// ---------------------------------------------------------------------------

function dyadsFile(projectId: string): string {
  return `dyads_${projectId}`;
}

export function getDyads(projectId: string): Dyad[] {
  return readJson<Dyad[]>(dyadsFile(projectId), []);
}

export function getDyad(projectId: string, dyadId: string): Dyad | undefined {
  return getDyads(projectId).find((d) => d.id === dyadId);
}

export function getDyadByCase(projectId: string, caseId: string): Dyad | undefined {
  return getDyads(projectId).find((d) => d.caseId === caseId);
}

export function createDyad(projectId: string, caseId: string, incidents: Incident[] = []): Dyad {
  const dyads = getDyads(projectId);
  const dyad: Dyad = {
    id: generateId(),
    caseId,
    projectId,
    incidents,
    event_duration: [],
    gap: [],
  };
  dyads.push(dyad);
  writeJson(dyadsFile(projectId), dyads);
  return dyad;
}

export function updateDyad(projectId: string, dyadId: string, patch: Partial<Dyad>): Dyad | undefined {
  const dyads = getDyads(projectId);
  const idx = dyads.findIndex((d) => d.id === dyadId);
  if (idx === -1) return undefined;
  dyads[idx] = { ...dyads[idx], ...patch, id: dyadId, projectId };
  writeJson(dyadsFile(projectId), dyads);
  return dyads[idx];
}

// ---------------------------------------------------------------------------
// Research Design Request
// ---------------------------------------------------------------------------

export interface ResearchRequest {
  id: string;
  keywords: string;
  description: string;
  field: string;
  email: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  aiDraft: string;
  adminResponse: string;
  respondedAt: string;
}

export function getResearchRequests(): ResearchRequest[] {
  return readJson<ResearchRequest[]>('research-requests', []);
}

export function getResearchRequest(id: string): ResearchRequest | undefined {
  return getResearchRequests().find((r) => r.id === id);
}

export function createResearchRequest(data: { keywords: string; description: string; field: string; email: string }): ResearchRequest {
  const requests = getResearchRequests();
  const request: ResearchRequest = {
    id: generateId(),
    keywords: data.keywords,
    description: data.description,
    field: data.field,
    email: data.email,
    status: 'pending',
    createdAt: new Date().toISOString(),
    aiDraft: '',
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('research-requests', requests);
  return request;
}

export function updateResearchRequest(id: string, patch: Partial<ResearchRequest>): ResearchRequest | undefined {
  const requests = getResearchRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('research-requests', requests);
  return requests[idx];
}

// ---------------------------------------------------------------------------
// Chat Messages (per research request)
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  requestId: string;
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
}

// Store messages per request: research-messages-{requestId}.json
export function getChatMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`research-messages-${requestId}`, []);
}

export function addChatMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getChatMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`research-messages-${requestId}`, messages);
  return msg;
}
