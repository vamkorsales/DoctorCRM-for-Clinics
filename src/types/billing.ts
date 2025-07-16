export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  items: InvoiceItem[];
  subtotal: number;
  discounts: Discount[];
  taxes: Tax[];
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentTerms: string;
  notes?: string;
  insuranceClaim?: InsuranceClaim;
  paymentHistory: Payment[];
  remindersSent: number;
  lastReminderDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface InvoiceItem {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceType: 'consultation' | 'procedure' | 'medication' | 'lab-test' | 'supply' | 'room' | 'custom';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount?: number;
  taxAmount?: number;
  category: string;
  providedBy?: string; // doctor or staff member
  providedDate: string;
}

export interface Service {
  id: string;
  name: string;
  type: 'consultation' | 'procedure' | 'medication' | 'lab-test' | 'supply' | 'room' | 'administrative' | 'custom';
  category: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  doctorSpecific: boolean;
  doctorPricing?: DoctorPricing[];
  insuranceCoverage?: InsuranceCoverage[];
  taxable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DoctorPricing {
  doctorId: string;
  price: number;
  emergencyPrice?: number;
  afterHoursPrice?: number;
  followUpPrice?: number;
}

interface InsuranceCoverage {
  insuranceProvider: string;
  coveragePercentage: number;
  maxCoverage?: number;
  requiresPreAuth: boolean;
}

interface Discount {
  id: string;
  type: 'percentage' | 'fixed' | 'package';
  name: string;
  value: number;
  appliedTo: 'total' | 'item' | 'service-type';
  conditions?: DiscountCondition[];
  validFrom?: string;
  validTo?: string;
}

interface DiscountCondition {
  type: 'minimum-amount' | 'patient-type' | 'service-count' | 'loyalty';
  value: any;
}

interface Tax {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  appliedTo: 'subtotal' | 'item';
  isActive: boolean;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'credit-card' | 'debit-card' | 'check' | 'bank-transfer' | 'insurance' | 'online';
  transactionId?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedBy: string;
  notes?: string;
  createdAt: string;
}

interface InsuranceClaim {
  id: string;
  claimNumber: string;
  insuranceProvider: string;
  policyNumber: string;
  claimAmount: number;
  approvedAmount?: number;
  status: 'submitted' | 'pending' | 'approved' | 'denied' | 'partial' | 'paid';
  submittedDate: string;
  responseDate?: string;
  denialReason?: string;
  documents: ClaimDocument[];
  notes?: string;
}

interface ClaimDocument {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadDate: string;
}

interface PaymentPlan {
  id: string;
  invoiceId: string;
  totalAmount: number;
  installments: PaymentInstallment[];
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  createdDate: string;
  notes?: string;
}

interface PaymentInstallment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
}

export interface BillingReport {
  id: string;
  type: 'revenue' | 'outstanding' | 'payments' | 'insurance' | 'doctor-earnings' | 'service-analysis';
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  filters: ReportFilters;
  data: any;
  summary: ReportSummary;
  generatedAt: string;
  generatedBy: string;
}

interface ReportFilters {
  doctorIds?: string[];
  patientIds?: string[];
  serviceTypes?: string[];
  paymentMethods?: string[];
  insuranceProviders?: string[];
  status?: string[];
}

interface ReportSummary {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  outstandingAmount: number;
  averageInvoiceAmount: number;
  topServices: ServiceSummary[];
  topDoctors: DoctorEarnings[];
}

interface ServiceSummary {
  serviceId: string;
  serviceName: string;
  totalRevenue: number;
  totalQuantity: number;
  averagePrice: number;
}

interface DoctorEarnings {
  doctorId: string;
  doctorName: string;
  totalEarnings: number;
  totalAppointments: number;
  averagePerAppointment: number;
}

export interface BillingSearchFilters {
  searchTerm?: string;
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  doctorId?: string;
  patientId?: string;
  paymentMethod?: string[];
  insuranceProvider?: string;
}