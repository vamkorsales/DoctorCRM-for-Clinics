import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, AlertTriangle, Repeat } from 'lucide-react';
import { Appointment, RecurringPattern, AppointmentConflict } from '../../types/appointment';
import { mockDoctors } from '../../data/appointmentMockData';
import { mockPatients } from '../../data/patientMockData';

interface AppointmentFormProps {
  appointment?: Appointment;
  selectedDate?: string;
  onSave: (appointment: Partial<Appointment>) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  selectedDate,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    date: appointment?.date || selectedDate || new Date().toISOString().split('T')[0],
    startTime: appointment?.startTime || '09:00',
    endTime: appointment?.endTime || '09:30',
    duration: appointment?.duration || 30,
    type: appointment?.type || 'consultation',
    status: appointment?.status || 'scheduled',
    priority: appointment?.priority || 'normal',
    purpose: appointment?.purpose || '',
    notes: appointment?.notes || '',
    isRecurring: appointment?.isRecurring || false,
    recurringPattern: appointment?.recurringPattern || {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [],
      occurrences: 1
    } as RecurringPattern
  });

  const [conflicts, setConflicts] = useState<AppointmentConflict[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Calculate end time based on duration
    if (formData.startTime && formData.duration) {
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + formData.duration;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      
      setFormData(prev => ({ ...prev, endTime }));
    }
  }, [formData.startTime, formData.duration]);

  useEffect(() => {
    // Check for conflicts when date, time, or doctor changes
    checkForConflicts();
  }, [formData.date, formData.startTime, formData.endTime, formData.doctorId]);

  const checkForConflicts = () => {
    // In a real app, this would check against the backend
    // For now, we'll simulate conflict detection
    const newConflicts: AppointmentConflict[] = [];
    
    // Check if appointment is outside working hours
    const selectedDoctor = mockDoctors.find(d => d.id === formData.doctorId);
    if (selectedDoctor) {
      const dayOfWeek = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const workingHours = selectedDoctor.workingHours[dayOfWeek as keyof typeof selectedDoctor.workingHours];
      
      if (!workingHours.available) {
        newConflicts.push({
          conflictType: 'outside-hours',
          message: `Dr. ${selectedDoctor.lastName} is not available on ${dayOfWeek}s`
        });
      } else {
        const startTime = formData.startTime;
        const endTime = formData.endTime;
        
        if (startTime < workingHours.start || endTime > workingHours.end) {
          newConflicts.push({
            conflictType: 'outside-hours',
            message: `Appointment is outside Dr. ${selectedDoctor.lastName}'s working hours (${workingHours.start} - ${workingHours.end})`
          });
        }
      }
    }

    setConflicts(newConflicts);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (formData.duration < 15) newErrors.duration = 'Duration must be at least 15 minutes';

    // Check if date is in the past
    const appointmentDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      newErrors.date = 'Cannot schedule appointments in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (conflicts.length > 0) {
      const confirmProceed = window.confirm(
        'There are conflicts with this appointment. Do you want to proceed anyway?'
      );
      if (!confirmProceed) {
        return;
      }
    }

    setIsLoading(true);

    try {
      const appointmentData = {
        ...formData,
        id: appointment?.id || `APT-${Date.now()}`,
        createdAt: appointment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: appointment?.createdBy || 'Current User',
        lastModifiedBy: 'Current User',
        reminderSent: false
      };

      await onSave(appointmentData);
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'routine-checkup', label: 'Routine Checkup' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'lab-work', label: 'Lab Work' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' },
    { value: 'rescheduled', label: 'Rescheduled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                </h3>
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Conflicts Alert */}
              {conflicts.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Scheduling Conflicts</h4>
                      <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                        {conflicts.map((conflict, index) => (
                          <li key={index}>• {conflict.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient *
                    </label>
                    <select
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.patientId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a patient</option>
                      {mockPatients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} (ID: {patient.id})
                        </option>
                      ))}
                    </select>
                    {errors.patientId && (
                      <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor *
                    </label>
                    <select
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.doctorId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a doctor</option>
                      {mockDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && (
                      <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.date ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.startTime ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.startTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration *
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.duration ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        {durationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.duration && (
                        <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {appointmentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {priorityOptions.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose/Reason *
                    </label>
                    <input
                      type="text"
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      placeholder="e.g., Annual checkup, Follow-up consultation"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.purpose ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.purpose && (
                      <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes or special instructions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Recurring Appointment */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                        <Repeat className="h-4 w-4 inline mr-1" />
                        Recurring Appointment
                      </label>
                    </div>

                    {formData.isRecurring && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequency
                            </label>
                            <select
                              value={formData.recurringPattern.frequency}
                              onChange={(e) => setFormData({
                                ...formData,
                                recurringPattern: {
                                  ...formData.recurringPattern,
                                  frequency: e.target.value as any
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Repeat Every
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={formData.recurringPattern.interval}
                              onChange={(e) => setFormData({
                                ...formData,
                                recurringPattern: {
                                  ...formData.recurringPattern,
                                  interval: parseInt(e.target.value)
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Occurrences
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.recurringPattern.occurrences || 1}
                            onChange={(e) => setFormData({
                              ...formData,
                              recurringPattern: {
                                ...formData.recurringPattern,
                                occurrences: parseInt(e.target.value)
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isLoading ? 'Saving...' : (appointment ? 'Update Appointment' : 'Schedule Appointment')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;