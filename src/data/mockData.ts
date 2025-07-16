import { Patient, Appointment, Doctor, MedicalRecord, Prescription, Invoice } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    emergencyContact: {
      name: 'Mike Johnson',
      relationship: 'Spouse',
      phone: '(555) 123-4568'
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001'
    },
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    firstName: 'Robert',
    lastName: 'Davis',
    dateOfBirth: '1978-07-22',
    gender: 'male',
    email: 'robert.davis@email.com',
    phone: '(555) 234-5678',
    address: {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    emergencyContact: {
      name: 'Jennifer Davis',
      relationship: 'Wife',
      phone: '(555) 234-5679'
    },
    insurance: {
      provider: 'Aetna',
      policyNumber: 'AET987654321',
      groupNumber: 'GRP002'
    },
    medicalHistory: ['Asthma', 'Seasonal Allergies'],
    allergies: ['Pollen', 'Dust'],
    currentMedications: ['Albuterol Inhaler', 'Claritin 10mg'],
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-10T10:30:00Z'
  }
];

const mockDoctors: Doctor[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    specialization: 'General Practice',
    email: 'dr.smith@clinic.com',
    phone: '(555) 345-6789',
    schedule: {
      monday: { start: '08:00', end: '17:00', available: true },
      tuesday: { start: '08:00', end: '17:00', available: true },
      wednesday: { start: '08:00', end: '17:00', available: true },
      thursday: { start: '08:00', end: '17:00', available: true },
      friday: { start: '08:00', end: '15:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    }
  },
  {
    id: '2',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    specialization: 'Cardiology',
    email: 'dr.rodriguez@clinic.com',
    phone: '(555) 456-7890',
    schedule: {
      monday: { start: '09:00', end: '16:00', available: true },
      tuesday: { start: '09:00', end: '16:00', available: true },
      wednesday: { start: '09:00', end: '16:00', available: true },
      thursday: { start: '09:00', end: '16:00', available: true },
      friday: { start: '09:00', end: '14:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    }
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2025-01-20',
    startTime: '09:00',
    endTime: '09:30',
    type: 'consultation',
    status: 'scheduled',
    notes: 'Annual checkup',
    createdAt: '2025-01-15T08:00:00Z'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    date: '2025-01-20',
    startTime: '14:00',
    endTime: '14:45',
    type: 'follow-up',
    status: 'confirmed',
    notes: 'Follow-up for cardiac evaluation',
    createdAt: '2025-01-14T10:30:00Z'
  }
];

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2025-01-15',
    type: 'consultation',
    title: 'Annual Physical Examination',
    description: 'Routine annual physical examination with blood work',
    diagnosis: ['Essential Hypertension', 'Type 2 Diabetes Mellitus'],
    treatment: 'Continue current medications, dietary counseling provided',
    attachments: [],
    createdAt: '2025-01-15T10:00:00Z'
  }
];

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    medications: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with meals'
      },
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take in the morning'
      }
    ],
    date: '2025-01-15',
    status: 'active',
    notes: 'Patient tolerating medications well'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    patientId: '1',
    date: '2025-01-15',
    dueDate: '2025-02-15',
    items: [
      {
        description: 'Annual Physical Examination',
        quantity: 1,
        rate: 200.00,
        amount: 200.00
      },
      {
        description: 'Blood Work Panel',
        quantity: 1,
        rate: 150.00,
        amount: 150.00
      }
    ],
    subtotal: 350.00,
    tax: 28.00,
    total: 378.00,
    status: 'sent'
  }
];