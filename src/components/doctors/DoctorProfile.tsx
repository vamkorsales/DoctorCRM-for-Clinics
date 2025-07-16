import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  Star,
  Clock,
  Users,
  DollarSign,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Shield,
  BarChart3,
  Plus,
  Trash2
} from 'lucide-react';
import { Doctor } from '../../types/doctor';
import { formatPhone, formatCurrency } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

interface DoctorProfileProps {
  doctor: Doctor;
  onBack: () => void;
  onEdit: () => void;
  onViewDashboard: () => void;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ 
  doctor, 
  onBack, 
  onEdit, 
  onViewDashboard 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'patients' | 'performance' | 'qualifications'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'qualifications', label: 'Qualifications', icon: GraduationCap }
  ];

  const getTotalExperience = () => {
    return doctor.experience.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      return total + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
    }, 0);
  };

  const getWorkingDays = () => {
    return Object.entries(doctor.workingHours)
      .filter(([_, schedule]) => schedule.available)
      .map(([day, _]) => day.charAt(0).toUpperCase() + day.slice(1));
  };

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
            <span>Back to Doctors</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onViewDashboard}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Doctor Info Header */}
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
            {doctor.profilePhoto ? (
              <img
                src={doctor.profilePhoto}
                alt={`${doctor.title} ${doctor.firstName} ${doctor.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-2xl">
                {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {doctor.title} {doctor.firstName} {doctor.lastName}
              </h1>
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold text-gray-900">
                  {doctor.performanceMetrics.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({doctor.performanceMetrics.totalReviews} reviews)
                </span>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {doctor.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>{doctor.specialization}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>{doctor.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{getTotalExperience()} years experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{doctor.performanceMetrics.activePatients} active patients</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{formatPhone(doctor.phone)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>License: {doctor.licenseNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <span>{doctor.languages.join(', ')}</span>
              </div>
            </div>
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Bio */}
            {doctor.bio && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {/* Consultation Fees */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Standard</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(doctor.consultationFee.standard)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Follow-up</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(doctor.consultationFee.followUp)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Emergency</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(doctor.consultationFee.emergency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {doctor.emergencyContact.name} ({doctor.emergencyContact.relationship})
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{formatPhone(doctor.emergencyContact.phone)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Patients/Day:</span>
                    <span className="font-medium text-gray-900">{doctor.maxPatientsPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Duration:</span>
                    <span className="font-medium text-gray-900">{doctor.consultationDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Working Days:</span>
                    <span className="font-medium text-gray-900">{getWorkingDays().join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
            <div className="space-y-4">
              {Object.entries(doctor.workingHours).map(([day, schedule]) => (
                <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900 w-20 capitalize">{day}</span>
                    {schedule.available ? (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">
                          {schedule.start} - {schedule.end}
                        </span>
                        {schedule.breakTime && (
                          <span className="text-sm text-gray-500">
                            (Break: {schedule.breakTime.start} - {schedule.breakTime.end})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Not available</span>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    schedule.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {schedule.available ? 'Available' : 'Off'}
                  </span>
                </div>
              ))}
            </div>

            {/* Blocked Time Slots */}
            {doctor.blockedTimeSlots.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Blocked Time Slots</h4>
                <div className="space-y-3">
                  {doctor.blockedTimeSlots.map((slot) => (
                    <div key={slot.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-red-900">{slot.reason}</h5>
                          <p className="text-sm text-red-700 mt-1">
                            {formatDate(slot.date)} • {slot.startTime} - {slot.endTime}
                          </p>
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full capitalize">
                            {slot.type}
                          </span>
                        </div>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leave Schedule */}
            {doctor.leaveSchedule.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Leave</h4>
                <div className="space-y-3">
                  {doctor.leaveSchedule.map((leave) => (
                    <div key={leave.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-yellow-900">{leave.reason}</h5>
                          <p className="text-sm text-yellow-700 mt-1">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full capitalize">
                              {leave.type}
                            </span>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                              leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {leave.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Patients</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>Assign Patient</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Total Patients</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {doctor.performanceMetrics.totalPatients}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Active Patients</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {doctor.performanceMetrics.activePatients}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">This Month</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {doctor.performanceMetrics.monthlyStats[0]?.newPatients || 0}
                </p>
                <p className="text-sm text-purple-700">new patients</p>
              </div>
            </div>

            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Patient list integration</h3>
              <p className="text-gray-500">
                Patient details would be displayed here with integration to the patient management system.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Total Appointments</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {doctor.performanceMetrics.totalAppointments}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Average Rating</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {doctor.performanceMetrics.averageRating.toFixed(1)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Completion Rate</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {((doctor.performanceMetrics.completedAppointments / doctor.performanceMetrics.totalAppointments) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">No-Show Rate</span>
                </div>
                <p className="text-2xl font-bold text-red-900">
                  {doctor.performanceMetrics.noShowRate.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Monthly Performance */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h4>
              <div className="space-y-4">
                {doctor.performanceMetrics.monthlyStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{stat.month} {stat.year}</h5>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{stat.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Appointments:</span>
                        <span className="font-medium text-gray-900 ml-2">{stat.appointments}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">New Patients:</span>
                        <span className="font-medium text-gray-900 ml-2">{stat.newPatients}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium text-gray-900 ml-2">{formatCurrency(stat.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qualifications' && (
          <div className="space-y-8">
            {/* Education */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Qualifications</h3>
              <div className="space-y-4">
                {doctor.qualifications.map((qual) => (
                  <div key={qual.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{qual.degree}</h4>
                        <p className="text-gray-600 mt-1">{qual.institution}</p>
                        {qual.specialization && (
                          <p className="text-sm text-gray-500 mt-1">Specialization: {qual.specialization}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{qual.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Experience</h3>
              <div className="space-y-4">
                {doctor.experience.map((exp) => (
                  <div key={exp.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.organization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                        </p>
                        {exp.isCurrent && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Licenses */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Licenses & Registrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Medical License</span>
                  </div>
                  <p className="text-gray-700">{doctor.licenseNumber}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Registration Number</span>
                  </div>
                  <p className="text-gray-700">{doctor.registrationNumber}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;