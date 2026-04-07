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

// ---------------------------------------------------------------------------
// Stats Design Request
// ---------------------------------------------------------------------------

export interface StatsDesignRequest {
  id: string;
  email: string;
  researchType: string;
  dataType: string;
  sampleInfo: string;
  variables: string;
  analysisGoal: string;
  currentMethods: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getStatsDesignRequests(): StatsDesignRequest[] {
  return readJson<StatsDesignRequest[]>('stats-design-requests', []);
}

export function getStatsDesignRequest(id: string): StatsDesignRequest | undefined {
  return getStatsDesignRequests().find((r) => r.id === id);
}

export function createStatsDesignRequest(data: {
  email: string;
  researchType: string;
  dataType: string;
  sampleInfo: string;
  variables: string;
  analysisGoal: string;
  currentMethods: string;
  description: string;
}): StatsDesignRequest {
  const requests = getStatsDesignRequests();
  const request: StatsDesignRequest = {
    id: generateId(),
    email: data.email,
    researchType: data.researchType,
    dataType: data.dataType,
    sampleInfo: data.sampleInfo,
    variables: data.variables,
    analysisGoal: data.analysisGoal,
    currentMethods: data.currentMethods,
    description: data.description,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('stats-design-requests', requests);
  return request;
}

export function updateStatsDesignRequest(id: string, patch: Partial<StatsDesignRequest>): StatsDesignRequest | undefined {
  const requests = getStatsDesignRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('stats-design-requests', requests);
  return requests[idx];
}

// ---------------------------------------------------------------------------
// Stats Design Chat Messages
// ---------------------------------------------------------------------------

export function getStatsDesignMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`stats-messages-${requestId}`, []);
}

export function addStatsDesignMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getStatsDesignMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`stats-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// Survey Request
// ---------------------------------------------------------------------------

export interface SurveyRequest {
  id: string;
  email: string;
  title: string;
  purpose: string;
  requesterName: string;
  organization: string;
  population: string;
  sampleSize: string;
  samplingMethod: string;
  startDate: string;
  endDate: string;
  irbStatus: string;
  additionalRequests: string;
  surveyData: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getSurveyRequests(): SurveyRequest[] {
  return readJson<SurveyRequest[]>('survey-requests', []);
}

export function getSurveyRequest(id: string): SurveyRequest | undefined {
  return getSurveyRequests().find((r) => r.id === id);
}

export function createSurveyRequest(data: Omit<SurveyRequest, 'id' | 'status' | 'createdAt' | 'adminResponse' | 'respondedAt'>): SurveyRequest {
  const requests = getSurveyRequests();
  const request: SurveyRequest = {
    id: generateId(),
    email: data.email,
    title: data.title,
    purpose: data.purpose,
    requesterName: data.requesterName,
    organization: data.organization,
    population: data.population,
    sampleSize: data.sampleSize,
    samplingMethod: data.samplingMethod,
    startDate: data.startDate,
    endDate: data.endDate,
    irbStatus: data.irbStatus,
    additionalRequests: data.additionalRequests,
    surveyData: data.surveyData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('survey-requests', requests);
  return request;
}

export function updateSurveyRequest(id: string, patch: Partial<SurveyRequest>): SurveyRequest | undefined {
  const requests = getSurveyRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('survey-requests', requests);
  return requests[idx];
}

// ---------------------------------------------------------------------------
// Survey Chat Messages
// ---------------------------------------------------------------------------

export function getSurveyMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`survey-messages-${requestId}`, []);
}

export function addSurveyMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getSurveyMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`survey-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// Judgment Collection Request
// ---------------------------------------------------------------------------

