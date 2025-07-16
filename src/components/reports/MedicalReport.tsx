import React from 'react';
import { MedicalReportData } from '../../types/report';

interface MedicalReportProps {
  data: MedicalReportData;
}

const MedicalReport: React.FC<MedicalReportProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Diagnoses</h2>
        <ul className="list-disc ml-6 text-gray-700">
          {data.diagnoses.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Treatments</h2>
        <ul className="list-disc ml-6 text-gray-700">
          {data.treatments.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Procedures</h2>
        <ul className="list-disc ml-6 text-gray-700">
          {data.procedures.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">History</h2>
        <p className="text-gray-700 whitespace-pre-line">{data.history}</p>
      </div>
    </div>
  );
};

export default MedicalReport; 