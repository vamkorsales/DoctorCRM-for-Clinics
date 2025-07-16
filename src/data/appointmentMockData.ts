import { Appointment, WaitlistEntry } from '../types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: 'APT-001',
    patientId: 'PAT-001',
    doctorId: 'DOC-001',
    date: '2025-01-20',
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    type: 'routine-checkup',
    status: 'confirmed',
    priority: 'normal',
    purpose: 'Annual physical examination',
    notes: 'Patient requested early morning appointment',
    reminderSent: true,
    reminderDate: '2025-01-19',
    isRecurring: false,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'Receptionist Johnson',
    lastModifiedBy: 'Receptionist Johnson'
  },
  {
    id: 'APT-002',
    patientId: 'PAT-002',
    doctorId: 'DOC-002',
    date: '2025-01-20',
    startTime: '14:00',
    endTime: '14:45',
    duration: 45,
    type: 'follow-up',
    status: 'scheduled',
    priority: 'normal',
    purpose: 'Follow-up for asthma treatment',
    notes: 'Bring inhaler for demonstration',
    reminderSent: false,
    isRecurring: false,
    createdAt: '2025-01-14T10:30:00Z',
    updatedAt: '2025-01-14T10:30:00Z',
    createdBy: 'Dr. Rodriguez',
    lastModifiedBy: 'Dr. Rodriguez'
  },
  {
    id: 'APT-003',
    patientId: 'PAT-003',
    doctorId: 'DOC-001',
    date: '2025-01-21',
    startTime: '10:30',
    endTime: '11:00',
    duration: 30,
    type: 'consultation',
    status: 'confirmed',
    priority: 'normal',
    purpose: 'Initial consultation for new patient',
    notes: 'First visit - comprehensive intake needed',
    reminderSent: true,
    reminderDate: '2025-01-20',
    isRecurring: false,
    createdAt: '2025-01-16T14:20:00Z',
    updatedAt: '2025-01-16T14:20:00Z',
    createdBy: 'Receptionist Smith',
    lastModifiedBy: 'Receptionist Smith'
  },
  {
    id: 'APT-004',
    patientId: 'PAT-001',
    doctorId: 'DOC-001',
    date: '2025-01-22',
    startTime: '15:30',
    endTime: '16:00',
    duration: 30,
    type: 'lab-work',
    status: 'scheduled',
    priority: 'normal',
    purpose: 'Blood work for diabetes monitoring',
    notes: 'Fasting required - patient informed',
    reminderSent: false,
    isRecurring: true,
    recurringPattern: {
      frequency: 'monthly',
      interval: 3,
      dayOfMonth: 22,
      occurrences: 4
    },
    createdAt: '2025-01-17T09:15:00Z',
    updatedAt: '2025-01-17T09:15:00Z',
    createdBy: 'Dr. Smith',
    lastModifiedBy: 'Dr. Smith'
  },
  {
    id: 'APT-005',
    patientId: 'PAT-002',
    doctorId: 'DOC-001',
    date: '2025-01-23',
    startTime: '11:00',
    endTime: '11:30',
    duration: 30,
    type: 'vaccination',
    status: 'confirmed',
    priority: 'normal',
    purpose: 'Annual flu vaccination',
    notes: 'Check for allergies before administration',
    reminderSent: true,
    reminderDate: '2025-01-22',
    isRecurring: false,
    createdAt: '2025-01-18T11:00:00Z',
    updatedAt: '2025-01-18T11:00:00Z',
    createdBy: 'Nurse Wilson',
    lastModifiedBy: 'Nurse Wilson'
  },
  {
    id: 'APT-006',
    patientId: 'PAT-001',
    doctorId: 'DOC-002',
    date: '2025-01-19',
    startTime: '16:00',
    endTime: '16:30',
    duration: 30,
    type: 'follow-up',
    status: 'completed',
    priority: 'normal',
    purpose: 'Diabetes follow-up appointment',
    notes: 'Patient showed improvement in glucose levels',
    reminderSent: true,
    reminderDate: '2025-01-18',
    isRecurring: false,
    createdAt: '2025-01-12T13:30:00Z',
    updatedAt: '2025-01-19T16:30:00Z',
    createdBy: 'Dr. Rodriguez',
    lastModifiedBy: 'Dr. Rodriguez'
  },
  {
    id: 'APT-007',
    patientId: 'PAT-003',
    doctorId: 'DOC-001',
    date: '2025-01-18',
    startTime: '09:30',
    endTime: '10:00',
    duration: 30,
    type: 'consultation',
    status: 'no-show',
    priority: 'normal',
    purpose: 'General consultation',
    notes: 'Patient did not show up, attempted to contact',
    reminderSent: true,
    reminderDate: '2025-01-17',
    isRecurring: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-18T10:00:00Z',
    createdBy: 'Receptionist Johnson',
    lastModifiedBy: 'Receptionist Johnson'
  }
];

export const mockWaitlist: WaitlistEntry[] = [
  {
    id: 'WL-001',
    patientId: 'PAT-002',
    preferredDate: '2025-01-20',
    preferredTimeRange: {
      start: '09:00',
      end: '12:00'
    },
    appointmentType: 'consultation',
    priority: 'normal',
    notes: 'Flexible with time, prefers morning',
    createdAt: '2025-01-18T14:30:00Z',
    notified: false
  },
  {
    id: 'WL-002',
    patientId: 'PAT-003',
    preferredDate: '2025-01-21',
    preferredTimeRange: {
      start: '14:00',
      end: '17:00'
    },
    appointmentType: 'follow-up',
    priority: 'high',
    notes: 'Urgent follow-up needed',
    createdAt: '2025-01-19T09:15:00Z',
    notified: false
  }
];

export const mockDoctors = [
  {
    id: 'DOC-001',
    firstName: 'John',
    lastName: 'Smith',
    specialization: 'General Practice',
    email: 'dr.smith@clinic.com',
    phone: '(555) 345-6789',
    workingHours: {
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
    id: 'DOC-002',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    specialization: 'Cardiology',
    email: 'dr.rodriguez@clinic.com',
    phone: '(555) 456-7890',
    workingHours: {
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