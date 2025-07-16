import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Edit,
  Eye,
  MoreVertical,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Appointment, AppointmentSearchFilters } from '../../types/appointment';
import { mockAppointments, mockDoctors } from '../../data/appointmentMockData';
import { mockPatients } from '../../data/patientMockData';
import { formatDate, formatTime } from '../../utils/dateUtils';

interface AppointmentListProps {
  onCreateAppointment: () => void;
  onEditAppointment: (appointment: Appointment) => void;
  onViewAppointment: (appointment: Appointment) => void;
  onSwitchToCalendar: () => void;
  onManageWaitlist: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  onCreateAppointment,
  onEditAppointment,
  onViewAppointment,
  onSwitchToCalendar,
  onManageWaitlist
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AppointmentSearchFilters>({});
  const [sortBy, setSortBy] = useState<'date' | 'patient' | 'doctor' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);

  const filteredAppointments = useMemo(() => {
    let filtered = mockAppointments.filter(appointment => {
      const patient = mockPatients.find(p => p.id === appointment.patientId);
      const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
      
      const matchesSearch = !searchTerm || 
        `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${doctor?.firstName} ${doctor?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status?.length || filters.status.includes(appointment.status);
      const matchesType = !filters.type?.length || filters.type.includes(appointment.type);
      const matchesDoctor = !filters.doctorId || appointment.doctorId === filters.doctorId;
      const matchesPatient = !filters.patientId || appointment.patientId === filters.patientId;

      let matchesDateRange = true;
      if (filters.dateRange) {
        const appointmentDate = new Date(appointment.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        matchesDateRange = appointmentDate >= startDate && appointmentDate <= endDate;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDoctor && matchesPatient && matchesDateRange;
    });

    // Sort appointments
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime();
          break;
        case 'patient':
          const patientA = mockPatients.find(p => p.id === a.patientId);
          const patientB = mockPatients.find(p => p.id === b.patientId);
          comparison = `${patientA?.firstName} ${patientA?.lastName}`.localeCompare(`${patientB?.firstName} ${patientB?.lastName}`);
          break;
        case 'doctor':
          const doctorA = mockDoctors.find(d => d.id === a.doctorId);
          const doctorB = mockDoctors.find(d => d.id === b.doctorId);
          comparison = `${doctorA?.firstName} ${doctorA?.lastName}`.localeCompare(`${doctorB?.firstName} ${doctorB?.lastName}`);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mockAppointments, searchTerm, filters, sortBy, sortOrder]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
      case 'no-show':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectAppointment = (appointmentId: string) => {
    setSelectedAppointments(prev => 
      prev.includes(appointmentId) 
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredAppointments.map(apt => apt.id));
    }
  };

  const handleBulkAction = (action: 'cancel' | 'confirm' | 'delete') => {
    console.log(`Bulk ${action} for appointments:`, selectedAppointments);
    setSelectedAppointments([]);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={onManageWaitlist}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Users className="h-4 w-4" />
              <span>Waitlist</span>
            </button>
            <button
              onClick={onSwitchToCalendar}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar View</span>
            </button>
            <button
              onClick={onCreateAppointment}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments by patient, doctor, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'date' | 'patient' | 'doctor' | 'status');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date-asc">Date (Earliest)</option>
            <option value="date-desc">Date (Latest)</option>
            <option value="patient-asc">Patient A-Z</option>
            <option value="patient-desc">Patient Z-A</option>
            <option value="doctor-asc">Doctor A-Z</option>
            <option value="doctor-desc">Doctor Z-A</option>
            <option value="status-asc">Status A-Z</option>
            <option value="status-desc">Status Z-A</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  multiple
                  value={filters.status || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({...filters, status: values});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  multiple
                  value={filters.type || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({...filters, type: values});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="routine-checkup">Routine Checkup</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="lab-work">Lab Work</option>
                  <option value="procedure">Procedure</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  value={filters.doctorId || ''}
                  onChange={(e) => setFilters({...filters, doctorId: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Doctors</option>
                  {mockDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        ...filters.dateRange,
                        start: e.target.value,
                        end: filters.dateRange?.end || ''
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        start: filters.dateRange?.start || '',
                        end: e.target.value
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedAppointments.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedAppointments.length} appointment(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('confirm')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="divide-y divide-gray-200">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by scheduling your first appointment.'}
            </p>
            <button
              onClick={onCreateAppointment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Schedule First Appointment
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedAppointments.length === filteredAppointments.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1 grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                  <div>Patient</div>
                  <div>Date & Time</div>
                  <div>Doctor</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
              </div>
            </div>

            {/* Appointments */}
            {filteredAppointments.map((appointment) => {
              const patient = mockPatients.find(p => p.id === appointment.patientId);
              const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
              
              return (
                <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-8">
                      <input
                        type="checkbox"
                        checked={selectedAppointments.includes(appointment.id)}
                        onChange={() => handleSelectAppointment(appointment.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex-1 grid grid-cols-6 gap-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {patient?.firstName} {patient?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {patient?.id}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(appointment.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">
                          Dr. {doctor?.firstName} {doctor?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor?.specialization}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {appointment.type.replace('-', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.duration} minutes
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appointment.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        {appointment.priority !== 'normal' && (
                          <div className="mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
                              {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)} Priority
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onViewAppointment(appointment)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => onEditAppointment(appointment)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.purpose && (
                    <div className="mt-2 ml-8 text-sm text-gray-600">
                      <strong>Purpose:</strong> {appointment.purpose}
                    </div>
                  )}
                  
                  {appointment.notes && (
                    <div className="mt-1 ml-8 text-sm text-gray-600">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Results Summary */}
      {filteredAppointments.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredAppointments.length} of {mockAppointments.length} appointments
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;