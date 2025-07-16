import { PatientReport } from '../types/report';

export const mockPatientReports: PatientReport[] = [
  {
    patientId: 'PAT-001',
    medical: {
      diagnoses: ['Hypertension', 'Diabetes'],
      treatments: ['Medication A', 'Therapy B'],
      procedures: ['Blood Test', 'X-Ray'],
      history: 'Patient has a history of hypertension and diabetes, managed with medication and lifestyle changes.'
    },
    health: {
      vitals: [
        { date: '2024-06-01', bloodPressure: '120/80', heartRate: 72, temperature: 36.6 },
        { date: '2024-05-15', bloodPressure: '130/85', heartRate: 75, temperature: 36.7 }
      ],
      wellnessMetrics: { bmi: 24.5, activityLevel: 'Moderate', sleepQuality: 'Good' }
    },
    invoices: [
      { invoiceId: 'INV-001', date: '2024-06-01', amount: 200, status: 'Paid', items: ['Consultation'] },
      { invoiceId: 'INV-002', date: '2024-05-15', amount: 150, status: 'Unpaid', items: ['Lab Test'] }
    ]
  },
  // Add more patients as needed
]; 