export interface JudgmentCollectionRequest {
  id: string;
  email: string;
  name: string;
  organization: string;
  purpose: string;
  searchType: 'caseNumber' | 'keyword';
  // case number search
  caseNumbers: string;
  scopeFirst: boolean;
  scopeSecond: boolean;
  scopeThird: boolean;
  outputFormat: string;
  // keyword search
  keywords: string;         // JSON array string
  keywordLogic: string;
  courts: string;           // JSON array string
  startYear: number;
  endYear: number;
  caseTypes: string;        // JSON array string
  lawKeyword: string;
  maxCount: number;
  // common
  additionalNotes: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getJudgmentCollectionRequests(): JudgmentCollectionRequest[] {
  return readJson<JudgmentCollectionRequest[]>('judgment-collection-requests', []);
}

export function getJudgmentCollectionRequest(id: string): JudgmentCollectionRequest | undefined {
  return getJudgmentCollectionRequests().find((r) => r.id === id);
}

export function createJudgmentCollectionRequest(
  data: Omit<JudgmentCollectionRequest, 'id' | 'status' | 'createdAt' | 'adminResponse' | 'respondedAt'>,
): JudgmentCollectionRequest {
  const requests = getJudgmentCollectionRequests();
  const request: JudgmentCollectionRequest = {
    id: generateId(),
    email: data.email,
    name: data.name,
    organization: data.organization,
    purpose: data.purpose,
    searchType: data.searchType,
    caseNumbers: data.caseNumbers,
    scopeFirst: data.scopeFirst,
    scopeSecond: data.scopeSecond,
    scopeThird: data.scopeThird,
    outputFormat: data.outputFormat,
    keywords: data.keywords,
    keywordLogic: data.keywordLogic,
    courts: data.courts,
    startYear: data.startYear,
    endYear: data.endYear,
    caseTypes: data.caseTypes,
    lawKeyword: data.lawKeyword,
    maxCount: data.maxCount,
    additionalNotes: data.additionalNotes,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('judgment-collection-requests', requests);
  return request;
}

export function updateJudgmentCollectionRequest(id: string, patch: Partial<JudgmentCollectionRequest>): JudgmentCollectionRequest | undefined {
  const requests = getJudgmentCollectionRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('judgment-collection-requests', requests);
  return requests[idx];
}

// ---------------------------------------------------------------------------
// Judgment Collection Chat Messages
// ---------------------------------------------------------------------------

export function getJudgmentCollectionMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`judgment-collection-messages-${requestId}`, []);
}

export function addJudgmentCollectionMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getJudgmentCollectionMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`judgment-collection-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// News Collection Request
// ---------------------------------------------------------------------------

export interface NewsCollectionRequest {
  id: string;
  email: string;
  searchType: 'keyword' | 'sentence';
  keywords: string;        // JSON array for keyword type, or sentence string
  keywordLogic: string;    // AND/OR
  dateFrom: string;
  dateTo: string;
  maxCount: number;
  purpose: string;
  additionalNotes: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getNewsCollectionRequests(): NewsCollectionRequest[] {
  return readJson<NewsCollectionRequest[]>('news-collection-requests', []);
}

export function getNewsCollectionRequest(id: string): NewsCollectionRequest | undefined {
  return getNewsCollectionRequests().find((r) => r.id === id);
}

export function createNewsCollectionRequest(
  data: Omit<NewsCollectionRequest, 'id' | 'status' | 'createdAt' | 'adminResponse' | 'respondedAt'>,
): NewsCollectionRequest {
  const requests = getNewsCollectionRequests();
  const request: NewsCollectionRequest = {
    id: generateId(),
    email: data.email,
    searchType: data.searchType,
    keywords: data.keywords,
    keywordLogic: data.keywordLogic,
    dateFrom: data.dateFrom,
    dateTo: data.dateTo,
    maxCount: data.maxCount,
    purpose: data.purpose,
    additionalNotes: data.additionalNotes,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('news-collection-requests', requests);
  return request;
}

export function updateNewsCollectionRequest(id: string, patch: Partial<NewsCollectionRequest>): NewsCollectionRequest | undefined {
  const requests = getNewsCollectionRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('news-collection-requests', requests);
  return requests[idx];
}

// ---------------------------------------------------------------------------
// News Collection Chat Messages
// ---------------------------------------------------------------------------

export function getNewsCollectionMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`news-collection-messages-${requestId}`, []);
}

export function addNewsCollectionMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getNewsCollectionMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`news-collection-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// Data Transform Request (데이터 전처리)
// ---------------------------------------------------------------------------

