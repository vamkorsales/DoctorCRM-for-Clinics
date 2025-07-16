import { Doctor } from '../types/doctor';

export const mockDoctors: Doctor[] = [
  {
    id: 'DOC-001',
    title: 'Dr.',
    firstName: 'John',
    lastName: 'Smith',
    specialization: 'General Practice',
    department: 'Internal Medicine',
    licenseNumber: 'MD123456',
    registrationNumber: 'REG789012',
    email: 'dr.smith@healthinsights.com',
    phone: '(555) 345-6789',
    emergencyContact: {
      name: 'Sarah Smith',
      relationship: 'Spouse',
      phone: '(555) 345-6790'
    },
    workingHours: {
      monday: { start: '08:00', end: '17:00', available: true, breakTime: { start: '12:00', end: '13:00' } },
      tuesday: { start: '08:00', end: '17:00', available: true, breakTime: { start: '12:00', end: '13:00' } },
      wednesday: { start: '08:00', end: '17:00', available: true, breakTime: { start: '12:00', end: '13:00' } },
      thursday: { start: '08:00', end: '17:00', available: true, breakTime: { start: '12:00', end: '13:00' } },
      friday: { start: '08:00', end: '15:00', available: true, breakTime: { start: '12:00', end: '13:00' } },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    consultationFee: {
      standard: 150,
      followUp: 100,
      emergency: 250
    },
    qualifications: [
      {
        id: 'QUAL-001',
        degree: 'Doctor of Medicine (MD)',
        institution: 'Harvard Medical School',
        year: 2010,
        specialization: 'Internal Medicine'
      },
      {
        id: 'QUAL-002',
        degree: 'Bachelor of Science',
        institution: 'MIT',
        year: 2006,
        specialization: 'Biology'
      }
    ],
    experience: [
      {
        id: 'EXP-001',
        position: 'Senior Physician',
        organization: 'Health Insights Clinic',
        startDate: '2018-01-15',
        description: 'Leading general practice with focus on preventive care and chronic disease management',
        isCurrent: true
      },
      {
        id: 'EXP-002',
        position: 'Resident Physician',
        organization: 'Massachusetts General Hospital',
        startDate: '2010-07-01',
        endDate: '2014-06-30',
        description: 'Internal medicine residency with rotations in cardiology, endocrinology, and emergency medicine',
        isCurrent: false
      }
    ],
    bio: 'Dr. Smith is a board-certified internal medicine physician with over 15 years of experience. He specializes in preventive care, chronic disease management, and patient education.',
    languages: ['English', 'Spanish'],
    maxPatientsPerDay: 20,
    consultationDuration: 30,
    assignedPatients: ['PAT-001', 'PAT-003'],
    blockedTimeSlots: [
      {
        id: 'BLOCK-001',
        date: '2025-01-25',
        startTime: '14:00',
        endTime: '15:00',
        reason: 'Medical conference call',
        type: 'meeting'
      }
    ],
    leaveSchedule: [
      {
        id: 'LEAVE-001',
        startDate: '2025-02-15',
        endDate: '2025-02-20',
        type: 'vacation',
        reason: 'Family vacation',
        status: 'approved',
        approvedBy: 'Admin',
        appliedDate: '2025-01-10'
      }
    ],
    performanceMetrics: {
      totalPatients: 450,
      activePatients: 280,
      totalAppointments: 1250,
      completedAppointments: 1180,
      cancelledAppointments: 45,
      noShowRate: 2.0,
      averageRating: 4.8,
      totalReviews: 156,
      monthlyStats: [
        { month: 'January', year: 2025, appointments: 95, newPatients: 12, revenue: 14250, rating: 4.9 },
        { month: 'December', year: 2024, appointments: 88, newPatients: 8, revenue: 13200, rating: 4.7 }
      ]
    },
    isActive: true,
    joinDate: '2018-01-15',
    createdAt: '2018-01-10T08:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'Admin',
    lastModifiedBy: 'Dr. Smith'
  },
  {
    id: 'DOC-002',
    title: 'Dr.',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    specialization: 'Cardiology',
    department: 'Cardiovascular Medicine',
    licenseNumber: 'MD234567',
    registrationNumber: 'REG890123',
    email: 'dr.rodriguez@healthinsights.com',
    phone: '(555) 456-7890',
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relationship: 'Spouse',
      phone: '(555) 456-7891'
    },
    workingHours: {
      monday: { start: '09:00', end: '16:00', available: true, breakTime: { start: '12:30', end: '13:30' } },
      tuesday: { start: '09:00', end: '16:00', available: true, breakTime: { start: '12:30', end: '13:30' } },
      wednesday: { start: '09:00', end: '16:00', available: true, breakTime: { start: '12:30', end: '13:30' } },
      thursday: { start: '09:00', end: '16:00', available: true, breakTime: { start: '12:30', end: '13:30' } },
      friday: { start: '09:00', end: '14:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    consultationFee: {
      standard: 200,
      followUp: 150,
      emergency: 350
    },
    qualifications: [
      {
        id: 'QUAL-003',
        degree: 'Doctor of Medicine (MD)',
        institution: 'Johns Hopkins University',
        year: 2012,
        specialization: 'Cardiology'
      },
      {
        id: 'QUAL-004',
        degree: 'Fellowship in Interventional Cardiology',
        institution: 'Mayo Clinic',
        year: 2017
      }
    ],
    experience: [
      {
        id: 'EXP-003',
        position: 'Cardiologist',
        organization: 'Health Insights Clinic',
        startDate: '2020-03-01',
        description: 'Specialized cardiac care including diagnostic procedures and treatment planning',
        isCurrent: true
      },
      {
        id: 'EXP-004',
        position: 'Cardiology Fellow',
        organization: 'Mayo Clinic',
        startDate: '2016-07-01',
        endDate: '2017-06-30',
        description: 'Advanced training in interventional cardiology and cardiac catheterization',
        isCurrent: false
      }
    ],
    bio: 'Dr. Rodriguez is a board-certified cardiologist specializing in interventional procedures and heart disease prevention.',
    languages: ['English', 'Spanish', 'Portuguese'],
    maxPatientsPerDay: 15,
    consultationDuration: 45,
    assignedPatients: ['PAT-002'],
    blockedTimeSlots: [],
    leaveSchedule: [],
    performanceMetrics: {
      totalPatients: 320,
      activePatients: 180,
      totalAppointments: 890,
      completedAppointments: 850,
      cancelledAppointments: 25,
      noShowRate: 1.7,
      averageRating: 4.9,
      totalReviews: 98,
      monthlyStats: [
        { month: 'January', year: 2025, appointments: 68, newPatients: 8, revenue: 13600, rating: 4.9 },
        { month: 'December', year: 2024, appointments: 72, newPatients: 10, revenue: 14400, rating: 4.8 }
      ]
    },
    isActive: true,
    joinDate: '2020-03-01',
    createdAt: '2020-02-15T08:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'Admin',
    lastModifiedBy: 'Dr. Rodriguez'
  }
];

export const specializations = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology'
];

export const departments = [
  'Internal Medicine',
  'Cardiovascular Medicine',
  'Emergency Medicine',
  'Family Medicine',
  'Pediatrics',
  'Surgery',
  'Radiology',
  'Pathology',
  'Anesthesiology',
  'Psychiatry'
];