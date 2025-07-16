import React, { useState } from 'react';
import { Doctor } from '../../types/doctor';
import DoctorList from './DoctorList';
import DoctorProfile from './DoctorProfile';
import DoctorForm from './DoctorForm';
import DoctorDashboard from './DoctorDashboard';

type ViewType = 'list' | 'profile' | 'form' | 'dashboard';

const DoctorManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView('profile');
  };

  const handleCreateDoctor = () => {
    setEditingDoctor(null);
    setCurrentView('form');
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setCurrentView('form');
  };

  const handleViewDashboard = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView('dashboard');
  };

  const handleSaveDoctor = (doctorData: Partial<Doctor>) => {
    // In a real app, this would save to the backend
    console.log('Saving doctor:', doctorData);
    setCurrentView('list');
    setEditingDoctor(null);
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedDoctor(null);
    setEditingDoctor(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingDoctor(null);
  };

  return (
    <div className="space-y-6">
      {currentView === 'list' && (
        <DoctorList
          onDoctorSelect={handleDoctorSelect}
          onCreateDoctor={handleCreateDoctor}
          onEditDoctor={handleEditDoctor}
          onViewDashboard={handleViewDashboard}
        />
      )}

      {currentView === 'profile' && selectedDoctor && (
        <DoctorProfile
          doctor={selectedDoctor}
          onBack={handleBack}
          onEdit={() => handleEditDoctor(selectedDoctor)}
          onViewDashboard={() => handleViewDashboard(selectedDoctor)}
        />
      )}

      {currentView === 'dashboard' && selectedDoctor && (
        <DoctorDashboard
          doctor={selectedDoctor}
          onBack={handleBack}
        />
      )}

      {currentView === 'form' && (
        <DoctorForm
          doctor={editingDoctor || undefined}
          onSave={handleSaveDoctor}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default DoctorManagement;