export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency' | 'routine-checkup' | 'vaccination' | 'lab-work' | 'therapy';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  purpose: string;
  notes?: string;
  reminderSent: boolean;
  reminderDate?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  parentAppointmentId?: string; // for recurring appointments
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  cancellationReason?: string;
  rescheduleHistory?: RescheduleRecord[];
  waitlistPosition?: number;
  estimatedWaitTime?: number;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every X days/weeks/months/years
  daysOfWeek?: number[]; // for weekly (0 = Sunday, 1 = Monday, etc.)
  dayOfMonth?: number; // for monthly
  endDate?: string;
  occurrences?: number; // number of appointments to create
}

interface RescheduleRecord {
  id: string;
  originalDate: string;
  originalStartTime: string;
  newDate: string;
  newStartTime: string;
  reason: string;
  rescheduledBy: string;
  rescheduledAt: string;
}

export interface AppointmentSearchFilters {
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  type?: string[];
  doctorId?: string;
  patientId?: string;
  priority?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
  duration?: number;
}

interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
  totalAppointments: number;
  availableSlots: number;
}

export interface AppointmentConflict {
  conflictType: 'overlap' | 'double-booking' | 'outside-hours';
  conflictingAppointment?: Appointment;
  message: string;
}

interface AppointmentReminder {
  id: string;
  appointmentId: string;
  type: 'email' | 'sms' | 'push';
  scheduledFor: string;
  sent: boolean;
  sentAt?: string;
  content: string;
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  preferredDate: string;
  preferredTimeRange: {
    start: string;
    end: string;
  };
  appointmentType: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
  createdAt: string;
  notified: boolean;
}