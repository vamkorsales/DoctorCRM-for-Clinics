export interface Doctor {
  id: string;
  title: 'Dr.' | 'Prof.' | 'Mr.' | 'Ms.' | 'Mrs.';
  firstName: string;
  lastName: string;
  specialization: string;
  department: string;
  licenseNumber: string;
  registrationNumber: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      available: boolean;
      breakTime?: {
        start: string;
        end: string;
      };
    };
  };
  consultationFee: {
    standard: number;
    followUp: number;
    emergency: number;
  };
  qualifications: Qualification[];
  experience: Experience[];
  profilePhoto?: string;
  bio?: string;
  languages: string[];
  maxPatientsPerDay: number;
  consultationDuration: number; // in minutes
  assignedPatients: string[]; // patient IDs
  blockedTimeSlots: BlockedTimeSlot[];
  leaveSchedule: LeaveRecord[];
  performanceMetrics: PerformanceMetrics;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
  specialization?: string;
  certificateUrl?: string;
}

export interface Experience {
  id: string;
  position: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
}

interface BlockedTimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  type: 'personal' | 'meeting' | 'emergency' | 'maintenance';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
  };
}

interface LeaveRecord {
  id: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'emergency' | 'conference' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  appliedDate: string;
  notes?: string;
}

interface PerformanceMetrics {
  totalPatients: number;
  activePatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowRate: number;
  averageRating: number;
  totalReviews: number;
  monthlyStats: MonthlyStats[];
}

interface MonthlyStats {
  month: string;
  year: number;
  appointments: number;
  newPatients: number;
  revenue: number;
  rating: number;
}

export interface DoctorSearchFilters {
  searchTerm?: string;
  specialization?: string;
  department?: string;
  availability?: 'available' | 'busy' | 'on-leave';
  experience?: {
    min: number;
    max: number;
  };
  rating?: number;
  languages?: string[];
}

interface DoctorSchedule {
  doctorId: string;
  date: string;
  timeSlots: {
    time: string;
    available: boolean;
    appointmentId?: string;
    patientName?: string;
    type?: string;
    duration: number;
  }[];
  totalSlots: number;
  bookedSlots: number;
  blockedSlots: number;
}