import { 
  ClinicProfile, 
  TaxationSettings, 
  BankingDetails, 
  DataManagementSettings,
  InvoiceSettings,
  PrescriptionSettings,
  NotificationSettings,
  SecuritySettings,
  IntegrationSettings,
  SystemSettings
} from '../types/settings';

export const mockClinicProfile: ClinicProfile = {
  id: 'CLINIC-001',
  name: 'Health Insights Medical Center',
  address: {
    street: '123 Medical Plaza Drive',
    city: 'Springfield',
    state: 'Illinois',
    zipCode: '62701',
    country: 'United States'
  },
  phone: '(555) 123-4567',
  email: 'info@healthinsights.com',
  website: 'https://www.healthinsights.com',
  licenseNumber: 'MED-IL-123456',
  registrationNumber: 'REG-789012',
  taxId: '12-3456789',
  establishedDate: '2015-01-15',
  description: 'A comprehensive healthcare facility providing quality medical services to the community.',
  specialties: ['General Practice', 'Cardiology', 'Pediatrics', 'Internal Medicine'],
  operatingHours: {
    monday: { open: '08:00', close: '18:00', isOpen: true },
    tuesday: { open: '08:00', close: '18:00', isOpen: true },
    wednesday: { open: '08:00', close: '18:00', isOpen: true },
    thursday: { open: '08:00', close: '18:00', isOpen: true },
    friday: { open: '08:00', close: '17:00', isOpen: true },
    saturday: { open: '09:00', close: '14:00', isOpen: true },
    sunday: { open: '00:00', close: '00:00', isOpen: false }
  },
  emergencyContact: {
    name: 'Dr. Emergency Response',
    phone: '(555) 911-0000',
    email: 'emergency@healthinsights.com'
  },
  socialMedia: {
    facebook: 'https://facebook.com/healthinsights',
    twitter: 'https://twitter.com/healthinsights',
    linkedin: 'https://linkedin.com/company/healthinsights'
  },
  createdAt: '2015-01-15T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

export const mockTaxationSettings: TaxationSettings = {
  id: 'TAX-001',
  taxId: '12-3456789',
  taxName: 'Medical Services Tax',
  defaultTaxRate: 8.5,
  taxTypes: [
    {
      id: 'TAX-TYPE-001',
      name: 'Medical Services Tax',
      rate: 8.5,
      type: 'percentage',
      appliesTo: 'services',
      isActive: true
    },
    {
      id: 'TAX-TYPE-002',
      name: 'Medical Supplies Tax',
      rate: 6.25,
      type: 'percentage',
      appliesTo: 'products',
      isActive: true
    }
  ],
  exemptions: [
    {
      id: 'EXEMPT-001',
      name: 'Emergency Services',
      description: 'Emergency medical services are tax exempt',
      exemptionCode: 'EMRG-001',
      appliesTo: ['emergency-consultation', 'emergency-procedure'],
      isActive: true
    }
  ],
  reportingPeriod: 'quarterly',
  filingDeadlines: {
    quarterly: '15th of month following quarter end',
    annually: 'March 15th'
  },
  taxAuthority: {
    name: 'Illinois Department of Revenue',
    address: '100 W Randolph St, Chicago, IL 60601',
    phone: '(217) 782-3336',
    website: 'https://www2.illinois.gov/rev'
  },
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

export const mockBankingDetails: BankingDetails = {
  id: 'BANK-001',
  primaryAccount: {
    id: 'ACC-001',
    bankName: 'First National Bank',
    accountName: 'Health Insights Medical Center',
    accountNumber: '****1234',
    routingNumber: '071000013',
    accountType: 'business',
    currency: 'USD',
    isActive: true,
    isPrimary: true
  },
  secondaryAccounts: [
    {
      id: 'ACC-002',
      bankName: 'Community Savings Bank',
      accountName: 'Health Insights Savings',
      accountNumber: '****5678',
      routingNumber: '071000014',
      accountType: 'savings',
      currency: 'USD',
      isActive: true,
      isPrimary: false
    }
  ],
  paymentMethods: [
    {
      id: 'PM-001',
      method: 'credit-card',
      isEnabled: true,
      processingFee: 2.9,
      feeType: 'percentage',
      provider: 'Stripe',
      settings: { acceptedCards: ['visa', 'mastercard', 'amex'] }
    },
    {
      id: 'PM-002',
      method: 'cash',
      isEnabled: true,
      processingFee: 0,
      feeType: 'fixed',
      settings: {}
    },
    {
      id: 'PM-003',
      method: 'check',
      isEnabled: true,
      processingFee: 1.50,
      feeType: 'fixed',
      settings: {}
    }
  ],
  merchantAccounts: [
    {
      id: 'MERCH-001',
      provider: 'Stripe',
      merchantId: 'acct_1234567890',
      apiKey: 'sk_test_***',
      isActive: true,
      supportedMethods: ['credit-card', 'debit-card'],
      fees: {
        transactionFee: 2.9,
        monthlyFee: 0,
        setupFee: 0
      }
    }
  ],
  autoDeposit: true,
  reconciliationSettings: {
    autoReconcile: true,
    reconciliationPeriod: 'daily',
    toleranceAmount: 5.00
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

const mockDataManagementSettings: DataManagementSettings = {
  id: 'DATA-001',
  backupSettings: {
    autoBackup: true,
    frequency: 'daily',
    retentionPeriod: 90,
    backupLocation: 'cloud',
    encryptBackups: true
  },
  dataRetention: {
    patientRecords: 7,
    appointmentHistory: 5,
    billingRecords: 7,
    auditLogs: 2,
    deletedRecords: 30
  },
  exportSettings: {
    allowedFormats: ['CSV', 'PDF', 'Excel'],
    maxRecordsPerExport: 10000,
    requireApproval: true
  },
  importSettings: {
    allowedSources: ['CSV', 'Excel', 'HL7'],
    validateData: true,
    requireMapping: true
  },
  archivalSettings: {
    autoArchive: true,
    archiveAfter: 5,
    archiveLocation: 'cloud-archive'
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

const mockInvoiceSettings: InvoiceSettings = {
  id: 'INV-SET-001',
  template: {
    templateId: 'TEMP-001',
    logoPosition: 'top-left',
    colorScheme: '#1f2937',
    fontSize: 'medium',
    includeClinicInfo: true,
    includePatientInfo: true,
    includeTaxBreakdown: true
  },
  numbering: {
    prefix: 'INV',
    suffix: '',
    startingNumber: 1000,
    resetPeriod: 'yearly',
    padWithZeros: true,
    minimumDigits: 4
  },
  paymentTerms: {
    defaultTerms: 'Net 30',
    availableTerms: ['Due on Receipt', 'Net 15', 'Net 30', 'Net 60'],
    lateFeeRate: 1.5,
    lateFeeGracePeriod: 5
  },
  reminders: {
    enableReminders: true,
    reminderSchedule: [
      { id: 'REM-001', daysBefore: 7, reminderType: 'email', isActive: true },
      { id: 'REM-002', daysBefore: 1, reminderType: 'email', isActive: true },
      { id: 'REM-003', daysBefore: -7, reminderType: 'both', isActive: true }
    ],
    reminderTemplate: 'default'
  },
  automation: {
    autoSend: false,
    autoSendDelay: 24,
    autoMarkPaid: false,
    autoApplyLateFees: false
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

const mockPrescriptionSettings: PrescriptionSettings = {
  id: 'PRESC-001',
  template: {
    headerInfo: true,
    doctorSignature: true,
    clinicLogo: true,
    watermark: true
  },
  validation: {
    requireDEANumber: true,
    validateDrugInteractions: true,
    checkAllergies: true,
    requireDiagnosis: true
  },
  ePrescribing: {
    enabled: false,
    provider: '',
    apiKey: '',
    defaultPharmacy: ''
  },
  controlledSubstances: {
    requireAdditionalAuth: true,
    logAllAccess: true,
    restrictedUsers: []
  },
  printing: {
    securityPaper: true,
    watermark: true,
    duplicateCopies: 2
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

const mockNotificationSettings: NotificationSettings = {
  id: 'NOTIF-001',
  email: {
    enabled: true,
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    username: 'notifications@healthinsights.com',
    password: '***',
    fromAddress: 'notifications@healthinsights.com',
    fromName: 'Health Insights Medical Center',
    useSSL: true
  },
  sms: {
    enabled: true,
    provider: 'Twilio',
    apiKey: '***',
    fromNumber: '+15551234567'
  },
  push: {
    enabled: false,
    provider: '',
    apiKey: ''
  },
  appointmentReminders: {
    enabled: true,
    reminderTimes: [24, 2],
    methods: ['email', 'sms']
  },
  billingReminders: {
    enabled: true,
    reminderSchedule: [7, 14, 30],
    methods: ['email']
  },
  systemAlerts: {
    enabled: true,
    alertTypes: ['system-errors', 'security-alerts', 'backup-failures'],
    recipients: ['admin@healthinsights.com']
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

const mockSecuritySettings: SecuritySettings = {
  id: 'SEC-001',
  authentication: {
    requireTwoFactor: true,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  },
  dataEncryption: {
    encryptAtRest: true,
    encryptInTransit: true,
    encryptionAlgorithm: 'AES-256'
  },
  auditLogging: {
    enabled: true,
    logLevel: 'comprehensive',
    retentionPeriod: 365,
    logActions: ['login', 'logout', 'data-access', 'data-modification', 'system-changes']
  },
  accessControl: {
    roleBasedAccess: true,
    ipWhitelist: [],
    allowRemoteAccess: true,
    requireVPN: false
  },
  compliance: {
    hipaaCompliant: true,
    gdprCompliant: true,
    soxCompliant: false,
    customCompliance: []
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

const mockIntegrationSettings: IntegrationSettings = {
  id: 'INT-001',
  ehr: {
    enabled: false,
    provider: '',
    apiEndpoint: '',
    apiKey: '',
    syncFrequency: 'daily'
  },
  laboratory: {
    enabled: false,
    providers: [],
    defaultProvider: ''
  },
  pharmacy: {
    enabled: false,
    providers: [],
    defaultProvider: ''
  },
  insurance: {
    enabled: false,
    providers: [],
    eligibilityCheck: false,
    claimSubmission: false
  },
  accounting: {
    enabled: false,
    provider: '',
    apiKey: '',
    syncTransactions: false
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};

const mockSystemSettings: SystemSettings = {
  id: 'SYS-001',
  general: {
    timezone: 'America/Chicago',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    language: 'en',
    theme: 'light'
  },
  features: {
    enableAppointments: true,
    enableBilling: true,
    enablePrescriptions: true,
    enableReports: true,
    enableIntegrations: false
  },
  limits: {
    maxPatients: 10000,
    maxDoctors: 50,
    maxAppointmentsPerDay: 500,
    maxFileSize: 10,
    maxStorageSpace: 100
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: 'System is currently under maintenance. Please try again later.',
    scheduledMaintenance: []
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z'
};