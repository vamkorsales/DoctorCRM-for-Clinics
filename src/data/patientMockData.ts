import { Patient } from '../types/patient';

export const mockPatients: Patient[] = [
  {
    id: 'PAT-001',
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
      zipCode: '62701',
      country: 'United States'
    },
    emergencyContact: {
      name: 'Mike Johnson',
      relationship: 'Spouse',
      phone: '(555) 123-4568',
      email: 'mike.johnson@email.com'
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001',
      memberID: 'MEM123456',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31'
    },
    profilePhoto: undefined,
    bloodType: 'A+',
    allergies: [
      {
        id: 'ALL-001',
        allergen: 'Penicillin',
        severity: 'severe',
        reaction: 'Skin rash and difficulty breathing',
        dateIdentified: '2020-05-15',
        notes: 'Discovered during routine antibiotic treatment'
      },
      {
        id: 'ALL-002',
        allergen: 'Shellfish',
        severity: 'moderate',
        reaction: 'Hives and swelling',
        dateIdentified: '2018-08-22'
      }
    ],
    currentMedications: [
      {
        id: 'MED-001',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        route: 'oral',
        startDate: '2023-01-15',
        prescribedBy: 'Dr. Smith',
        purpose: 'Type 2 Diabetes management',
        notes: 'Take with meals to reduce stomach upset'
      },
      {
        id: 'MED-002',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        route: 'oral',
        startDate: '2023-02-01',
        prescribedBy: 'Dr. Smith',
        purpose: 'Blood pressure control'
      }
    ],
    medicalHistory: {
      chronicConditions: [
        {
          id: 'CC-001',
          condition: 'Type 2 Diabetes',
          diagnosedDate: '2023-01-15',
          severity: 'moderate',
          status: 'managed',
          treatment: 'Metformin and dietary modifications',
          notes: 'Well controlled with current treatment plan'
        },
        {
          id: 'CC-002',
          condition: 'Hypertension',
          diagnosedDate: '2023-02-01',
          severity: 'mild',
          status: 'managed',
          treatment: 'Lisinopril and lifestyle changes'
        }
      ],
      surgeries: [
        {
          id: 'SUR-001',
          procedure: 'Appendectomy',
          date: '2015-07-20',
          surgeon: 'Dr. Williams',
          hospital: 'Springfield General Hospital',
          outcome: 'Successful recovery without complications',
          notes: 'Laparoscopic procedure'
        }
      ],
      familyHistory: [
        {
          id: 'FH-001',
          relationship: 'Mother',
          condition: 'Type 2 Diabetes',
          ageOfOnset: 55,
          status: 'living'
        },
        {
          id: 'FH-002',
          relationship: 'Father',
          condition: 'Heart Disease',
          ageOfOnset: 62,
          status: 'deceased',
          notes: 'Myocardial infarction at age 68'
        }
      ],
      immunizations: [
        {
          id: 'IMM-001',
          vaccine: 'COVID-19 (Pfizer)',
          dateAdministered: '2024-01-15',
          administeredBy: 'Springfield Clinic',
          lotNumber: 'PF123456',
          nextDueDate: '2025-01-15'
        },
        {
          id: 'IMM-002',
          vaccine: 'Influenza',
          dateAdministered: '2023-10-01',
          administeredBy: 'Springfield Clinic',
          nextDueDate: '2024-10-01'
        }
      ],
      hospitalizations: [
        {
          id: 'HOSP-001',
          hospital: 'Springfield General Hospital',
          admissionDate: '2015-07-19',
          dischargeDate: '2015-07-21',
          reason: 'Acute appendicitis',
          diagnosis: 'Acute appendicitis with perforation',
          treatment: 'Laparoscopic appendectomy',
          outcome: 'Full recovery'
        }
      ],
      allergicReactions: [
        {
          id: 'AR-001',
          substance: 'Penicillin',
          reaction: 'Severe skin rash and respiratory distress',
          severity: 'severe',
          date: '2020-05-15',
          treatment: 'Epinephrine and corticosteroids'
        }
      ]
    },
    vitalSigns: [
      {
        id: 'VS-001',
        date: '2025-01-15',
        time: '10:30',
        bloodPressure: { systolic: 128, diastolic: 82 },
        heartRate: 72,
        temperature: 98.6,
        temperatureUnit: 'fahrenheit',
        respiratoryRate: 16,
        bloodGlucose: 110,
        oxygenSaturation: 98,
        weight: 165,
        weightUnit: 'lbs',
        height: 65,
        heightUnit: 'inches',
        bmi: 27.4,
        recordedBy: 'Nurse Johnson',
        notes: 'Patient feeling well, no complaints'
      },
      {
        id: 'VS-002',
        date: '2025-01-01',
        time: '14:15',
        bloodPressure: { systolic: 132, diastolic: 85 },
        heartRate: 75,
        temperature: 98.4,
        temperatureUnit: 'fahrenheit',
        respiratoryRate: 18,
        bloodGlucose: 125,
        oxygenSaturation: 97,
        weight: 167,
        weightUnit: 'lbs',
        height: 65,
        heightUnit: 'inches',
        bmi: 27.8,
        recordedBy: 'Dr. Smith'
      },
      {
        id: 'VS-003',
        date: '2024-12-15',
        time: '09:00',
        bloodPressure: { systolic: 135, diastolic: 88 },
        heartRate: 78,
        temperature: 98.2,
        temperatureUnit: 'fahrenheit',
        respiratoryRate: 16,
        bloodGlucose: 140,
        weight: 168,
        weightUnit: 'lbs',
        height: 65,
        heightUnit: 'inches',
        bmi: 28.0,
        recordedBy: 'Nurse Davis'
      }
    ],
    documents: [
      {
        id: 'DOC-001',
        name: 'Blood Work Results - January 2025',
        type: 'lab-result',
        category: 'Blood Work',
        fileUrl: '/documents/blood-work-jan-2025.pdf',
        fileName: 'blood-work-jan-2025.pdf',
        fileSize: 245760,
        mimeType: 'application/pdf',
        uploadDate: '2025-01-16',
        uploadedBy: 'Dr. Smith',
        description: 'Comprehensive metabolic panel and lipid profile',
        tags: ['blood work', 'diabetes', 'cholesterol'],
        isConfidential: false
      },
      {
        id: 'DOC-002',
        name: 'Chest X-Ray - December 2024',
        type: 'imaging',
        category: 'Radiology',
        fileUrl: '/documents/chest-xray-dec-2024.jpg',
        fileName: 'chest-xray-dec-2024.jpg',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        uploadDate: '2024-12-20',
        uploadedBy: 'Radiology Tech',
        description: 'Routine chest X-ray, no abnormalities detected',
        tags: ['x-ray', 'chest', 'routine'],
        isConfidential: false
      },
      {
        id: 'DOC-003',
        name: 'Prescription - Metformin Refill',
        type: 'prescription',
        category: 'Prescriptions',
        fileUrl: '/documents/prescription-metformin.pdf',
        fileName: 'prescription-metformin.pdf',
        fileSize: 102400,
        mimeType: 'application/pdf',
        uploadDate: '2025-01-10',
        uploadedBy: 'Dr. Smith',
        description: '90-day supply of Metformin 500mg',
        tags: ['prescription', 'metformin', 'diabetes'],
        isConfidential: true
      }
    ],
    appointments: ['APT-001', 'APT-002'],
    customFields: [
      {
        id: 'CF-001',
        fieldName: 'Preferred Language',
        fieldType: 'select',
        value: 'English',
        options: ['English', 'Spanish', 'French'],
        isRequired: false,
        category: 'Communication'
      },
      {
        id: 'CF-002',
        fieldName: 'Exercise Frequency',
        fieldType: 'select',
        value: '3-4 times per week',
        options: ['Never', '1-2 times per week', '3-4 times per week', '5+ times per week'],
        isRequired: false,
        category: 'Lifestyle'
      }
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2025-01-16T10:30:00Z',
    createdBy: 'Dr. Smith',
    lastModifiedBy: 'Nurse Johnson'
  },
  {
    id: 'PAT-002',
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
      zipCode: '62702',
      country: 'United States'
    },
    emergencyContact: {
      name: 'Jennifer Davis',
      relationship: 'Wife',
      phone: '(555) 234-5679',
      email: 'jennifer.davis@email.com'
    },
    insurance: {
      provider: 'Aetna',
      policyNumber: 'AET987654321',
      groupNumber: 'GRP002',
      memberID: 'MEM789012',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31'
    },
    bloodType: 'O+',
    allergies: [
      {
        id: 'ALL-003',
        allergen: 'Pollen',
        severity: 'mild',
        reaction: 'Sneezing and watery eyes',
        dateIdentified: '2010-04-01',
        notes: 'Seasonal allergies, worse in spring'
      }
    ],
    currentMedications: [
      {
        id: 'MED-003',
        name: 'Albuterol Inhaler',
        dosage: '90mcg',
        frequency: 'As needed',
        route: 'inhalation',
        startDate: '2020-03-15',
        prescribedBy: 'Dr. Rodriguez',
        purpose: 'Asthma management'
      },
      {
        id: 'MED-004',
        name: 'Claritin',
        dosage: '10mg',
        frequency: 'Once daily during allergy season',
        route: 'oral',
        startDate: '2023-03-01',
        prescribedBy: 'Dr. Smith',
        purpose: 'Seasonal allergies'
      }
    ],
    medicalHistory: {
      chronicConditions: [
        {
          id: 'CC-003',
          condition: 'Asthma',
          diagnosedDate: '2020-03-15',
          severity: 'mild',
          status: 'managed',
          treatment: 'Albuterol inhaler as needed',
          notes: 'Exercise-induced asthma, well controlled'
        }
      ],
      surgeries: [],
      familyHistory: [
        {
          id: 'FH-003',
          relationship: 'Father',
          condition: 'Asthma',
          ageOfOnset: 30,
          status: 'living'
        }
      ],
      immunizations: [
        {
          id: 'IMM-003',
          vaccine: 'COVID-19 (Moderna)',
          dateAdministered: '2024-02-01',
          administeredBy: 'Springfield Clinic',
          lotNumber: 'MD789012'
        }
      ],
      hospitalizations: [],
      allergicReactions: []
    },
    vitalSigns: [
      {
        id: 'VS-004',
        date: '2025-01-10',
        time: '11:00',
        bloodPressure: { systolic: 118, diastolic: 75 },
        heartRate: 68,
        temperature: 98.4,
        temperatureUnit: 'fahrenheit',
        respiratoryRate: 14,
        weight: 180,
        weightUnit: 'lbs',
        height: 70,
        heightUnit: 'inches',
        bmi: 25.8,
        recordedBy: 'Nurse Wilson'
      }
    ],
    documents: [
      {
        id: 'DOC-004',
        name: 'Pulmonary Function Test',
        type: 'lab-result',
        category: 'Pulmonary',
        fileUrl: '/documents/pft-results.pdf',
        fileName: 'pft-results.pdf',
        fileSize: 189440,
        mimeType: 'application/pdf',
        uploadDate: '2024-11-15',
        uploadedBy: 'Dr. Rodriguez',
        description: 'Pulmonary function test showing mild obstruction',
        tags: ['pulmonary', 'asthma', 'breathing'],
        isConfidential: false
      }
    ],
    appointments: ['APT-003'],
    customFields: [],
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
    createdBy: 'Dr. Rodriguez',
    lastModifiedBy: 'Nurse Wilson'
  },
  {
    id: 'PAT-003',
    firstName: 'Emily',
    lastName: 'Chen',
    dateOfBirth: '1992-11-08',
    gender: 'female',
    email: 'emily.chen@email.com',
    phone: '(555) 345-6789',
    address: {
      street: '789 Pine St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703',
      country: 'United States'
    },
    emergencyContact: {
      name: 'David Chen',
      relationship: 'Brother',
      phone: '(555) 345-6790'
    },
    insurance: {
      provider: 'United Healthcare',
      policyNumber: 'UHC456789123',
      groupNumber: 'GRP003',
      memberID: 'MEM345678',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31'
    },
    bloodType: 'B-',
    allergies: [],
    currentMedications: [],
    medicalHistory: {
      chronicConditions: [],
      surgeries: [],
      familyHistory: [],
      immunizations: [
        {
          id: 'IMM-004',
          vaccine: 'HPV',
          dateAdministered: '2023-06-15',
          administeredBy: 'Springfield Clinic'
        }
      ],
      hospitalizations: [],
      allergicReactions: []
    },
    vitalSigns: [
      {
        id: 'VS-005',
        date: '2025-01-05',
        time: '09:30',
        bloodPressure: { systolic: 110, diastolic: 70 },
        heartRate: 65,
        temperature: 98.2,
        temperatureUnit: 'fahrenheit',
        respiratoryRate: 12,
        weight: 125,
        weightUnit: 'lbs',
        height: 64,
        heightUnit: 'inches',
        bmi: 21.5,
        recordedBy: 'Nurse Thompson'
      }
    ],
    documents: [],
    appointments: [],
    customFields: [],
    createdAt: '2024-06-01T14:20:00Z',
    updatedAt: '2025-01-05T09:30:00Z',
    createdBy: 'Dr. Smith',
    lastModifiedBy: 'Nurse Thompson'
  }
];