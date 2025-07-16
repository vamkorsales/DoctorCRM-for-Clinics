import React, { useState } from 'react';
import { Patient } from '../../types/patient';
import PatientList from './PatientList';
import PatientProfile from './PatientProfile';
import PatientForm from './PatientForm';

const PatientManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'profile' | 'form'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('profile');
  };

  const handleCreatePatient = () => {
    setEditingPatient(null);
    setCurrentView('form');
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setCurrentView('form');
  };

  const handleSavePatient = (patientData: Partial<Patient>) => {
    // In a real app, this would save to the backend
    console.log('Saving patient:', patientData);
    setCurrentView('list');
    setEditingPatient(null);
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedPatient(null);
    setEditingPatient(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingPatient(null);
  };

  return (
    <div className="space-y-6">
      {currentView === 'list' && (
        <PatientList
          onPatientSelect={handlePatientSelect}
          onCreatePatient={handleCreatePatient}
          onEditPatient={handleEditPatient}
        />
      )}

      {currentView === 'profile' && selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onBack={handleBack}
          onEdit={() => handleEditPatient(selectedPatient)}
        />
      )}

      {currentView === 'form' && (
        <PatientForm
          patient={editingPatient || undefined}
          onSave={handleSavePatient}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default PatientManagement;