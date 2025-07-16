import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  X,
  Search,
  Filter
} from 'lucide-react';
import { WaitlistEntry } from '../../types/appointment';
import { mockWaitlist } from '../../data/appointmentMockData';
import { mockPatients } from '../../data/patientMockData';
import { formatDate } from '../../utils/dateUtils';

interface WaitlistManagementProps {
  onBack: () => void;
  onCreateAppointment: (date?: string) => void;
}

const WaitlistManagement: React.FC<WaitlistManagementProps> = ({
  onBack,
  onCreateAppointment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'patient'>('date');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredWaitlist = mockWaitlist.filter(entry => {
    const patient = mockPatients.find(p => p.id === entry.patientId);
    const matchesSearch = !searchTerm || 
      `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.appointmentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || entry.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime();
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'patient':
        const patientA = mockPatients.find(p => p.id === a.patientId);
        const patientB = mockPatients.find(p => p.id === b.patientId);
        return `${patientA?.firstName} ${patientA?.lastName}`.localeCompare(`${patientB?.firstName} ${patientB?.lastName}`);
      default:
        return 0;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSelectEntry = (entryId: string) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredWaitlist.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredWaitlist.map(entry => entry.id));
    }
  };

  const handleScheduleAppointment = (entry: WaitlistEntry) => {
    // In a real app, this would create an appointment and remove from waitlist
    console.log('Scheduling appointment for waitlist entry:', entry);
    onCreateAppointment(entry.preferredDate);
  };

  const handleNotifyPatient = (entryId: string) => {
    // In a real app, this would send a notification to the patient
    console.log('Notifying patient for entry:', entryId);
  };

  const handleRemoveFromWaitlist = (entryId: string) => {
    // In a real app, this would remove the entry from the waitlist
    console.log('Removing from waitlist:', entryId);
  };

  const handleBulkAction = (action: 'notify' | 'remove') => {
    console.log(`Bulk ${action} for entries:`, selectedEntries);
    setSelectedEntries([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Appointments</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Waitlist Management</h1>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Waitlist</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or appointment type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="patient">Sort by Patient</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedEntries.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedEntries.length} entry(ies) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('notify')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                >
                  Notify All
                </button>
                <button
                  onClick={() => handleBulkAction('remove')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Remove All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Waitlist Entries */}
      <div className="divide-y divide-gray-200">
        {filteredWaitlist.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No waitlist entries</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterPriority !== 'all'
                ? 'No entries match your search criteria.'
                : 'The waitlist is currently empty.'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add First Entry
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
                    checked={selectedEntries.length === filteredWaitlist.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                  <div>Patient</div>
                  <div>Preferred Date</div>
                  <div>Type</div>
                  <div>Priority</div>
                  <div>Actions</div>
                </div>
              </div>
            </div>

            {/* Entries */}
            {filteredWaitlist.map((entry) => {
              const patient = mockPatients.find(p => p.id === entry.patientId);
              
              return (
                <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-8">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry.id)}
                        onChange={() => handleSelectEntry(entry.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {patient?.firstName} {patient?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient?.phone}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(entry.preferredDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.preferredTimeRange.start} - {entry.preferredTimeRange.end}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {entry.appointmentType.replace('-', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Added {formatDate(entry.createdAt)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(entry.priority)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(entry.priority)}`}>
                            {entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1)}
                          </span>
                        </div>
                        {entry.notified && (
                          <div className="mt-1">
                            <span className="flex items-center space-x-1 text-xs text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Notified</span>
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleScheduleAppointment(entry)}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                        >
                          Schedule
                        </button>
                        <button
                          onClick={() => handleNotifyPatient(entry.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                        >
                          Notify
                        </button>
                        <button
                          onClick={() => handleRemoveFromWaitlist(entry.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <div className="mt-2 ml-8 text-sm text-gray-600">
                      <strong>Notes:</strong> {entry.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Results Summary */}
      {filteredWaitlist.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredWaitlist.length} of {mockWaitlist.length} waitlist entries
          </p>
        </div>
      )}

      {/* Add to Waitlist Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add to Waitlist
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select a patient</option>
                      {mockPatients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Additional notes or special requirements..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </form>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add to Waitlist
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistManagement;