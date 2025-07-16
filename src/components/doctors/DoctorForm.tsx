import React, { useState } from 'react';
import { X, Upload, User, Phone, Mail, Clock, DollarSign, GraduationCap, Briefcase } from 'lucide-react';
import { Doctor, Qualification, Experience } from '../../types/doctor';
import { specializations, departments } from '../../data/doctorMockData';

interface DoctorFormProps {
  doctor?: Doctor;
  onSave: (doctor: Partial<Doctor>) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: doctor?.title || 'Dr.',
    firstName: doctor?.firstName || '',
    lastName: doctor?.lastName || '',
    specialization: doctor?.specialization || '',
    department: doctor?.department || '',
    licenseNumber: doctor?.licenseNumber || '',
    registrationNumber: doctor?.registrationNumber || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    emergencyContact: {
      name: doctor?.emergencyContact.name || '',
      relationship: doctor?.emergencyContact.relationship || '',
      phone: doctor?.emergencyContact.phone || ''
    },
    workingHours: doctor?.workingHours || {
      monday: { start: '08:00', end: '17:00', available: true },
      tuesday: { start: '08:00', end: '17:00', available: true },
      wednesday: { start: '08:00', end: '17:00', available: true },
      thursday: { start: '08:00', end: '17:00', available: true },
      friday: { start: '08:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    consultationFee: {
      standard: doctor?.consultationFee.standard || 150,
      followUp: doctor?.consultationFee.followUp || 100,
      emergency: doctor?.consultationFee.emergency || 250
    },
    bio: doctor?.bio || '',
    languages: doctor?.languages || ['English'],
    maxPatientsPerDay: doctor?.maxPatientsPerDay || 20,
    consultationDuration: doctor?.consultationDuration || 30,
    qualifications: doctor?.qualifications || [],
    experience: doctor?.experience || []
  });

  const [activeSection, setActiveSection] = useState<'personal' | 'contact' | 'schedule' | 'fees' | 'qualifications' | 'experience'>('personal');
  const [newQualification, setNewQualification] = useState<Partial<Qualification>>({});
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addQualification = () => {
    if (newQualification.degree && newQualification.institution && newQualification.year) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, {
          id: Date.now().toString(),
          degree: newQualification.degree,
          institution: newQualification.institution,
          year: newQualification.year,
          specialization: newQualification.specialization
        }]
      });
      setNewQualification({});
    }
  };

  const removeQualification = (id: string) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter(qual => qual.id !== id)
    });
  };

  const addExperience = () => {
    if (newExperience.position && newExperience.organization && newExperience.startDate) {
      setFormData({
        ...formData,
        experience: [...formData.experience, {
          id: Date.now().toString(),
          position: newExperience.position,
          organization: newExperience.organization,
          startDate: newExperience.startDate,
          endDate: newExperience.endDate,
          description: newExperience.description || '',
          isCurrent: !newExperience.endDate
        }]
      });
      setNewExperience({});
    }
  };

  const removeExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter(exp => exp.id !== id)
    });
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'qualifications', label: 'Qualifications', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase }
  ];

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {doctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Section Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id as any)}
                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeSection === section.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Form Sections */}
              <div className="space-y-6">
                {activeSection === 'personal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <select
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                      <select
                        required
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select specialization</option>
                        {specializations.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                      <select
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Brief professional biography..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'contact' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.emergencyContact.name}
                            onChange={(e) => setFormData({
                              ...formData, 
                              emergencyContact: {...formData.emergencyContact, name: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                          <input
                            type="text"
                            required
                            value={formData.emergencyContact.relationship}
                            onChange={(e) => setFormData({
                              ...formData, 
                              emergencyContact: {...formData.emergencyContact, relationship: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={formData.emergencyContact.phone}
                            onChange={(e) => setFormData({
                              ...formData, 
                              emergencyContact: {...formData.emergencyContact, phone: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'schedule' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients per Day</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={formData.maxPatientsPerDay}
                          onChange={(e) => setFormData({...formData, maxPatientsPerDay: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Duration (minutes)</label>
                        <select
                          value={formData.consultationDuration}
                          onChange={(e) => setFormData({...formData, consultationDuration: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Working Hours</h4>
                      <div className="space-y-4">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-20">
                              <span className="font-medium text-gray-900 capitalize">{day}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.workingHours[day].available}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  workingHours: {
                                    ...formData.workingHours,
                                    [day]: {
                                      ...formData.workingHours[day],
                                      available: e.target.checked
                                    }
                                  }
                                })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-600">Available</span>
                            </div>
                            {formData.workingHours[day].available && (
                              <>
                                <div>
                                  <input
                                    type="time"
                                    value={formData.workingHours[day].start}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      workingHours: {
                                        ...formData.workingHours,
                                        [day]: {
                                          ...formData.workingHours[day],
                                          start: e.target.value
                                        }
                                      }
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <span className="text-gray-500">to</span>
                                <div>
                                  <input
                                    type="time"
                                    value={formData.workingHours[day].end}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      workingHours: {
                                        ...formData.workingHours,
                                        [day]: {
                                          ...formData.workingHours[day],
                                          end: e.target.value
                                        }
                                      }
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'fees' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Standard Consultation</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.consultationFee.standard}
                          onChange={(e) => setFormData({
                            ...formData,
                            consultationFee: {
                              ...formData.consultationFee,
                              standard: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Consultation</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.consultationFee.followUp}
                          onChange={(e) => setFormData({
                            ...formData,
                            consultationFee: {
                              ...formData.consultationFee,
                              followUp: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Consultation</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.consultationFee.emergency}
                          onChange={(e) => setFormData({
                            ...formData,
                            consultationFee: {
                              ...formData.consultationFee,
                              emergency: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'qualifications' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900">Qualifications</h4>
                    
                    {/* Add New Qualification */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={newQualification.degree || ''}
                          onChange={(e) => setNewQualification({...newQualification, degree: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={newQualification.institution || ''}
                          onChange={(e) => setNewQualification({...newQualification, institution: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Year"
                          value={newQualification.year || ''}
                          onChange={(e) => setNewQualification({...newQualification, year: parseInt(e.target.value)})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={addQualification}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Existing Qualifications */}
                    {formData.qualifications.length > 0 && (
                      <div className="space-y-3">
                        {formData.qualifications.map((qual) => (
                          <div key={qual.id} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div>
                              <span className="font-medium text-blue-900">{qual.degree}</span>
                              <span className="text-blue-700 ml-2">- {qual.institution} ({qual.year})</span>
                              {qual.specialization && (
                                <span className="text-blue-600 ml-2">• {qual.specialization}</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeQualification(qual.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900">Professional Experience</h4>
                    
                    {/* Add New Experience */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Position"
                          value={newExperience.position || ''}
                          onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Organization"
                          value={newExperience.organization || ''}
                          onChange={(e) => setNewExperience({...newExperience, organization: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="date"
                          placeholder="Start Date"
                          value={newExperience.startDate || ''}
                          onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="date"
                          placeholder="End Date (leave empty if current)"
                          value={newExperience.endDate || ''}
                          onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Description"
                        value={newExperience.description || ''}
                        onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Add Experience
                      </button>
                    </div>

                    {/* Existing Experience */}
                    {formData.experience.length > 0 && (
                      <div className="space-y-3">
                        {formData.experience.map((exp) => (
                          <div key={exp.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-green-900">{exp.position}</h5>
                                <p className="text-green-700">{exp.organization}</p>
                                <p className="text-sm text-green-600 mt-1">
                                  {exp.startDate} - {exp.endDate || 'Present'}
                                </p>
                                <p className="text-sm text-green-700 mt-2">{exp.description}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExperience(exp.id)}
                                className="text-green-600 hover:text-green-800 ml-4"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {doctor ? 'Update Doctor' : 'Create Doctor'}
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

export default DoctorForm;