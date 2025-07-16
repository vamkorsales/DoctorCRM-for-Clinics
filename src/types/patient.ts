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
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    memberID: string;
    effectiveDate: string;
    expirationDate: string;
  };
  profilePhoto?: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: Allergy[];
  currentMedications: Medication[];
  medicalHistory: MedicalHistory;
  vitalSigns: VitalSigns[];
  documents: MedicalDocument[];
  appointments: string[]; // appointment IDs
  customFields: CustomField[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  ehrHistory?: EHRNote[];
}

interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
  dateIdentified: string;
  notes?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'injection' | 'topical' | 'inhalation' | 'other';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
  sideEffects?: string[];
  notes?: string;
}

interface MedicalHistory {
  chronicConditions: ChronicCondition[];
  surgeries: Surgery[];
  familyHistory: FamilyHistory[];
  immunizations: Immunization[];
  hospitalizations: Hospitalization[];
  allergicReactions: AllergicReaction[];
}

interface ChronicCondition {
  id: string;
  condition: string;
  diagnosedDate: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'managed';
  treatment: string;
  notes?: string;
}

interface Surgery {
  id: string;
  procedure: string;
  date: string;
  surgeon: string;
  hospital: string;
  complications?: string;
  outcome: string;
  notes?: string;
}

interface FamilyHistory {
  id: string;
  relationship: string;
  condition: string;
  ageOfOnset?: number;
  status: 'living' | 'deceased';
  notes?: string;
}

interface Immunization {
  id: string;
  vaccine: string;
  dateAdministered: string;
  administeredBy: string;
  lotNumber?: string;
  nextDueDate?: string;
  reactions?: string;
}

interface Hospitalization {
  id: string;
  hospital: string;
  admissionDate: string;
  dischargeDate: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  outcome: string;
}

interface AllergicReaction {
  id: string;
  substance: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  date: string;
  treatment: string;
}

export interface VitalSigns {
  id: string;
  date: string;
  time: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  respiratoryRate: number;
  bloodGlucose?: number;
  oxygenSaturation?: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'inches';
  bmi: number;
  recordedBy: string;
  notes?: string;
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: 'lab-result' | 'imaging' | 'prescription' | 'report' | 'other';
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  uploadedBy: string;
  description?: string;
  tags: string[];
  isConfidential: boolean;
}

interface CustomField {
  id: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'select';
  value: any;
  options?: string[]; // for select type
  isRequired: boolean;
  category: string;
}

export interface PatientSearchFilters {
  searchTerm?: string;
  gender?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  bloodType?: string;
  insuranceProvider?: string;
  hasAllergies?: boolean;
  chronicConditions?: string[];
  lastVisitRange?: {
    start: string;
    end: string;
  };
}

export interface EHRNote {
  id: string;
  date: string;
  author: string;
  chiefComplaint: string;
  historyAndSymptoms: string;
  physicalExam: string;
  vitalSigns: VitalSigns;
  assessment: string;
  treatmentPlan: string;
  prescription?: PrescriptionEntry;
}

export interface PrescriptionEntry {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  medications: MedicationOrder[];
  allergies: string[];
  currentMedications: string[];
  prescribedBy: string;
  signature: string;
}

export interface MedicationOrder {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  specialInstructions?: string;
}