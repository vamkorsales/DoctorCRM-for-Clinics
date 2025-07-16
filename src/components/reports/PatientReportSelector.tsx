import React from 'react';

interface PatientReportSelectorProps {
  patients: { id: string; name: string }[];
  selectedPatientId: string;
  onPatientChange: (id: string) => void;
  reportType: 'medical' | 'health' | 'invoice';
  onReportTypeChange: (type: 'medical' | 'health' | 'invoice') => void;
}

const reportTypes = [
  { key: 'medical', label: 'Medical Report' },
  { key: 'health', label: 'Health Report' },
  { key: 'invoice', label: 'Invoice Report' }
];

const PatientReportSelector: React.FC<PatientReportSelectorProps> = ({
  patients,
  selectedPatientId,
  onPatientChange,
  reportType,
  onReportTypeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
        <select
          value={selectedPatientId}
          onChange={e => onPatientChange(e.target.value)}
          className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select --</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2">
        {reportTypes.map(rt => (
          <button
            key={rt.key}
            onClick={() => onReportTypeChange(rt.key as any)}
            className={`px-4 py-2 rounded-lg border ${reportType === rt.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'} transition`}
          >
            {rt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatientReportSelector; 