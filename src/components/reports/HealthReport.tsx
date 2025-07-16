import React from 'react';
import { HealthReportData } from '../../types/report';
import ReportTable from './ReportTable';

interface HealthReportProps {
  data: HealthReportData;
}

type VitalsKey = keyof HealthReportData['vitals'][0];

const HealthReport: React.FC<HealthReportProps> = ({ data }) => {
  const vitalsColumns: { key: VitalsKey; label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'bloodPressure', label: 'Blood Pressure' },
    { key: 'heartRate', label: 'Heart Rate' },
    { key: 'temperature', label: 'Temperature (°C)' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Vitals</h2>
        <ReportTable columns={vitalsColumns} data={data.vitals} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Wellness Metrics</h2>
        <ul className="list-disc ml-6 text-gray-700">
          {Object.entries(data.wellnessMetrics).map(([key, value]) => (
            <li key={key}><span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>{String(value)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HealthReport; 