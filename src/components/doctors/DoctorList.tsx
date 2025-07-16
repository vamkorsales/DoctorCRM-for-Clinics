import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  Star,
  Clock,
  Edit,
  Eye,
  BarChart3,
  MoreVertical
} from 'lucide-react';
import { Doctor, DoctorSearchFilters } from '../../types/doctor';
import { mockDoctors, specializations, departments } from '../../data/doctorMockData';
import { formatPhone } from '../../utils/formatUtils';

interface DoctorListProps {
  onDoctorSelect: (doctor: Doctor) => void;
  onCreateDoctor: () => void;
  onEditDoctor: (doctor: Doctor) => void;
  onViewDashboard: (doctor: Doctor) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({
  onDoctorSelect,
  onCreateDoctor,
  onEditDoctor,
  onViewDashboard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DoctorSearchFilters>({});
  const [sortBy, setSortBy] = useState<'name' | 'specialization' | 'experience' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredDoctors = useMemo(() => {
    let filtered = mockDoctors.filter(doctor => {
      const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      const matchesSearch = !searchTerm || 
        fullName.includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization = !filters.specialization || doctor.specialization === filters.specialization;
      const matchesDepartment = !filters.department || doctor.department === filters.department;
      const matchesRating = !filters.rating || doctor.performanceMetrics.averageRating >= filters.rating;

      let matchesAvailability = true;
      if (filters.availability) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const todaySchedule = doctor.workingHours[today];
        
        if (filters.availability === 'available') {
          matchesAvailability = todaySchedule?.available && doctor.isActive;
        } else if (filters.availability === 'busy') {
          matchesAvailability = !todaySchedule?.available || !doctor.isActive;
        }
      }

      return matchesSearch && matchesSpecialization && matchesDepartment && 
             matchesRating && matchesAvailability;
    });

    // Sort doctors
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'specialization':
          comparison = a.specialization.localeCompare(b.specialization);
          break;
        case 'experience':
          const aExp = a.experience.reduce((total, exp) => {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            return total + (end.getTime() - start.getTime());
          }, 0);
          const bExp = b.experience.reduce((total, exp) => {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            return total + (end.getTime() - start.getTime());
          }, 0);
          comparison = aExp - bExp;
          break;
        case 'rating':
          comparison = a.performanceMetrics.averageRating - b.performanceMetrics.averageRating;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mockDoctors, searchTerm, filters, sortBy, sortOrder]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getAvailabilityStatus = (doctor: Doctor) => {
    if (!doctor.isActive) return { status: 'Inactive', color: 'bg-red-100 text-red-800' };
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todaySchedule = doctor.workingHours[today];
    
    if (!todaySchedule?.available) {
      return { status: 'Off Today', color: 'bg-gray-100 text-gray-800' };
    }
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (currentTime >= todaySchedule.start && currentTime <= todaySchedule.end) {
      return { status: 'Available', color: 'bg-green-100 text-green-800' };
    }
    
    return { status: 'Off Hours', color: 'bg-yellow-100 text-yellow-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage medical staff and their schedules</p>
        </div>
        <button
          onClick={onCreateDoctor}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or email..."
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
              setSortBy(field as 'name' | 'specialization' | 'experience' | 'rating');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="specialization-asc">Specialization A-Z</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="experience-desc">Most Experienced</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select
                  value={filters.specialization || ''}
                  onChange={(e) => setFilters({...filters, specialization: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={filters.department || ''}
                  onChange={(e) => setFilters({...filters, department: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={filters.availability || ''}
                  onChange={(e) => setFilters({...filters, availability: e.target.value as any || undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="available">Available Today</option>
                  <option value="busy">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating || ''}
                  onChange={(e) => setFilters({...filters, rating: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
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

      {/* Doctor List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredDoctors.length === 0 ? (
          <div className="p-12 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first doctor.'}
            </p>
            <button
              onClick={onCreateDoctor}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Add First Doctor
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredDoctors.map((doctor) => {
              const availability = getAvailabilityStatus(doctor);
              const totalExperience = doctor.experience.reduce((total, exp) => {
                const start = new Date(exp.startDate);
                const end = exp.endDate ? new Date(exp.endDate) : new Date();
                return total + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
              }, 0);

              return (
                <div key={doctor.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        {doctor.profilePhoto ? (
                          <img
                            src={doctor.profilePhoto}
                            alt={`${doctor.title} ${doctor.firstName} ${doctor.lastName}`}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-semibold text-xl">
                            {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {doctor.title} {doctor.firstName} {doctor.lastName}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${availability.color}`}>
                            {availability.status}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">
                              {doctor.performanceMetrics.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({doctor.performanceMetrics.totalReviews})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                          <span className="font-medium">{doctor.specialization}</span>
                          <span>{doctor.department}</span>
                          <span>{totalExperience} years experience</span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{formatPhone(doctor.phone)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{doctor.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{doctor.performanceMetrics.activePatients} active patients</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{doctor.consultationDuration} min consultations</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDashboard(doctor)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={() => onDoctorSelect(doctor)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => onEditDoctor(doctor)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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
              );
            })}
          </div>
        )}

        {/* Results Summary */}
        {filteredDoctors.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {filteredDoctors.length} of {mockDoctors.length} doctors
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;