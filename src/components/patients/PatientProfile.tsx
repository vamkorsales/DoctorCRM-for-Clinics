import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  Heart,
  Activity,
  FileText,
  Pill,
  AlertTriangle,
  Clock,
  Download,
  Plus,
  Trash2
} from 'lucide-react';
import { Patient, VitalSigns, PrescriptionEntry, MedicationOrder } from '../../types/patient';
import { formatDate, getAge } from '../../utils/dateUtils';
import { formatPhone } from '../../utils/formatUtils';
import VitalSignsChart from './VitalSignsChart';
import MedicalDocuments from './MedicalDocuments';
import ClinicalNotesForm from './ClinicalNotesForm';
import jsPDF from 'jspdf';
import { mockClinicProfile } from '../../data/settingsMockData';

interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
  onEdit: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'history' | 'documents' | 'medications'>('overview');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [ehrHistory, setEhrHistory] = useState(patient.ehrHistory || []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'vitals', label: 'Vital Signs', icon: Activity },
    { id: 'history', label: 'Medical History', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'medications', label: 'Medications', icon: Pill }
  ];

  const latestVitals = patient.vitalSigns[patient.vitalSigns.length - 1];

  const caduceusBase64 =
    'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDA4OEZGIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMTkuOTk1IDMuM2MtLjYyIDAtMS4xMi40OS0xLjEyIDEuMSAwIC42MS40OSAxLjEgMS4xMiAxLjEgLjYyIDAgMS4xMi0uNDkgMS4xMi0xLjEgMC0uNjEtLjQ5LTEuMS0xLjEyLTEuMXptMCAyLjI0Yy0uNjMgMC0xLjEzLS41MS0xLjEzLTEuMTMgMC0uNjIuNS0xLjEzIDEuMTMtMS4xMy42MyAwIDEuMTMuNTEgMS4xMyAxLjEzIDAgLjYyLS41IDEuMTMtMS4xMyAxLjEzem0wIDMuNDRjLS42MyAwLTEuMTMtLjUxLTEuMTMtMS4xMyAwLS42Mi41LTEuMTMgMS4xMy0xLjEzLjYzIDAgMS4xMy41MSAxLjEzIDEuMTMgMCAuNjItLjUgMS4xMy0xLjEzIDEuMTN6bTAgMy40NGMtLjYzIDAtMS4xMy0uNTEtMS4xMy0xLjEzIDAtLjYyLjUtMS4xMyAxLjEzLTEuMTMuNjMgMCAxLjEzLjUxIDEuMTMgMS4xMyAwIC42Mi0uNSAxLjEzLTEuMTMgMS4xM3ptMCAzLjQ0Yy0uNjMgMC0xLjEzLS41MS0xLjEzLTEuMTMgMC0uNjIuNS0xLjEzIDEuMTMtMS4xMy42MyAwIDEuMTMuNTEgMS4xMyAxLjEzIDAgLjYyLS41IDEuMTMtMS4xMyAxLjEzem0wIDMuNDRjLS42MyAwLTEuMTMtLjUxLTEuMTMtMS4xMyAwLS42Mi41LTEuMTMgMS4xMy0xLjEzLjYzIDAgMS4xMy41MSAxLjEzIDEuMTMgMCAuNjItLjUgMS4xMy0xLjEzIDEuMTN6Ii8+PC9zdmc+';

  // Helper to export prescription as PDF
  const exportPrescriptionPDF = (prescription: PrescriptionEntry) => {
    const doc = new jsPDF();
    // Clinic Header
    if (mockClinicProfile.logo) {
      // If logo is available, add it (resize as needed)
      doc.addImage(mockClinicProfile.logo, 'PNG', 150, 10, 30, 18);
    } 
    // PNG for caduceus/clinic symbol can be added here in the future if available
    doc.setTextColor(0, 136, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(mockClinicProfile.name, 14, 20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('QUALIFICATION', 14, 26);
    doc.setDrawColor(0, 136, 255);
    doc.setLineWidth(1.2);
    doc.line(14, 30, 196, 30); // blue horizontal line

    // Patient Info Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient Name:`, 14, 40);
    doc.text(prescription.patientName, 50, 40);
    doc.text(`Date:`, 120, 40);
    doc.text(prescription.date.slice(0, 10), 135, 40);
    doc.text(`Age:`, 14, 48);
    doc.text('-', 28, 48); // Placeholder, can be replaced with real age
    doc.text(`Gender:`, 60, 48);
    doc.text('-', 80, 48); // Placeholder, can be replaced with real gender
    doc.text(`Weight:`, 120, 48);
    doc.text('-', 140, 48); // Placeholder, can be replaced with real weight
    doc.text(`Diagnosis:`, 14, 56);
    doc.text('-', 40, 56); // Placeholder, can be replaced with real diagnosis

    // Large Rx symbol
    doc.setFontSize(32);
    doc.setTextColor(30, 60, 90);
    doc.text('Rx', 14, 80);
    doc.setTextColor(0, 0, 0);

    // Prescription Medications
    let y = 90;
    doc.setFontSize(12);
    prescription.medications.forEach((med: MedicationOrder, idx: number) => {
      doc.text(`${idx + 1}. ${med.name} - ${med.dosage}, ${med.frequency}, ${med.duration}`, 30, y);
      if (med.specialInstructions) {
        doc.setFontSize(10);
        doc.text(`Instructions: ${med.specialInstructions}`, 34, y + 6);
        y += 12;
        doc.setFontSize(12);
      } else {
        y += 8;
      }
    });

    // Doctor name and signature
    doc.setFontSize(12);
    doc.text(`Prescribed By: ${prescription.prescribedBy}`, 120, 250);
    doc.text('Signature:', 120, 258);
    doc.text(prescription.signature, 150, 258);

    // Footer - Clinic Info
    doc.setDrawColor(0, 136, 255);
    doc.setLineWidth(1.2);
    doc.line(14, 270, 196, 270);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(mockClinicProfile.name, 14, 277);
    doc.text(
      `${mockClinicProfile.address.street}, ${mockClinicProfile.address.city}, ${mockClinicProfile.address.state} ${mockClinicProfile.address.zipCode}`,
      60, 277
    );
    doc.text(`+${mockClinicProfile.phone}`, 170, 277);
    doc.save(`${prescription.patientName.replace(/\s+/g, '_')}_Prescription.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Patients</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotesModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Clinical Note</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Patient</span>
            </button>
          </div>
        </div>

        {/* Patient Info Header */}
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
            {patient.profilePhoto ? (
              <img
                src={patient.profilePhoto}
                alt={`${patient.firstName} ${patient.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-2xl">
                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                ID: {patient.id}
              </span>
              {patient.allergies.length > 0 && (
                <span className="flex items-center space-x-1 px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Allergies</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{getAge(patient.dateOfBirth)} years old</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="capitalize">{patient.gender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Blood Type: {patient.bloodType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{formatPhone(patient.phone)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{formatPhone(patient.phone)}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div>{patient.address.street}</div>
                      <div>{patient.address.city}, {patient.address.state} {patient.address.zipCode}</div>
                      <div>{patient.address.country}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span>{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{formatPhone(patient.emergencyContact.phone)}</span>
                  </div>
                  {patient.emergencyContact.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>{patient.emergencyContact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.insurance.provider}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.insurance.policyNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Group Number</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.insurance.groupNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member ID</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.insurance.memberID}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Vital Signs */}
            {latestVitals && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Vital Signs</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Blood Pressure</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Heart Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{latestVitals.heartRate} bpm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Temperature</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {latestVitals.temperature}°{latestVitals.temperatureUnit === 'celsius' ? 'C' : 'F'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Weight</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {latestVitals.weight} {latestVitals.weightUnit}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">BMI</p>
                      <p className="text-lg font-semibold text-gray-900">{latestVitals.bmi}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Recorded</p>
                      <p className="text-sm text-gray-600">{formatDate(latestVitals.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Allergies */}
            {patient.allergies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.allergies.map((allergy) => (
                    <div key={allergy.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-red-900">{allergy.allergen}</h4>
                          <p className="text-sm text-red-700 mt-1">{allergy.reaction}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-red-600">
                            <span className="capitalize">Severity: {allergy.severity}</span>
                            <span>Identified: {formatDate(allergy.dateIdentified)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vitals' && (
          <VitalSignsChart patient={patient} />
        )}

        {activeTab === 'history' && (
          <div className="space-y-8">
            {/* Chronic Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chronic Conditions</h3>
              {patient.medicalHistory.chronicConditions.length > 0 ? (
                <div className="space-y-4">
                  {patient.medicalHistory.chronicConditions.map((condition) => (
                    <div key={condition.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{condition.condition}</h4>
                          <p className="text-sm text-gray-600 mt-1">{condition.treatment}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Diagnosed: {formatDate(condition.diagnosedDate)}</span>
                            <span className="capitalize">Severity: {condition.severity}</span>
                            <span className="capitalize">Status: {condition.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No chronic conditions recorded.</p>
              )}
            </div>

            {/* Surgeries */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Surgeries & Procedures</h3>
              {patient.medicalHistory.surgeries.length > 0 ? (
                <div className="space-y-4">
                  {patient.medicalHistory.surgeries.map((surgery) => (
                    <div key={surgery.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{surgery.procedure}</h4>
                      <p className="text-sm text-gray-600 mt-1">Performed by: {surgery.surgeon}</p>
                      <p className="text-sm text-gray-600">Hospital: {surgery.hospital}</p>
                      <p className="text-sm text-gray-600 mt-2">{surgery.outcome}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Date: {formatDate(surgery.date)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No surgeries recorded.</p>
              )}
            </div>

            {/* Family History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Family History</h3>
              {patient.medicalHistory.familyHistory.length > 0 ? (
                <div className="space-y-4">
                  {patient.medicalHistory.familyHistory.map((history) => (
                    <div key={history.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{history.condition}</h4>
                          <p className="text-sm text-gray-600 mt-1">Relationship: {history.relationship}</p>
                          {history.ageOfOnset && (
                            <p className="text-sm text-gray-600">Age of onset: {history.ageOfOnset}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          history.status === 'living' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {history.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No family history recorded.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <MedicalDocuments patient={patient} />
        )}

        {activeTab === 'medications' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {patient.currentMedications.length > 0 ? (
              <div className="space-y-4">
                {patient.currentMedications.map((medication) => (
                  <div key={medication.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {medication.dosage} - {medication.frequency}
                        </p>
                        <p className="text-sm text-gray-600">Route: {medication.route}</p>
                        <p className="text-sm text-gray-600">Purpose: {medication.purpose}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Started: {formatDate(medication.startDate)}</span>
                          {medication.endDate && (
                            <span>Ends: {formatDate(medication.endDate)}</span>
                          )}
                          <span>Prescribed by: {medication.prescribedBy}</span>
                        </div>
                      </div>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medications recorded</h3>
                <p className="text-gray-500 mb-4">Add the patient's current medications to track their treatment.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Add First Medication
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EHR History Section */}
      {ehrHistory.length > 0 && (
        <div className="p-6 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clinical Notes & Prescriptions</h2>
          <div className="space-y-4">
            {ehrHistory.map((note, idx) => (
              <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-800">{formatDate(note.date)}</span>
                    <span className="ml-2 text-gray-600 text-sm">by {note.author}</span>
                  </div>
                  {note.prescription && (
                    <button
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => exportPrescriptionPDF(note.prescription!)}
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Prescription PDF</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div><span className="font-medium">Chief Complaint:</span> {note.chiefComplaint}</div>
                    <div><span className="font-medium">History & Symptoms:</span> {note.historyAndSymptoms}</div>
                    <div><span className="font-medium">Physical Exam:</span> {note.physicalExam}</div>
                    <div><span className="font-medium">Assessment:</span> {note.assessment}</div>
                    <div><span className="font-medium">Treatment Plan:</span> {note.treatmentPlan}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Vital Signs:</div>
                    <div className="text-sm text-gray-700">BP: {note.vitalSigns.bloodPressure.systolic}/{note.vitalSigns.bloodPressure.diastolic} mmHg</div>
                    <div className="text-sm text-gray-700">HR: {note.vitalSigns.heartRate} bpm</div>
                    <div className="text-sm text-gray-700">Temp: {note.vitalSigns.temperature}°{note.vitalSigns.temperatureUnit === 'celsius' ? 'C' : 'F'}</div>
                    <div className="text-sm text-gray-700">RR: {note.vitalSigns.respiratoryRate} /min</div>
                    <div className="text-sm text-gray-700">Weight: {note.vitalSigns.weight} {note.vitalSigns.weightUnit}</div>
                    <div className="text-sm text-gray-700">BMI: {note.vitalSigns.bmi}</div>
                  </div>
                </div>
                {note.prescription && (
                  <div className="mt-4">
                    <div className="font-medium mb-1">Prescription:</div>
                    <ul className="list-disc ml-6 text-sm text-gray-800">
                      {note.prescription.medications.map((med, i) => (
                        <li key={i}>
                          <span className="font-semibold">{med.name}</span> — {med.dosage}, {med.frequency}, {med.duration}
                          {med.specialInstructions && <span className="ml-2 italic text-gray-600">({med.specialInstructions})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Clinical Notes */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className="w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-6 relative"
            style={{ boxSizing: 'border-box' }}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNotesModal(false)}
            >
              <span className="sr-only">Close</span>
              <Trash2 className="h-5 w-5" />
            </button>
            <ClinicalNotesForm
              patientId={patient.id}
              patientName={`${patient.firstName} ${patient.lastName}`}
              latestVitals={patient.vitalSigns[patient.vitalSigns.length - 1]}
              allergies={patient.allergies.map(a => a.allergen)}
              currentMedications={patient.currentMedications.map(m => m.name)}
              author={patient.lastModifiedBy}
              onSave={note => {
                setEhrHistory(prev => [...prev, note]);
                setShowNotesModal(false);
              }}
              onCancel={() => setShowNotesModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;