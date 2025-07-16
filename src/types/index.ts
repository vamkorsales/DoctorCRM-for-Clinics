export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phone: string;
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      available: boolean;
    };
  };
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  type: 'consultation' | 'diagnosis' | 'treatment' | 'lab-result' | 'imaging';
  title: string;
  description: string;
  diagnosis: string[];
  treatment: string;
  attachments: string[];
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  notes: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentMethod?: string;
  paidDate?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  permissions: string[];
}

interface Report {
  id: string;
  title: string;
  type: 'financial' | 'patient' | 'appointment' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  data: any;
  generatedAt: string;
}