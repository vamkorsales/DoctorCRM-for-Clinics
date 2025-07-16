import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  List, 
  Clock,
  Users,
  Filter,
  Search
} from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { mockAppointments, mockDoctors } from '../../data/appointmentMockData';
import { mockPatients } from '../../data/patientMockData';
import { formatTime, formatDate } from '../../utils/dateUtils';

interface AppointmentCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onCreateAppointment: (date?: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onViewAppointment: (appointment: Appointment) => void;
  onSwitchToList: () => void;
  onManageWaitlist: () => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onCreateAppointment,
  onEditAppointment,
  onViewAppointment,
  onSwitchToList,
  onManageWaitlist
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }, []);

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const getAppointmentsForDate = (date: string) => {
    return mockAppointments.filter(apt => {
      const matchesDate = apt.date === date;
      const matchesDoctor = selectedDoctor === 'all' || apt.doctorId === selectedDoctor;
      return matchesDate && matchesDoctor;
    });
  };

  const getAppointmentAtTime = (date: string, time: string) => {
    const appointments = getAppointmentsForDate(date);
    return appointments.find(apt => apt.startTime === time);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
    onDateSelect(newDate.toISOString().split('T')[0]);
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

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          <div className="bg-white p-4"></div>
          {weekDates.map((date) => (
            <div key={date.toISOString()} className="bg-white p-4 text-center">
              <div className="text-sm font-medium text-gray-600">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-semibold mt-1 ${
                date.toDateString() === new Date().toDateString() 
                  ? 'text-blue-600' 
                  : 'text-gray-900'
              }`}>
                {date.getDate()}
              </div>
            </div>
          ))}
          
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="bg-white p-4 text-right text-sm text-gray-500 border-r border-gray-100">
                {formatTime(time)}
              </div>
              {weekDates.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const appointment = getAppointmentAtTime(dateStr, time);
                return (
                  <div key={`${dateStr}-${time}`} className="bg-white p-2 min-h-[60px] border-r border-gray-100">
                    {appointment ? (
                      <div
                        onClick={() => onViewAppointment(appointment)}
                        className={`p-2 rounded-lg text-xs cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusColor(appointment.status)}`}
                      >
                        <div className="font-medium truncate">
                          {mockPatients.find(p => p.id === appointment.patientId)?.firstName} {mockPatients.find(p => p.id === appointment.patientId)?.lastName}
                        </div>
                        <div className="text-xs opacity-75 truncate mt-1">
                          {appointment.purpose}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onCreateAppointment(dateStr)}
                        className="w-full h-full hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center justify-center group"
                      >
                        <Plus className="h-4 w-4 text-gray-300 group-hover:text-gray-400" />
                      </button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and schedule appointments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onManageWaitlist}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Users className="h-4 w-4" />
            <span>Waitlist</span>
          </button>
          <button
            onClick={onSwitchToList}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <List className="h-4 w-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => onCreateAppointment()}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric',
                    ...(viewMode === 'day' ? { day: 'numeric' } : {})
                  })}
                </h2>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  onDateSelect(new Date().toISOString().split('T')[0]);
                }}
                className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                Today
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {(['day', 'week', 'month'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                      viewMode === mode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  showFilters ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All Doctors</option>
                    {mockDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Content */}
        <div className="h-[600px] overflow-hidden">
          {viewMode === 'week' && renderWeekView()}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;