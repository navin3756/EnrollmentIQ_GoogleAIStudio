import { EnrollmentFile, FileStatus, StagingRecord, DashboardStats, MappingRule, RoutingConfig, TransactionLog, SystemMetrics, TeamMember } from '../types';

// Simulate database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Persistent state within the session
let mockFiles: EnrollmentFile[] = [
  {
    fileId: 'f1',
    fileName: 'NYSOH_Daily_Preview_20231025.edi',
    fileSize: 10245,
    recordCount: 45,
    validRecords: 45,
    errorRecords: 0,
    status: FileStatus.PROCESSED,
    uploadDate: '2023-10-25T08:30:00',
    processedDate: '2023-10-25T08:35:00',
    ackStatus: 'Sent',
    targetFormat: 'JSON',
    fileType: 'DAILY_UPDATE'
  },
  {
    fileId: 'f2',
    fileName: 'EMEDNY_Roster_Truth_20231026.edi',
    fileSize: 12500,
    recordCount: 5,
    validRecords: 4,
    errorRecords: 1,
    status: FileStatus.REVIEW_NEEDED,
    uploadDate: '2023-10-26T09:15:00',
    ackStatus: 'Pending',
    targetFormat: 'JSON',
    fileType: 'MONTHLY_ROSTER'
  }
];

const mockStagingData: Record<string, StagingRecord[]> = {
  'f2': [
    // NY COMPLEXITY: SPLIT TRANSACTION WITH GAP
    // Transaction 1: Termination of previous coverage
    { 
      id: 1, fileId: 'f2', segmentType: 'INS', lineNumber: 10, subscriberId: 'NY882910', memberId: 'CIN1001', 
      firstName: 'Marcus', lastName: 'York', planCode: 'MD_SILVER', effectiveDate: '2023-01-01', isValid: true,
      dob: '1980-05-15', gender: 'M', address: '123 Empire Blvd', city: 'Albany', state: 'NY', zipCode: '12203', 
      relationship: 'Self', phoneNumber: '555-0101', email: 'marcus.york@email.com',
      maintenanceCode: '024', // TERM
      coverageEnd: '2023-10-31', // Ends Oct 31
      fipsCode: '36001', // Albany County
      dataSource: 'EMEDNY'
    },
    // Transaction 2: Re-instatement (Add) with a GAP
    { 
      id: 2, fileId: 'f2', segmentType: 'INS', lineNumber: 22, subscriberId: 'NY882910', memberId: 'CIN1001', 
      firstName: 'Marcus', lastName: 'York', planCode: 'MD_SILVER', effectiveDate: '2023-11-15', isValid: true,
      dob: '1980-05-15', gender: 'M', address: '123 Empire Blvd', city: 'Albany', state: 'NY', zipCode: '12203', 
      relationship: 'Self', phoneNumber: '555-0101', email: 'marcus.york@email.com',
      maintenanceCode: '021', // ADD
      fipsCode: '36001',
      dataSource: 'EMEDNY'
    },
    // Valid Record
    { 
      id: 3, fileId: 'f2', segmentType: 'INS', lineNumber: 40, subscriberId: 'NY991020', memberId: 'CIN2002', 
      firstName: 'Sarah', lastName: 'Connor', planCode: 'PPO_GOLD', effectiveDate: '2024-01-01', isValid: false, 
      errorMessage: 'Missing FIPS Code (N406) - Required for NYSOH Compliance',
      dob: '1992-11-20', gender: 'F', address: '789 Pine Rd', city: 'Buffalo', state: 'NY', zipCode: '14201',
      relationship: 'Self', phoneNumber: '555-0103', email: 's.connor@email.com',
      maintenanceCode: '021',
      dataSource: 'NYSOH',
      aiConfidence: 0.96,
      aiSuggestedFix: 'Infer FIPS Code: 36029 based on zipCode 14201 (Erie County)',
      aiRuleTriggered: 'ML_RULE_NY_FIPS_INFERENCE_08'
    },
    // Another Valid Record
    { 
      id: 4, fileId: 'f2', segmentType: 'INS', lineNumber: 55, subscriberId: 'NY771122', memberId: 'CIN3003', 
      firstName: 'John', lastName: 'Doe', planCode: 'HMO_BRONZE', effectiveDate: '2024-01-01', isValid: true,
      dob: '1985-03-10', gender: 'M', address: '456 State St', city: 'Rochester', state: 'NY', zipCode: '14604',
      relationship: 'Self', phoneNumber: '555-0104', email: 'j.doe@email.com',
      maintenanceCode: '021',
      fipsCode: '36055', // Monroe County
      dataSource: 'EMEDNY'
    },
  ]
};

