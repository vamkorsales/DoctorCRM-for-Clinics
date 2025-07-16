import React, { useState } from 'react';
import { Appointment } from '../../types/appointment';
import AppointmentList from './AppointmentList';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentForm from './AppointmentForm';
import AppointmentDetails from './AppointmentDetails';
import WaitlistManagement from './WaitlistManagement';

type ViewType = 'list' | 'calendar' | 'form' | 'details' | 'waitlist';

const AppointmentManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleCreateAppointment = (date?: string) => {
    setEditingAppointment(null);
    setSelectedDate(date || selectedDate);
    setCurrentView('form');
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setCurrentView('form');
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCurrentView('details');
  };

  const handleSaveAppointment = (appointmentData: Partial<Appointment>) => {
    // In a real app, this would save to the backend
    console.log('Saving appointment:', appointmentData);
    setCurrentView('calendar');
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    // In a real app, this would delete from the backend
    console.log('Deleting appointment:', appointmentId);
    setCurrentView('calendar');
    setSelectedAppointment(null);
  };

  const handleBack = () => {
    setCurrentView('calendar');
    setSelectedAppointment(null);
    setEditingAppointment(null);
  };

  const handleCancel = () => {
    setCurrentView('calendar');
    setEditingAppointment(null);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6">
      {currentView === 'list' && (
        <AppointmentList
          onCreateAppointment={handleCreateAppointment}
          onEditAppointment={handleEditAppointment}
          onViewAppointment={handleViewAppointment}
          onSwitchToCalendar={() => setCurrentView('calendar')}
          onManageWaitlist={() => setCurrentView('waitlist')}
        />
      )}

      {currentView === 'calendar' && (
        <AppointmentCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onCreateAppointment={handleCreateAppointment}
          onEditAppointment={handleEditAppointment}
          onViewAppointment={handleViewAppointment}
          onSwitchToList={() => setCurrentView('list')}
          onManageWaitlist={() => setCurrentView('waitlist')}
        />
      )}

      {currentView === 'form' && (
        <AppointmentForm
          appointment={editingAppointment || undefined}
          selectedDate={selectedDate}
          onSave={handleSaveAppointment}
          onCancel={handleCancel}
        />
      )}

      {currentView === 'details' && selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onBack={handleBack}
          onEdit={() => handleEditAppointment(selectedAppointment)}
          onDelete={() => handleDeleteAppointment(selectedAppointment.id)}
        />
      )}

      {currentView === 'waitlist' && (
        <WaitlistManagement
          onBack={handleBack}
          onCreateAppointment={handleCreateAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentManagement;