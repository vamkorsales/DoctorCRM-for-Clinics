export interface ClinicProfile {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  licenseNumber: string;
  registrationNumber: string;
  taxId: string;
  establishedDate: string;
  description?: string;
  specialties: string[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  emergencyContact: {
    name: string;
    phone: string;
    email: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaxationSettings {
  id: string;
  taxId: string;
  taxName: string;
  defaultTaxRate: number;
  taxTypes: TaxType[];
  exemptions: TaxExemption[];
  reportingPeriod: 'monthly' | 'quarterly' | 'annually';
  filingDeadlines: {
    monthly?: string;
    quarterly?: string;
    annually?: string;
  };
  taxAuthority: {
    name: string;
    address: string;
    phone: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaxType {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  appliesTo: 'services' | 'products' | 'all';
  isActive: boolean;
}

interface TaxExemption {
  id: string;
  name: string;
  description: string;
  exemptionCode: string;
  appliesTo: string[];
  isActive: boolean;
}

export interface BankingDetails {
  id: string;
  primaryAccount: BankAccount;
  secondaryAccounts: BankAccount[];
  paymentMethods: PaymentMethodConfig[];
  merchantAccounts: MerchantAccount[];
  autoDeposit: boolean;
  reconciliationSettings: {
    autoReconcile: boolean;
    reconciliationPeriod: 'daily' | 'weekly' | 'monthly';
    toleranceAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings' | 'business';
  currency: string;
  isActive: boolean;
  isPrimary: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  method: 'cash' | 'credit-card' | 'debit-card' | 'check' | 'bank-transfer' | 'online' | 'insurance';
  isEnabled: boolean;
  processingFee: number;
  feeType: 'percentage' | 'fixed';
  provider?: string;
  settings: Record<string, any>;
}

interface MerchantAccount {
  id: string;
  provider: string;
  merchantId: string;
  apiKey: string;
  isActive: boolean;
  supportedMethods: string[];
  fees: {
    transactionFee: number;
    monthlyFee: number;
    setupFee: number;
  };
}

export interface DataManagementSettings {
  id: string;
  backupSettings: {
    autoBackup: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number; // in days
    backupLocation: 'local' | 'cloud' | 'both';
    encryptBackups: boolean;
  };
  dataRetention: {
    patientRecords: number; // years
    appointmentHistory: number; // years
    billingRecords: number; // years
    auditLogs: number; // years
    deletedRecords: number; // days
  };
  exportSettings: {
    allowedFormats: string[];
    maxRecordsPerExport: number;
    requireApproval: boolean;
  };
  importSettings: {
    allowedSources: string[];
    validateData: boolean;
    requireMapping: boolean;
  };
  archivalSettings: {
    autoArchive: boolean;
    archiveAfter: number; // years
    archiveLocation: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSettings {
  id: string;
  template: {
    templateId: string;
    logoPosition: 'top-left' | 'top-center' | 'top-right';
    colorScheme: string;
    fontSize: 'small' | 'medium' | 'large';
    includeClinicInfo: boolean;
    includePatientInfo: boolean;
    includeTaxBreakdown: boolean;
  };
  numbering: {
    prefix: string;
    suffix: string;
    startingNumber: number;
    resetPeriod: 'never' | 'yearly' | 'monthly';
    padWithZeros: boolean;
    minimumDigits: number;
  };
  paymentTerms: {
    defaultTerms: string;
    availableTerms: string[];
    lateFeeRate: number;
    lateFeeGracePeriod: number; // days
  };
  reminders: {
    enableReminders: boolean;
    reminderSchedule: ReminderSchedule[];
    reminderTemplate: string;
  };
  automation: {
    autoSend: boolean;
    autoSendDelay: number; // hours
    autoMarkPaid: boolean;
    autoApplyLateFees: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface ReminderSchedule {
  id: string;
  daysBefore: number;
  reminderType: 'email' | 'sms' | 'both';
  isActive: boolean;
}

export interface PrescriptionSettings {
  id: string;
  template: {
    headerInfo: boolean;
    doctorSignature: boolean;
    clinicLogo: boolean;
    watermark: boolean;
  };
  validation: {
    requireDEANumber: boolean;
    validateDrugInteractions: boolean;
    checkAllergies: boolean;
    requireDiagnosis: boolean;
  };
  ePrescribing: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    defaultPharmacy: string;
  };
  controlledSubstances: {
    requireAdditionalAuth: boolean;
    logAllAccess: boolean;
    restrictedUsers: string[];
  };
  printing: {
    securityPaper: boolean;
    watermark: boolean;
    duplicateCopies: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  id: string;
  email: {
    enabled: boolean;
    smtpServer: string;
    smtpPort: number;
    username: string;
    password: string;
    fromAddress: string;
    fromName: string;
    useSSL: boolean;
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    fromNumber: string;
  };
  push: {
    enabled: boolean;
    provider: string;
    apiKey: string;
  };
  appointmentReminders: {
    enabled: boolean;
    reminderTimes: number[]; // hours before appointment
    methods: ('email' | 'sms' | 'push')[];
  };
  billingReminders: {
    enabled: boolean;
    reminderSchedule: number[]; // days after due date
    methods: ('email' | 'sms')[];
  };
  systemAlerts: {
    enabled: boolean;
    alertTypes: string[];
    recipients: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface SecuritySettings {
  id: string;
  authentication: {
    requireTwoFactor: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expirationDays: number;
    };
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
  };
  dataEncryption: {
    encryptAtRest: boolean;
    encryptInTransit: boolean;
    encryptionAlgorithm: string;
  };
  auditLogging: {
    enabled: boolean;
    logLevel: 'basic' | 'detailed' | 'comprehensive';
    retentionPeriod: number; // days
    logActions: string[];
  };
  accessControl: {
    roleBasedAccess: boolean;
    ipWhitelist: string[];
    allowRemoteAccess: boolean;
    requireVPN: boolean;
  };
  compliance: {
    hipaaCompliant: boolean;
    gdprCompliant: boolean;
    soxCompliant: boolean;
    customCompliance: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationSettings {
  id: string;
  ehr: {
    enabled: boolean;
    provider: string;
    apiEndpoint: string;
    apiKey: string;
    syncFrequency: 'realtime' | 'hourly' | 'daily';
  };
  laboratory: {
    enabled: boolean;
    providers: LabProvider[];
    defaultProvider: string;
  };
  pharmacy: {
    enabled: boolean;
    providers: PharmacyProvider[];
    defaultProvider: string;
  };
  insurance: {
    enabled: boolean;
    providers: InsuranceProvider[];
    eligibilityCheck: boolean;
    claimSubmission: boolean;
  };
  accounting: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    syncTransactions: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface LabProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  apiKey: string;
  supportedTests: string[];
  isActive: boolean;
}

interface PharmacyProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  apiKey: string;
  supportedServices: string[];
  isActive: boolean;
}

interface InsuranceProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  apiKey: string;
  supportedServices: string[];
  isActive: boolean;
}

export interface SystemSettings {
  id: string;
  general: {
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  features: {
    enableAppointments: boolean;
    enableBilling: boolean;
    enablePrescriptions: boolean;
    enableReports: boolean;
    enableIntegrations: boolean;
  };
  limits: {
    maxPatients: number;
    maxDoctors: number;
    maxAppointmentsPerDay: number;
    maxFileSize: number; // MB
    maxStorageSpace: number; // GB
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    scheduledMaintenance: string[];
  };
  createdAt: string;
  updatedAt: string;
}