export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type DocumentStatus = 'PENDING' | 'PROCESSED' | 'REVIEWED' | 'ARCHIVED';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'COMPLETED' | 'REJECTED' | 'OVERDUE';

export type SubmissionStatus = 'NOT_SUBMITTED' | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESUBMISSION_REQUIRED';

export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RiskCategory = 'SAFETY' | 'COMPLIANCE' | 'OPERATIONAL' | 'FINANCIAL' | 'INFRASTRUCTURE';

export type DepartmentName = 
  | 'Safety'
  | 'Engineering'
  | 'Operations'
  | 'Finance'
  | 'HR'
  | 'Legal'
  | 'Procurement'
  | 'Maintenance';

export type UserRole = 'ADMIN' | 'MANAGER' | 'OFFICER' | 'AUDITOR' | 'VIEWER';

export type LanguageCode = 'en' | 'ml' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: DepartmentName;
  avatarUrl?: string;
  designation?: string;
  permissions?: string[];
}

export interface DocumentTimelineEntry {
  date: string;
  stage: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface DocumentEntity {
  id: string;
  name: string;
  type: 'STATION' | 'DEPARTMENT' | 'POLICY' | 'OFFICER' | 'ASSET' | 'EQUIPMENT' | 'REGULATION';
  occurrences: number;
}

export interface ExtractedAction {
  id: string;
  task: string;
  department: DepartmentName;
  assignedPerson?: string;
  priority: PriorityLevel;
  deadline: string;
  status: TaskStatus;
  evidenceRequired?: string;
  sourceReference: string;
}

export interface ExtractedRisk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  category: RiskCategory;
  station?: string;
  recommendedMitigation: string;
  sourceReference: string;
}

export interface DocumentConflict {
  id: string;
  documentAId: string;
  documentAName: string;
  documentARequirement: string;
  documentBId: string;
  documentBName: string;
  documentBRequirement: string;
  conflictType: 'FREQUENCY_MISMATCH' | 'SAFETY_STANDARD' | 'APPROVAL_HIERARCHY';
  recommendedResolution: string;
  detectedAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'PNG' | 'JPG' | 'TXT';
  fileSize: string;
  department: DepartmentName;
  language: 'English' | 'Malayalam' | 'Hindi' | 'Bilingual (EN/ML)' | 'Multilingual';
  aiPriority: PriorityLevel;
  humanPriority?: PriorityLevel;
  priorityOverrideReason?: string;
  priorityChangedBy?: string;
  priorityChangedAt?: string;
  status: DocumentStatus;
  aiConfidence: number; // e.g. 96
  aiPriorityReason: string;
  summary: string;
  keyFacts: string[];
  receivedDate: string;
  createdDate: string;
  submissionDeadline?: string;
  expectedCompletion?: string;
  assignedTo: string;
  riskScore: number; // 0 - 100
  station?: string;
  storagePath: string;
  versions?: { version: string; year: string; requirement: string }[];
  timeline: DocumentTimelineEntry[];
  entities: DocumentEntity[];
  actions: ExtractedAction[];
  risks: ExtractedRisk[];
  conflicts?: DocumentConflict[];
  rawContentSnippet?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  sourceDocumentId: string;
  sourceDocumentName: string;
  department: DepartmentName;
  assignedPerson: string;
  priority: PriorityLevel;
  createdDate: string;
  deadline: string;
  status: TaskStatus;
  evidenceUrl?: string;
  evidenceFileName?: string;
  evidenceUploadedAt?: string;
  completionDate?: string;
  station?: string;
}

export interface KnowledgeGraphNodeData {
  [key: string]: any;
  label: string;
  type: 'DOCUMENT' | 'DEPARTMENT' | 'STATION' | 'TASK' | 'RISK' | 'POLICY' | 'OFFICER';
  priority?: PriorityLevel;
  department?: DepartmentName;
  station?: string;
  metrics?: {
    relatedDocs?: number;
    openActions?: number;
    criticalRisks?: number;
    upcomingDeadlines?: number;
  };
  details?: string;
  documentId?: string;
}

export interface KnowledgeGraphEdgeData {
  label: string;
  relationshipType: 'GOVERNS' | 'LOCATED_AT' | 'ASSIGNED_TO' | 'TRIGGERS' | 'MITIGATES' | 'VIOLATES';
}

export interface NotificationItem {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTo?: string;
  targetId?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}

export interface AIProviderStatus {
  provider: 'Gemini' | 'Grok' | 'Mock AI';
  model: string;
  connected: boolean;
  latencyMs: number;
}
