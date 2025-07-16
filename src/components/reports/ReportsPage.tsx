import React, { useState } from 'react';
import { mockPatientReports } from '../../data/reportMockData';
import PatientReportSelector from './PatientReportSelector';
import MedicalReport from './MedicalReport';
import HealthReport from './HealthReport';
import InvoiceReport from './InvoiceReport';

interface ReportsPageProps {
  onSectionChange?: (section: string) => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onSectionChange }) => {
  const patients = mockPatientReports.map(r => ({ id: r.patientId, name: r.patientId })); // Replace with real names if available
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [reportType, setReportType] = useState<'medical' | 'health' | 'invoice'>('medical');

  const selectedReport = mockPatientReports.find(r => r.patientId === selectedPatientId);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Patient Reports</h1>
        <PatientReportSelector
          patients={patients}
          selectedPatientId={selectedPatientId}
          onPatientChange={setSelectedPatientId}
          reportType={reportType}
          onReportTypeChange={setReportType}
        />
        {selectedPatientId && selectedReport ? (
          <div className="mt-6">
            {reportType === 'medical' && <MedicalReport data={selectedReport.medical} />}
            {reportType === 'health' && <HealthReport data={selectedReport.health} />}
            {reportType === 'invoice' && <InvoiceReport data={selectedReport.invoices} />}
          </div>
        ) : (
          <div className="text-gray-500 mt-8">Select a patient and report type to view details.</div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage; 