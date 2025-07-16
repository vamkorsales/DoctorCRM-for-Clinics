import { Invoice, Service, Payment, BillingReport } from '../types/billing';

export const mockServices: Service[] = [
  {
    id: 'SRV-001',
    name: 'General Consultation',
    type: 'consultation',
    category: 'Medical Consultation',
    description: 'Standard consultation with general practitioner',
    basePrice: 150,
    isActive: true,
    doctorSpecific: true,
    doctorPricing: [
      { doctorId: 'DOC-001', price: 150, emergencyPrice: 250, afterHoursPrice: 200, followUpPrice: 100 },
      { doctorId: 'DOC-002', price: 200, emergencyPrice: 350, afterHoursPrice: 250, followUpPrice: 150 }
    ],
    insuranceCoverage: [
      { insuranceProvider: 'Blue Cross Blue Shield', coveragePercentage: 80, requiresPreAuth: false },
      { insuranceProvider: 'Aetna', coveragePercentage: 75, requiresPreAuth: false }
    ],
    taxable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SRV-002',
    name: 'Cardiology Consultation',
    type: 'consultation',
    category: 'Specialist Consultation',
    description: 'Consultation with cardiologist',
    basePrice: 250,
    isActive: true,
    doctorSpecific: true,
    doctorPricing: [
      { doctorId: 'DOC-002', price: 250, emergencyPrice: 400, afterHoursPrice: 300, followUpPrice: 180 }
    ],
    taxable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SRV-003',
    name: 'Blood Test - Complete Panel',
    type: 'lab-test',
    category: 'Laboratory',
    description: 'Comprehensive blood work including CBC, metabolic panel',
    basePrice: 120,
    isActive: true,
    doctorSpecific: false,
    taxable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SRV-004',
    name: 'X-Ray Chest',
    type: 'procedure',
    category: 'Imaging',
    description: 'Chest X-ray imaging',
    basePrice: 80,
    isActive: true,
    doctorSpecific: false,
    taxable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SRV-005',
    name: 'Prescription Medication',
    type: 'medication',
    category: 'Pharmacy',
    description: 'Prescribed medications',
    basePrice: 0, // Variable pricing
    isActive: true,
    doctorSpecific: false,
    taxable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SRV-006',
    name: 'Medical Supplies',
    type: 'supply',
    category: 'Supplies',
    description: 'Various medical supplies used during treatment',
    basePrice: 0, // Variable pricing
    isActive: true,
    doctorSpecific: false,
    taxable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SRV-007',
    name: 'Administrative Fee',
    type: 'administrative',
    category: 'Administrative',
    description: 'Administrative processing fee',
    basePrice: 25,
    isActive: true,
    doctorSpecific: false,
    taxable: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2025-001',
    patientId: 'PAT-001',
    doctorId: 'DOC-001',
    appointmentId: 'APT-001',
    issueDate: '2025-01-15',
    dueDate: '2025-02-15',
    status: 'sent',
    items: [
      {
        id: 'ITEM-001',
        serviceId: 'SRV-001',
        serviceName: 'General Consultation',
        serviceType: 'consultation',
        description: 'Annual physical examination',
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
        category: 'Medical Consultation',
        providedBy: 'Dr. John Smith',
        providedDate: '2025-01-15'
      },
      {
        id: 'ITEM-002',
        serviceId: 'SRV-003',
        serviceName: 'Blood Test - Complete Panel',
        serviceType: 'lab-test',
        description: 'Comprehensive blood work',
        quantity: 1,
        unitPrice: 120,
        totalPrice: 120,
        category: 'Laboratory',
        providedDate: '2025-01-15'
      }
    ],
    subtotal: 270,
    discounts: [],
    taxes: [
      {
        id: 'TAX-001',
        name: 'Medical Services Tax',
        rate: 8.5,
        type: 'percentage',
        appliedTo: 'subtotal',
        isActive: true
      }
    ],
    totalAmount: 292.95,
    paidAmount: 0,
    balanceAmount: 292.95,
    paymentTerms: 'Net 30',
    notes: 'Annual checkup with blood work',
    paymentHistory: [],
    remindersSent: 0,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'Dr. Smith',
    lastModifiedBy: 'Dr. Smith'
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2025-002',
    patientId: 'PAT-002',
    doctorId: 'DOC-002',
    appointmentId: 'APT-002',
    issueDate: '2025-01-16',
    dueDate: '2025-02-16',
    status: 'paid',
    items: [
      {
        id: 'ITEM-003',
        serviceId: 'SRV-002',
        serviceName: 'Cardiology Consultation',
        serviceType: 'consultation',
        description: 'Cardiac evaluation and EKG',
        quantity: 1,
        unitPrice: 250,
        totalPrice: 250,
        category: 'Specialist Consultation',
        providedBy: 'Dr. Emily Rodriguez',
        providedDate: '2025-01-16'
      }
    ],
    subtotal: 250,
    discounts: [],
    taxes: [
      {
        id: 'TAX-001',
        name: 'Medical Services Tax',
        rate: 8.5,
        type: 'percentage',
        appliedTo: 'subtotal',
        isActive: true
      }
    ],
    totalAmount: 271.25,
    paidAmount: 271.25,
    balanceAmount: 0,
    paymentTerms: 'Net 30',
    paymentHistory: [
      {
        id: 'PAY-001',
        invoiceId: 'INV-002',
        amount: 271.25,
        paymentDate: '2025-01-18',
        paymentMethod: 'credit-card',
        transactionId: 'TXN-12345',
        status: 'completed',
        processedBy: 'Receptionist Johnson',
        createdAt: '2025-01-18T14:30:00Z'
      }
    ],
    remindersSent: 0,
    createdAt: '2025-01-16T11:00:00Z',
    updatedAt: '2025-01-18T14:30:00Z',
    createdBy: 'Dr. Rodriguez',
    lastModifiedBy: 'Receptionist Johnson'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-002',
    amount: 271.25,
    paymentDate: '2025-01-18',
    paymentMethod: 'credit-card',
    transactionId: 'TXN-12345',
    status: 'completed',
    processedBy: 'Receptionist Johnson',
    notes: 'Visa ending in 4532',
    createdAt: '2025-01-18T14:30:00Z'
  }
];

export const mockBillingReports: BillingReport[] = [
  {
    id: 'RPT-001',
    type: 'revenue',
    title: 'Monthly Revenue Report - January 2025',
    dateRange: {
      start: '2025-01-01',
      end: '2025-01-31'
    },
    filters: {},
    data: {
      dailyRevenue: [
        { date: '2025-01-15', revenue: 292.95 },
        { date: '2025-01-16', revenue: 271.25 }
      ]
    },
    summary: {
      totalRevenue: 564.20,
      totalInvoices: 2,
      paidInvoices: 1,
      outstandingAmount: 292.95,
      averageInvoiceAmount: 282.10,
      topServices: [
        {
          serviceId: 'SRV-002',
          serviceName: 'Cardiology Consultation',
          totalRevenue: 250,
          totalQuantity: 1,
          averagePrice: 250
        }
      ],
      topDoctors: [
        {
          doctorId: 'DOC-002',
          doctorName: 'Dr. Emily Rodriguez',
          totalEarnings: 250,
          totalAppointments: 1,
          averagePerAppointment: 250
        }
      ]
    },
    generatedAt: '2025-01-20T09:00:00Z',
    generatedBy: 'Admin'
  }
];