const mockMappingRules: MappingRule[] = [
  // Header (Loop 0000)
  { id: '101', sourceSegment: 'BGN02', sourceElement: 'Transaction Set Identifier', targetField: 'fileReferenceId', isActive: true },
  { id: '102', sourceSegment: 'BGN03', sourceElement: 'Transaction Set Date', targetField: 'fileDate', transformation: 'CCYYMMDD to ISO', isActive: true },
  { id: '103', sourceSegment: 'BGN04', sourceElement: 'Transaction Set Time', targetField: 'fileTime', isActive: true },

  // Sponsor/Payer (Loop 1000)
  { id: '201', sourceSegment: 'N102', sourceElement: 'Plan Sponsor Name', targetField: 'sponsorName', transformation: 'Trim Whitespace', isActive: true },
  { id: '202', sourceSegment: 'N104', sourceElement: 'Sponsor Identifier', targetField: 'sponsorEin', isActive: true },
  { id: '203', sourceSegment: 'N102', sourceElement: 'Insurer Name', targetField: 'payerName', isActive: true },

  // Member Level (Loop 2000)
  { id: '301', sourceSegment: 'INS01', sourceElement: 'Yes/No Condition', targetField: 'isSubscriber', transformation: 'Y/N to Boolean', isActive: true },
  { id: '302', sourceSegment: 'INS02', sourceElement: 'Ind. Relationship Code', targetField: 'relationship', transformation: 'Code Lookup (18=Self)', isActive: true },
  { id: '303', sourceSegment: 'INS03', sourceElement: 'Maintenance Type Code', targetField: 'transactionType', isActive: true },
  { id: '304', sourceSegment: 'INS04', sourceElement: 'Maintenance Reason Code', targetField: 'changeReason', isActive: true },
  { id: '305', sourceSegment: 'REF02', sourceElement: 'Subscriber Identifier', targetField: 'subscriberId', transformation: 'Remove Hyphens', isActive: true },
  { id: '306', sourceSegment: 'REF02', sourceElement: 'Member Policy Number', targetField: 'policyNumber', isActive: true },

  // Member Name (Loop 2100A)
  { id: '401', sourceSegment: 'NM103', sourceElement: 'Name Last', targetField: 'lastName', isActive: true },
  { id: '402', sourceSegment: 'NM104', sourceElement: 'Name First', targetField: 'firstName', isActive: true },
  { id: '403', sourceSegment: 'NM105', sourceElement: 'Name Middle', targetField: 'middleName', isActive: true },
  { id: '404', sourceSegment: 'NM107', sourceElement: 'Name Suffix', targetField: 'suffix', isActive: true },
  { id: '405', sourceSegment: 'NM109', sourceElement: 'Identification Code', targetField: 'ssnOrMemberId', transformation: 'Mask PII', isActive: true },

  // Communication (Loop 2100A)
  { id: '501', sourceSegment: 'PER04', sourceElement: 'Communication Number', targetField: 'phoneNumber', transformation: 'Format (XXX) XXX-XXXX', isActive: true },
  { id: '502', sourceSegment: 'PER06', sourceElement: 'Communication Number', targetField: 'emailAddress', isActive: true },

  // Address (Loop 2100A)
  { id: '601', sourceSegment: 'N301', sourceElement: 'Address Information', targetField: 'addressLine1', isActive: true },
  { id: '602', sourceSegment: 'N302', sourceElement: 'Address Information', targetField: 'addressLine2', isActive: true },
  { id: '603', sourceSegment: 'N401', sourceElement: 'City Name', targetField: 'city', isActive: true },
  { id: '604', sourceSegment: 'N402', sourceElement: 'State or Province Code', targetField: 'state', isActive: true },
  { id: '605', sourceSegment: 'N403', sourceElement: 'Postal Code', targetField: 'zipCode', isActive: true },
  { id: '606', sourceSegment: 'N404', sourceElement: 'Country Code', targetField: 'country', isActive: true },

  // Demographics (Loop 2100A)
  { id: '701', sourceSegment: 'DMG02', sourceElement: 'Date Time Period', targetField: 'dateOfBirth', transformation: 'CCYYMMDD to ISO', isActive: true },
  { id: '702', sourceSegment: 'DMG03', sourceElement: 'Gender Code', targetField: 'gender', transformation: 'Map M/F/U', isActive: true },
  { id: '703', sourceSegment: 'DMG04', sourceElement: 'Marital Status Code', targetField: 'maritalStatus', isActive: true },
  { id: '704', sourceSegment: 'DMG05', sourceElement: 'Race or Ethnicity Code', targetField: 'ethnicity', isActive: true },

  // Health Coverage (Loop 2300)
  { id: '801', sourceSegment: 'HD01', sourceElement: 'Maintenance Type Code', targetField: 'coverageType', isActive: true },
  { id: '802', sourceSegment: 'HD03', sourceElement: 'Insurance Line Code', targetField: 'planType', isActive: true },
  { id: '803', sourceSegment: 'DTP03', sourceElement: 'Date Time Period (348)', targetField: 'benefitBeginDate', transformation: 'CCYYMMDD to ISO', isActive: true },
  { id: '804', sourceSegment: 'DTP03', sourceElement: 'Date Time Period (349)', targetField: 'benefitEndDate', transformation: 'CCYYMMDD to ISO', isActive: true },

  // Provider (Loop 2310)
  { id: '901', sourceSegment: 'NM103', sourceElement: 'Provider Last Name', targetField: 'pcpLastName', isActive: true },
  { id: '902', sourceSegment: 'NM109', sourceElement: 'Provider Identifier', targetField: 'pcpNpi', isActive: true },
];

