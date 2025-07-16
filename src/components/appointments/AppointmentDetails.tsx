import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Bell,
  Repeat,
  History
} from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { mockDoctors } from '../../data/appointmentMockData';
import { mockPatients } from '../../data/patientMockData';
import { formatDate, formatTime } from '../../utils/dateUtils';

interface AppointmentDetailsProps {
  appointment: Appointment;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onBack,
  onEdit,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'notes'>('details');

  const patient = mockPatients.find(p => p.id === appointment.patientId);
  const doctor = mockDoctors.find(d => d.id === appointment.doctorId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
      case 'no-show':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'scheduled':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    // In a real app, this would update the appointment status
    console.log('Changing status to:', newStatus);
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'notes', label: 'Notes', icon: MessageSquare }
  ];

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
            <span>Back to Appointments</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                showDeleteConfirm 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>{showDeleteConfirm ? 'Confirm Delete' : 'Delete'}</span>
            </button>
            {showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Appointment Header Info */}
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            {patient?.profilePhoto ? (
              <img
                src={patient.profilePhoto}
                alt={`${patient.firstName} ${patient.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">
                {patient?.firstName.charAt(0)}{patient?.lastName.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {patient?.firstName} {patient?.lastName}
              </h1>
              <div className="flex items-center space-x-2">
                {getStatusIcon(appointment.status)}
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              {appointment.priority !== 'normal' && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(appointment.priority)}`}>
                  {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)} Priority
                </span>
              )}
              {appointment.isRecurring && (
                <span className="flex items-center space-x-1 px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                  <Repeat className="h-3 w-3" />
                  <span>Recurring</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Dr. {doctor?.firstName} {doctor?.lastName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="capitalize">{appointment.type.replace('-', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="flex items-center space-x-2">
            {appointment.status === 'scheduled' && (
              <button
                onClick={() => handleStatusChange('confirmed')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Confirm
              </button>
            )}
            {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
              <button
                onClick={() => handleStatusChange('completed')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Mark Complete
              </button>
            )}
            {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <Bell className="h-4 w-4" />
              <span>Send Reminder</span>
            </button>
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
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* Appointment Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose</label>
                    <p className="mt-1 text-sm text-gray-900">{appointment.purpose}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <p className="mt-1 text-sm text-gray-900">{appointment.duration} minutes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{appointment.type.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(appointment.createdAt)} by {appointment.createdBy}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Modified</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(appointment.updatedAt)} by {appointment.lastModifiedBy}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{patient?.firstName} {patient?.lastName}</p>
                      <p className="text-sm text-gray-500">Patient ID: {patient?.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{patient?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{patient?.email}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-gray-900">{patient?.address.street}</div>
                      <div className="text-gray-900">{patient?.address.city}, {patient?.address.state} {patient?.address.zipCode}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {doctor?.firstName.charAt(0)}{doctor?.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Dr. {doctor?.firstName} {doctor?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{doctor?.specialization}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{doctor?.email}</span>
                      <span>{doctor?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recurring Information */}
            {appointment.isRecurring && appointment.recurringPattern && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recurring Pattern</h3>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Repeat className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Recurring Appointment</span>
                  </div>
                  <div className="text-sm text-purple-800">
                    <p>Frequency: Every {appointment.recurringPattern.interval} {appointment.recurringPattern.frequency}</p>
                    {appointment.recurringPattern.occurrences && (
                      <p>Total occurrences: {appointment.recurringPattern.occurrences}</p>
                    )}
                    {appointment.recurringPattern.endDate && (
                      <p>End date: {formatDate(appointment.recurringPattern.endDate)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reminders */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminders</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Email Reminder</p>
                      <p className="text-sm text-gray-500">
                        {appointment.reminderSent 
                          ? `Sent on ${appointment.reminderDate ? formatDate(appointment.reminderDate) : 'Unknown'}`
                          : 'Not sent'
                        }
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.reminderSent 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.reminderSent ? 'Sent' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
            
            {appointment.rescheduleHistory && appointment.rescheduleHistory.length > 0 ? (
              <div className="space-y-4">
                {appointment.rescheduleHistory.map((record) => (
                  <div key={record.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Rescheduled</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          From: {formatDate(record.originalDate)} at {formatTime(record.originalStartTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          To: {formatDate(record.newDate)} at {formatTime(record.newStartTime)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Reason: {record.reason}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>By: {record.rescheduledBy}</p>
                        <p>{formatDate(record.rescheduledAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No history available</h3>
                <p className="text-gray-500">This appointment has not been modified.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Notes</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Add Note
              </button>
            </div>
            
            {appointment.notes ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Appointment Notes</h4>
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notes available</h3>
                <p className="text-gray-500">Add notes to keep track of important information about this appointment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;