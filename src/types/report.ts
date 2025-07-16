export interface PatientReport {
  patientId: string;
  medical: MedicalReportData;
  health: HealthReportData;
  invoices: InvoiceReportData[];
}

export interface MedicalReportData {
  diagnoses: string[];
  treatments: string[];
  procedures: string[];
  history: string;
}

export interface HealthReportData {
  vitals: {
    date: string;
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    // ...other metrics
  }[];
  wellnessMetrics: Record<string, any>;
}

export interface InvoiceReportData {
  invoiceId: string;
  date: string;
  amount: number;
  status: string;
  items: string[];
} 