const mockRouting: RoutingConfig[] = [
  { id: '1', name: 'Internal Data Warehouse', type: 'DB', endpoint: 'sql-prod-01.internal', status: 'Active' },
  { id: '2', name: 'Partner SFTP - HealthCare Plus', type: 'SFTP', endpoint: 'sftp.hcp.com/inbound', status: 'Active' },
  { id: '3', name: 'Real-time Enrollment API', type: 'API', endpoint: 'api.enroll.com/v1/sync', status: 'Inactive' },
];

const mockLogs: TransactionLog[] = [
  { id: 'l1', timestamp: '2023-10-25T08:30:05', fileId: 'f1', event: 'Ingestion', status: 'Success', details: 'File uploaded via SFTP source.' },
  { id: 'l2', timestamp: '2023-10-25T08:30:10', fileId: 'f1', event: 'Validation', status: 'Success', details: 'Schema 5010 verified successfully.' },
  { id: 'l3', timestamp: '2023-10-25T08:30:15', fileId: 'f1', event: 'Transformation', status: 'Success', details: 'Mapped to target JSON profile.' },
  { id: 'l4', timestamp: '2023-10-25T08:30:20', fileId: 'f1', event: 'Routing', status: 'Success', details: 'Delivered to Partner SFTP.' },
  { id: 'l5', timestamp: '2023-10-25T08:35:00', fileId: 'f1', event: 'ACK_Received', status: 'Success', details: '997 Functional Acknowledgment received (Accepted).' },
];

const mockTeam: TeamMember[] = [
  { id: 't1', name: 'Admin User', email: 'admin@x12bridge.io', role: 'Admin', avatar: 'AD', status: 'Active', lastActive: '2 mins ago' },
  { id: 't2', name: 'Sarah Chen', email: 'sarah.c@x12bridge.io', role: 'Editor', avatar: 'SC', status: 'Active', lastActive: '1 hour ago' },
  { id: 't3', name: 'Marcus Bell', email: 'marcus@x12bridge.io', role: 'Auditor', avatar: 'MB', status: 'Active', lastActive: 'Yesterday' },
  { id: 't4', name: 'Elena Rodriguez', email: 'elena@x12bridge.io', role: 'Editor', avatar: 'ER', status: 'Pending', lastActive: 'Never' },
];

