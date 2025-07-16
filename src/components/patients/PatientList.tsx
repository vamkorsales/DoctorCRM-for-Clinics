import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  FileText,
  Edit,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Patient, PatientSearchFilters } from '../../types/patient';
import { fetchPatients, addPatient } from '../../api/patients';
import { formatDate, getAge } from '../../utils/dateUtils';
import { formatPhone } from '../../utils/formatUtils';
import { useToast } from '../common/ToastProvider';

interface PatientListProps {
  onPatientSelect: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  onPatientSelect,
  onEditPatient
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PatientSearchFilters>({});
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'lastVisit'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Utility to map Supabase patient to camelCase Patient type
  function mapPatientFromSupabase(p: any): Patient {
    return {
      ...p,
      firstName: p.first_name ?? '',
      lastName: p.last_name ?? '',
      dateOfBirth: p.dateOfBirth ?? p.date_of_birth ?? '',
      allergies: Array.isArray(p.allergies) ? p.allergies : [],
      insurance: p.insurance ?? { provider: '' },
      updatedAt: p.updatedAt ?? p.updated_at ?? '',
      profilePhoto: p.profilePhoto ?? '',
      bloodType: p.bloodType ?? p.blood_type ?? '',
      phone: p.phone ?? '',
      email: p.email ?? '',
      // add other fields as needed for UI safety
    };
  }

  useEffect(() => {
    setLoading(true);
    fetchPatients()
      .then(data => {
        const mapped = (data || []).map(mapPatientFromSupabase);
        setPatients(mapped);
        setError(null);
      })
      .catch(e => {
        setError(e.message);
        showToast(e.message || 'Failed to load patients', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const newPatient = await addPatient({
        first_name: addForm.firstName,
        last_name: addForm.lastName,
        email: addForm.email,
        phone: addForm.phone
      });
      const mappedPatient = mapPatientFromSupabase(newPatient);
      setPatients([mappedPatient, ...patients]);
      setShowAddForm(false);
      setAddForm({ firstName: '', lastName: '', email: '', phone: '' });
    } catch (err: any) {
      setAddError(err.message);
      showToast(err.message || 'Failed to add patient', 'error');
    } finally {
      setAddLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    let filtered = patients.filter(patient => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const matchesSearch = !searchTerm || 
        fullName.includes(searchTerm.toLowerCase()) ||
        (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phone || '').includes(searchTerm);

      const matchesGender = !filters.gender || patient.gender === filters.gender;
      const matchesBloodType = !filters.bloodType || patient.bloodType === filters.bloodType;
      
      let matchesAge = true;
      if (filters.ageRange) {
        const age = getAge(patient.dateOfBirth);
        matchesAge = age >= filters.ageRange.min && age <= filters.ageRange.max;
      }

      const matchesInsurance = !filters.insuranceProvider || 
        patient.insurance.provider.toLowerCase().includes(filters.insuranceProvider.toLowerCase());

      const matchesAllergies = filters.hasAllergies === undefined || 
        (filters.hasAllergies ? patient.allergies.length > 0 : patient.allergies.length === 0);

      return matchesSearch && matchesGender && matchesBloodType && 
             matchesAge && matchesInsurance && matchesAllergies;
    });

    // Sort patients
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'age':
          comparison = getAge(a.dateOfBirth) - getAge(b.dateOfBirth);
          break;
        case 'lastVisit':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [patients, searchTerm, filters, sortBy, sortOrder]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddForm(false)}
            >
              <span className="sr-only">Close</span>
              <FileText className="h-5 w-5" />
            </button>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Patient</h2>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="First Name" value={addForm.firstName} onChange={e => setAddForm(f => ({ ...f, firstName: e.target.value }))} required />
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Last Name" value={addForm.lastName} onChange={e => setAddForm(f => ({ ...f, lastName: e.target.value }))} required />
              <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Phone" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
              {addError && <div className="text-red-600 text-sm">{addError}</div>}
              <div className="flex justify-end space-x-2">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading/Error States */}
      {loading && <div className="text-center text-gray-500">Loading patients...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 border rounded-lg transition-colors duration-200 ${
              showFilters ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'name' | 'age' | 'lastVisit');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="age-asc">Age (Youngest)</option>
            <option value="age-desc">Age (Oldest)</option>
            <option value="lastVisit-desc">Recently Updated</option>
            <option value="lastVisit-asc">Oldest Updated</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={filters.gender || ''}
                  onChange={(e) => setFilters({...filters, gender: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <select
                  value={filters.bloodType || ''}
                  onChange={(e) => setFilters({...filters, bloodType: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.ageRange?.min || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      ageRange: {
                        ...filters.ageRange,
                        min: parseInt(e.target.value) || 0,
                        max: filters.ageRange?.max || 120
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.ageRange?.max || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      ageRange: {
                        min: filters.ageRange?.min || 0,
                        max: parseInt(e.target.value) || 120
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
                <input
                  type="text"
                  placeholder="Provider name"
                  value={filters.insuranceProvider || ''}
                  onChange={(e) => setFilters({...filters, insuranceProvider: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <select
                  value={filters.hasAllergies === undefined ? '' : filters.hasAllergies.toString()}
                  onChange={(e) => setFilters({
                    ...filters, 
                    hasAllergies: e.target.value === '' ? undefined : e.target.value === 'true'
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Has Allergies</option>
                  <option value="false">No Allergies</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first patient.'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Add First Patient
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {patient.profilePhoto ? (
                        <img
                          src={patient.profilePhoto}
                          alt={`${patient.firstName} ${patient.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 font-semibold text-lg">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {patient.id}
                        </span>
                        {patient.allergies.length > 0 && (
                          <span className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Allergies</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{getAge(patient.dateOfBirth)} years old</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{formatPhone(patient.phone)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>Blood Type: {patient.bloodType}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        Last updated: {formatDate(patient.updatedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPatientSelect(patient)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => onEditPatient(patient)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredPatients.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {filteredPatients.length} of {patients.length} patients
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;