export interface DataTransformRequest {
  id: string;
  email: string;
  dataDescription: string;
  dataFormat: string;
  currentState: string;
  transformationTypes: string; // JSON array
  transformationDetail: string;
  additionalNotes: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getDataTransformRequests(): DataTransformRequest[] {
  return readJson<DataTransformRequest[]>('data-transform-requests', []);
}

export function getDataTransformRequest(id: string): DataTransformRequest | undefined {
  return getDataTransformRequests().find((r) => r.id === id);
}

export function createDataTransformRequest(
  data: Omit<DataTransformRequest, 'id' | 'status' | 'createdAt' | 'adminResponse' | 'respondedAt'>,
): DataTransformRequest {
  const requests = getDataTransformRequests();
  const request: DataTransformRequest = {
    id: generateId(),
    email: data.email,
    dataDescription: data.dataDescription,
    dataFormat: data.dataFormat,
    currentState: data.currentState,
    transformationTypes: data.transformationTypes,
    transformationDetail: data.transformationDetail,
    additionalNotes: data.additionalNotes,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('data-transform-requests', requests);
  return request;
}

export function updateDataTransformRequest(id: string, patch: Partial<DataTransformRequest>): DataTransformRequest | undefined {
  const requests = getDataTransformRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('data-transform-requests', requests);
  return requests[idx];
}

// Data Transform Chat Messages
export function getDataTransformMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`data-transform-messages-${requestId}`, []);
}

export function addDataTransformMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getDataTransformMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`data-transform-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// Quant Analysis Request (계량분석)
// ---------------------------------------------------------------------------

export interface QuantAnalysisRequest {
  id: string;
  email: string;
  analysisType: string;
  dataDescription: string;
  variables: string;
  hypothesis: string;
  dataFormat: string;
  additionalNotes: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getQuantAnalysisRequests(): QuantAnalysisRequest[] {
  return readJson<QuantAnalysisRequest[]>('quant-analysis-requests', []);
}

export function getQuantAnalysisRequest(id: string): QuantAnalysisRequest | undefined {
  return getQuantAnalysisRequests().find((r) => r.id === id);
}

export function createQuantAnalysisRequest(
  data: Omit<QuantAnalysisRequest, 'id' | 'status' | 'createdAt' | 'adminResponse' | 'respondedAt'>,
): QuantAnalysisRequest {
  const requests = getQuantAnalysisRequests();
  const request: QuantAnalysisRequest = {
    id: generateId(),
    email: data.email,
    analysisType: data.analysisType,
    dataDescription: data.dataDescription,
    variables: data.variables,
    hypothesis: data.hypothesis,
    dataFormat: data.dataFormat,
    additionalNotes: data.additionalNotes,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('quant-analysis-requests', requests);
  return request;
}

export function updateQuantAnalysisRequest(id: string, patch: Partial<QuantAnalysisRequest>): QuantAnalysisRequest | undefined {
  const requests = getQuantAnalysisRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('quant-analysis-requests', requests);
  return requests[idx];
}

// Quant Analysis Chat Messages
export function getQuantAnalysisMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`quant-analysis-messages-${requestId}`, []);
}

export function addQuantAnalysisMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getQuantAnalysisMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`quant-analysis-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// Text Analysis Request (텍스트 분석 의뢰)
// ---------------------------------------------------------------------------

export interface TextAnalysisRequest {
  id: string;
  email: string;
  analysisTypes: string; // JSON array of selected analysis types
  dataInputMethod: string;
  textContent: string;
  analysisOptions: string; // JSON object of per-analysis options
  additionalNotes: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getTextAnalysisRequests(): TextAnalysisRequest[] {
  return readJson<TextAnalysisRequest[]>('text-analysis-requests', []);
}

export function getTextAnalysisRequest(id: string): TextAnalysisRequest | undefined {
  return getTextAnalysisRequests().find((r) => r.id === id);
}

export function createTextAnalysisRequest(
  data: Omit<TextAnalysisRequest, 'id' | 'status' | 'createdAt' | 'adminResponse' | 'respondedAt'>,
): TextAnalysisRequest {
  const requests = getTextAnalysisRequests();
  const request: TextAnalysisRequest = {
    id: generateId(),
    email: data.email,
    analysisTypes: data.analysisTypes,
    dataInputMethod: data.dataInputMethod,
    textContent: data.textContent,
    analysisOptions: data.analysisOptions,
    additionalNotes: data.additionalNotes,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('text-analysis-requests', requests);
  return request;
}

export function updateTextAnalysisRequest(id: string, patch: Partial<TextAnalysisRequest>): TextAnalysisRequest | undefined {
  const requests = getTextAnalysisRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('text-analysis-requests', requests);
  return requests[idx];
}

// Text Analysis Chat Messages
export function getTextAnalysisMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`text-analysis-messages-${requestId}`, []);
}

export function addTextAnalysisMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getTextAnalysisMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`text-analysis-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// Qual Analysis Request (질적분석)
// ---------------------------------------------------------------------------

export interface QualAnalysisRequest {
  id: string;
  email: string;
  analysisType: string;
  dataDescription: string;
  dataFormat: string;
  analysisGoal: string;
  additionalNotes: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

export function getQualAnalysisRequests(): QualAnalysisRequest[] {
  return readJson<QualAnalysisRequest[]>('qual-analysis-requests', []);
}

export function getQualAnalysisRequest(id: string): QualAnalysisRequest | undefined {
  return getQualAnalysisRequests().find((r) => r.id === id);
}

export function createQualAnalysisRequest(
  data: Omit<QualAnalysisRequest, 'id' | 'status' | 'createdAt' | 'adminResponse' | 'respondedAt'>,
): QualAnalysisRequest {
  const requests = getQualAnalysisRequests();
  const request: QualAnalysisRequest = {
    id: generateId(),
    email: data.email,
    analysisType: data.analysisType,
    dataDescription: data.dataDescription,
    dataFormat: data.dataFormat,
    analysisGoal: data.analysisGoal,
    additionalNotes: data.additionalNotes,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminResponse: '',
    respondedAt: '',
  };
  requests.push(request);
  writeJson('qual-analysis-requests', requests);
  return request;
}

export function updateQualAnalysisRequest(id: string, patch: Partial<QualAnalysisRequest>): QualAnalysisRequest | undefined {
  const requests = getQualAnalysisRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...patch, id };
  writeJson('qual-analysis-requests', requests);
  return requests[idx];
}

// Qual Analysis Chat Messages
export function getQualAnalysisMessages(requestId: string): ChatMessage[] {
  return readJson<ChatMessage[]>(`qual-analysis-messages-${requestId}`, []);
}

export function addQualAnalysisMessage(requestId: string, sender: 'user' | 'admin', message: string): ChatMessage {
  const messages = getQualAnalysisMessages(requestId);
  const msg: ChatMessage = {
    id: generateId(),
    requestId,
    sender,
    message,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  writeJson(`qual-analysis-messages-${requestId}`, messages);
  return msg;
}

// ---------------------------------------------------------------------------
// Contact Inquiries (문의사항)
// ---------------------------------------------------------------------------

export interface ContactInquiry {
  id: string;
  email: string;
  name: string;
  category: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied';
  createdAt: string;
  adminReply: string;
  repliedAt: string;
}

export function getContactInquiries(): ContactInquiry[] {
  return readJson<ContactInquiry[]>('contact-inquiries', []);
}

export function getContactInquiry(id: string): ContactInquiry | undefined {
  return getContactInquiries().find((r) => r.id === id);
}

export function createContactInquiry(
  data: Omit<ContactInquiry, 'id' | 'status' | 'createdAt' | 'adminReply' | 'repliedAt'>,
): ContactInquiry {
  const inquiries = getContactInquiries();
  const inquiry: ContactInquiry = {
    id: generateId(),
    email: data.email,
    name: data.name,
    category: data.category,
    subject: data.subject,
    message: data.message,
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminReply: '',
    repliedAt: '',
  };
  inquiries.push(inquiry);
  writeJson('contact-inquiries', inquiries);
  return inquiry;
}

export function updateContactInquiry(id: string, patch: Partial<ContactInquiry>): ContactInquiry | undefined {
  const inquiries = getContactInquiries();
  const idx = inquiries.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  inquiries[idx] = { ...inquiries[idx], ...patch, id };
  writeJson('contact-inquiries', inquiries);
  return inquiries[idx];
}