export const ApiService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(500);
    const realFiles = await ApiService.getFiles();
    const pending = realFiles.filter(f => f.status === FileStatus.REVIEW_NEEDED).length;
    const errors = realFiles.reduce((acc, f) => acc + f.errorRecords, 0);
    const members = realFiles.reduce((acc, f) => acc + f.recordCount, 0);

    return {
      totalFiles: realFiles.length + 143,
      totalMembers: 10420 + members,
      pendingReviews: pending,
      processingErrors: errors,
      mappingCount: mockMappingRules.length,
      routingActive: mockRouting.length,
      ackSuccessRate: 99.4,
      aiCorrectedRecords: 8945,
      costSaved: '$4.2M',
      accuracy: 96.8
    };
  },

  getFiles: async (): Promise<EnrollmentFile[]> => {
    const response = await fetch('/api/files');
    if (response.ok) {
        const files = await response.json();
        return [...files, ...mockFiles];
    }
    await delay(600);
    return [...mockFiles];
  },

  getMappingRules: async (): Promise<MappingRule[]> => {
    await delay(400);
    return [...mockMappingRules];
  },

  getRoutingConfigs: async (): Promise<RoutingConfig[]> => {
    await delay(400);
    return [...mockRouting];
  },

  getLogs: async (): Promise<TransactionLog[]> => {
    await delay(500);
    return [...mockLogs];
  },

  getSystemMetrics: async (): Promise<SystemMetrics> => {
    await delay(300);
    return {
      cpuUsage: 42,
      memoryUsage: 68,
      activeWorkers: 8,
      queueDepth: 14,
      avgLatency: 124
    };
  },

  getTeamMembers: async (): Promise<TeamMember[]> => {
    await delay(500);
    return [...mockTeam];
  },

  uploadFile: async (fileName: string): Promise<EnrollmentFile> => {
    throw new Error('Use direct fetch for file upload');
  },

  getStagingData: async (fileId: string): Promise<StagingRecord[]> => {
    if (fileId.startsWith('f_')) {
      const response = await fetch(`/api/staging/${fileId}`);
      if (response.ok) {
        return await response.json();
      }
    }
    await delay(800);
    return mockStagingData[fileId] || [];
  },

  updateStagingRecord: async (fileId: string, recordId: number, updates: Partial<StagingRecord>): Promise<StagingRecord> => {
    if (fileId.startsWith('f_')) {
      const response = await fetch(`/api/staging/${fileId}/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        return await response.json();
      }
    }
    await delay(500);
    const records = mockStagingData[fileId];
    if (!records) throw new Error('File not found');
    
    const index = records.findIndex(r => r.id === recordId);
    if (index === -1) throw new Error('Record not found');
    
    // Mock successful fix logic
    const updatedRecord = { 
        ...records[index], 
        ...updates, 
        isValid: true, 
        errorMessage: undefined 
    };
    records[index] = updatedRecord;

    // Update the file summary
    const file = mockFiles.find(f => f.fileId === fileId);
    if (file) {
        file.validRecords = records.filter(r => r.isValid).length;
        file.errorRecords = records.filter(r => !r.isValid).length;
        if (file.errorRecords === 0) {
            file.status = FileStatus.READY_TO_PROCESS;
        }
    }

    return updatedRecord;
  },

  processFile: async (fileId: string): Promise<boolean> => {
    if (fileId.startsWith('f_')) {
      const response = await fetch(`/api/process/${fileId}`, { method: 'POST' });
      if (response.ok) return true;
    }
    await delay(2000);
    const fileIndex = mockFiles.findIndex(f => f.fileId === fileId);
    if (fileIndex > -1) {
      mockFiles[fileIndex].status = FileStatus.PROCESSED;
      mockFiles[fileIndex].processedDate = new Date().toISOString();
      mockFiles[fileIndex].ackStatus = 'Sent';
      
      // Add a log entry for completion
      mockLogs.unshift({
          id: `l${Date.now()}`,
          timestamp: new Date().toISOString(),
          fileId,
          event: 'Routing',
          status: 'Success',
          details: `Successfully transformed to JSON and delivered to configured endpoints.`
      });
    }
    return true;
  }
};