// Matching Backend Models/EnrollmentFile.ts
export interface EnrollmentFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  validRecords: number;
  errorRecords: number;
  status: FileStatus;
  uploadDate: string;
  processedDate?: string;
  ackStatus?: 'Pending' | 'Sent' | 'Failed';
  targetFormat?: 'JSON' | 'CSV' | 'XML' | 'SQL';
  fileType?: 'DAILY_UPDATE' | 'MONTHLY_ROSTER' | 'AUDIT_FILE'; // NYS Specific
}

export enum FileStatus {
  UPLOADED = 'Uploaded',
  STAGING = 'Staging',
  REVIEW_NEEDED = 'Review Needed',
  MAPPING = 'Mapping',
  READY_TO_PROCESS = 'Ready',
  PROCESSED = 'Processed',
  FAILED = 'Failed'
}

export interface MappingRule {
  id: string;
  sourceSegment: string;
  sourceElement: string;
  targetField: string;
  transformation?: string;
  isActive: boolean;
}

export interface RoutingConfig {
  id: string;
  name: string;
  type: 'SFTP' | 'API' | 'S3' | 'DB';
  endpoint: string;
  status: 'Active' | 'Inactive';
}

export interface TransactionLog {
  id: string;
  timestamp: string;
  fileId: string;
  event: 'Ingestion' | 'Validation' | 'Transformation' | 'Routing' | 'ACK_Received';
  status: 'Success' | 'Warning' | 'Error';
  details: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeWorkers: number;
  queueDepth: number;
  avgLatency: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Auditor';
  avatar: string;
  status: 'Active' | 'Pending';
  lastActive: string;
}

export interface HelpCategory {
  title: string;
  items: {
    q: string;
    a: string;
  }[];
}

// Matching Backend Models/StagingRecord.cs
export interface StagingRecord {
  id: number;
  fileId: string;
  segmentType: string; // INS, REF, NM1, etc.
  lineNumber: number;
  subscriberId: string;
  memberId: string;
  firstName: string;
  lastName: string;
  planCode: string;
  effectiveDate: string;
  isValid: boolean;
  errorMessage?: string;
  // Extended details for Modal
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  ssn?: string; // DEF-004: Added SSN
  coverageEnd?: string;
  // NY Specifics
  maintenanceCode?: string; // 021 (Add), 024 (Term), 001 (Change)
  fipsCode?: string; // N406
  dataSource?: 'NYSOH' | 'EMEDNY';
  // AI Remediation
  aiConfidence?: number;
  aiSuggestedFix?: string;
  aiRuleTriggered?: string;
  isAiApproved?: boolean;
  history?: {
    timestamp: string;
    user: string;
    changes: { field: string; oldValue: any; newValue: any }[];
    remediationSource: 'AI_AUTOCORRECT' | 'MANUAL_OVERRIDE';
  }[];
}

export interface DashboardStats {
  totalFiles: number;
  totalMembers: number;
  pendingReviews: number;
  processingErrors: number;
  mappingCount: number;
  routingActive: number;
  ackSuccessRate: number;
  aiCorrectedRecords?: number;
  costSaved?: string;
  accuracy?: number;
}