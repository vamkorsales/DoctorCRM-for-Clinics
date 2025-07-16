import React, { useState } from 'react';
import { EHRNote, PrescriptionEntry, MedicationOrder, VitalSigns } from '../../types/patient';

interface ClinicalNotesFormProps {
  patientId: string;
  patientName: string;
  latestVitals?: VitalSigns;
  allergies: string[];
  currentMedications: string[];
  onSave: (note: EHRNote) => void;
  onCancel: () => void;
  author: string;
}

const ClinicalNotesForm: React.FC<ClinicalNotesFormProps> = ({
  patientId,
  patientName,
  latestVitals,
  allergies,
  currentMedications,
  onSave,
  onCancel,
  author
}) => {
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyAndSymptoms, setHistoryAndSymptoms] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [assessment, setAssessment] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>(latestVitals || {
    id: '', date: '', time: '', bloodPressure: { systolic: 0, diastolic: 0 }, heartRate: 0, temperature: 0, temperatureUnit: 'celsius', respiratoryRate: 0, weight: 0, weightUnit: 'kg', height: 0, heightUnit: 'cm', bmi: 0, recordedBy: author
  });
  const [medications, setMedications] = useState<MedicationOrder[]>([]);
  const [prescribedBy, setPrescribedBy] = useState(author);
  const [signature, setSignature] = useState('');

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', specialInstructions: '' }]);
  };

  const handleMedicationChange = (idx: number, field: keyof MedicationOrder, value: string) => {
    setMedications(meds => meds.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleRemoveMedication = (idx: number) => {
    setMedications(meds => meds.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const note: EHRNote = {
      id: `ehr-${now.getTime()}`,
      date: now.toISOString(),
      author,
      chiefComplaint,
      historyAndSymptoms,
      physicalExam,
      vitalSigns,
      assessment,
      treatmentPlan,
      prescription: medications.length > 0 ? {
        id: `rx-${now.getTime()}`,
        date: now.toISOString(),
        patientId,
        patientName,
        medications,
        allergies,
        currentMedications,
        prescribedBy,
        signature
      } : undefined
    };
    onSave(note);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Clinical Notes</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chief Complaint</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">History & Symptoms</label>
        <textarea className="w-full border rounded px-3 py-2" value={historyAndSymptoms} onChange={e => setHistoryAndSymptoms(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Physical Examination</label>
        <textarea className="w-full border rounded px-3 py-2" value={physicalExam} onChange={e => setPhysicalExam(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Assessment / Diagnosis</label>
        <textarea className="w-full border rounded px-3 py-2" value={assessment} onChange={e => setAssessment(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
        <textarea className="w-full border rounded px-3 py-2" value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)} required />
      </div>
      {/* Vital Signs (simple for now) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Vital Signs</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Systolic" className="border rounded px-2 py-1" value={vitalSigns.bloodPressure.systolic} onChange={e => setVitalSigns(vs => ({ ...vs, bloodPressure: { ...vs.bloodPressure, systolic: +e.target.value } }))} />
          <input type="number" placeholder="Diastolic" className="border rounded px-2 py-1" value={vitalSigns.bloodPressure.diastolic} onChange={e => setVitalSigns(vs => ({ ...vs, bloodPressure: { ...vs.bloodPressure, diastolic: +e.target.value } }))} />
          <input type="number" placeholder="Heart Rate" className="border rounded px-2 py-1" value={vitalSigns.heartRate} onChange={e => setVitalSigns(vs => ({ ...vs, heartRate: +e.target.value }))} />
          <input type="number" placeholder="Temperature" className="border rounded px-2 py-1" value={vitalSigns.temperature} onChange={e => setVitalSigns(vs => ({ ...vs, temperature: +e.target.value }))} />
          <input type="number" placeholder="Respiratory Rate" className="border rounded px-2 py-1" value={vitalSigns.respiratoryRate} onChange={e => setVitalSigns(vs => ({ ...vs, respiratoryRate: +e.target.value }))} />
          <input type="number" placeholder="Weight" className="border rounded px-2 py-1" value={vitalSigns.weight} onChange={e => setVitalSigns(vs => ({ ...vs, weight: +e.target.value }))} />
        </div>
      </div>
      {/* Prescription Section */}
      <h3 className="text-lg font-semibold text-gray-900 mt-4">Prescription</h3>
      {medications.map((med, idx) => (
        <div key={idx} className="border rounded p-2 mb-2">
          <div className="flex space-x-2 mb-1">
            <input type="text" placeholder="Medication Name" className="border rounded px-2 py-1 flex-1" value={med.name} onChange={e => handleMedicationChange(idx, 'name', e.target.value)} required />
            <input type="text" placeholder="Dosage" className="border rounded px-2 py-1 w-24" value={med.dosage} onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)} required />
            <input type="text" placeholder="Frequency" className="border rounded px-2 py-1 w-24" value={med.frequency} onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)} required />
            <input type="text" placeholder="Duration" className="border rounded px-2 py-1 w-24" value={med.duration} onChange={e => handleMedicationChange(idx, 'duration', e.target.value)} required />
            <button type="button" className="text-red-500" onClick={() => handleRemoveMedication(idx)}>Remove</button>
          </div>
          <input type="text" placeholder="Special Instructions" className="border rounded px-2 py-1 w-full" value={med.specialInstructions || ''} onChange={e => handleMedicationChange(idx, 'specialInstructions', e.target.value)} />
        </div>
      ))}
      <button type="button" className="px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={handleAddMedication}>Add Medication</button>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">Prescribed By</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={prescribedBy} onChange={e => setPrescribedBy(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Signature</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={signature} onChange={e => setSignature(e.target.value)} required />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Note</button>
      </div>
    </form>
  );
};

export default ClinicalNotesForm; 