import React, { useState } from 'react';
import { X, Upload, User, Phone, Mail, MapPin, Heart, Shield, FileText } from 'lucide-react';
import { Patient } from '../../types/patient';

interface PatientFormProps {
  patient?: Patient;
  onSave: (patient: Partial<Patient>) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    dateOfBirth: patient?.dateOfBirth || '',
    gender: patient?.gender || 'male',
    email: patient?.email || '',
    phone: patient?.phone || '',
    address: {
      street: patient?.address.street || '',
      city: patient?.address.city || '',
      state: patient?.address.state || '',
      zipCode: patient?.address.zipCode || '',
      country: patient?.address.country || 'United States'
    },
    emergencyContact: {
      name: patient?.emergencyContact.name || '',
      relationship: patient?.emergencyContact.relationship || '',
      phone: patient?.emergencyContact.phone || '',
      email: patient?.emergencyContact.email || ''
    },
    insurance: {
      provider: patient?.insurance.provider || '',
      policyNumber: patient?.insurance.policyNumber || '',
      groupNumber: patient?.insurance.groupNumber || '',
      memberID: patient?.insurance.memberID || '',
      effectiveDate: patient?.insurance.effectiveDate || '',
      expirationDate: patient?.insurance.expirationDate || ''
    },
    bloodType: patient?.bloodType || 'Unknown',
    allergies: patient?.allergies || [],
    currentMedications: patient?.currentMedications || [],
    customFields: patient?.customFields || []
  });

  const [activeSection, setActiveSection] = useState<'personal' | 'contact' | 'emergency' | 'insurance' | 'medical'>('personal');
  const [newAllergy, setNewAllergy] = useState({ allergen: '', severity: 'mild', reaction: '' });
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', purpose: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addAllergy = () => {
    if (newAllergy.allergen && newAllergy.reaction) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, {
          id: Date.now().toString(),
          allergen: newAllergy.allergen,
          severity: newAllergy.severity as any,
          reaction: newAllergy.reaction,
          dateIdentified: new Date().toISOString().split('T')[0]
        }]
      });
      setNewAllergy({ allergen: '', severity: 'mild', reaction: '' });
    }
  };

  const removeAllergy = (id: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(allergy => allergy.id !== id)
    });
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setFormData({
        ...formData,
        currentMedications: [...formData.currentMedications, {
          id: Date.now().toString(),
          name: newMedication.name,
          dosage: newMedication.dosage,
          frequency: newMedication.frequency,
          route: 'oral',
          startDate: new Date().toISOString().split('T')[0],
          prescribedBy: 'Current Doctor',
          purpose: newMedication.purpose
        }]
      });
      setNewMedication({ name: '', dosage: '', frequency: '', purpose: '' });
    }
  };

  const removeMedication = (id: string) => {
    setFormData({
      ...formData,
      currentMedications: formData.currentMedications.filter(med => med.id !== id)
    });
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'emergency', label: 'Emergency Contact', icon: Phone },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'medical', label: 'Medical Info', icon: Heart }
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
                  {patient ? 'Edit Patient' : 'Add New Patient'}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({...formData, bloodType: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Unknown">Unknown</option>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={formData.address.street}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, street: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={formData.address.city}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: {...formData.address, city: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={formData.address.state}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: {...formData.address, state: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                        <input
                          type="text"
                          required
                          value={formData.address.zipCode}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: {...formData.address, zipCode: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'emergency' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.emergencyContact.email}
                        onChange={(e) => setFormData({
                          ...formData, 
                          emergencyContact: {...formData.emergencyContact, email: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'insurance' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                      <input
                        type="text"
                        value={formData.insurance.provider}
                        onChange={(e) => setFormData({
                          ...formData, 
                          insurance: {...formData.insurance, provider: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                      <input
                        type="text"
                        value={formData.insurance.policyNumber}
                        onChange={(e) => setFormData({
                          ...formData, 
                          insurance: {...formData.insurance, policyNumber: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                      <input
                        type="text"
                        value={formData.insurance.groupNumber}
                        onChange={(e) => setFormData({
                          ...formData, 
                          insurance: {...formData.insurance, groupNumber: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                      <input
                        type="text"
                        value={formData.insurance.memberID}
                        onChange={(e) => setFormData({
                          ...formData, 
                          insurance: {...formData.insurance, memberID: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={formData.insurance.effectiveDate}
                        onChange={(e) => setFormData({
                          ...formData, 
                          insurance: {...formData.insurance, effectiveDate: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                      <input
                        type="date"
                        value={formData.insurance.expirationDate}
                        onChange={(e) => setFormData({
                          ...formData, 
                          insurance: {...formData.insurance, expirationDate: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'medical' && (
                  <div className="space-y-8">
                    {/* Allergies */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Allergies</h4>
                      
                      {/* Add New Allergy */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <input
                            type="text"
                            placeholder="Allergen"
                            value={newAllergy.allergen}
                            onChange={(e) => setNewAllergy({...newAllergy, allergen: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <select
                            value={newAllergy.severity}
                            onChange={(e) => setNewAllergy({...newAllergy, severity: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                            <option value="life-threatening">Life-threatening</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Reaction"
                            value={newAllergy.reaction}
                            onChange={(e) => setNewAllergy({...newAllergy, reaction: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={addAllergy}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Existing Allergies */}
                      {formData.allergies.length > 0 && (
                        <div className="space-y-2">
                          {formData.allergies.map((allergy) => (
                            <div key={allergy.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                              <div>
                                <span className="font-medium text-red-900">{allergy.allergen}</span>
                                <span className="text-red-700 ml-2">({allergy.severity})</span>
                                <span className="text-red-600 ml-2">- {allergy.reaction}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAllergy(allergy.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Current Medications */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Current Medications</h4>
                      
                      {/* Add New Medication */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <input
                            type="text"
                            placeholder="Medication name"
                            value={newMedication.name}
                            onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={newMedication.dosage}
                            onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Frequency"
                            value={newMedication.frequency}
                            onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Purpose"
                            value={newMedication.purpose}
                            onChange={(e) => setNewMedication({...newMedication, purpose: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={addMedication}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Existing Medications */}
                      {formData.currentMedications.length > 0 && (
                        <div className="space-y-2">
                          {formData.currentMedications.map((medication) => (
                            <div key={medication.id} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div>
                                <span className="font-medium text-blue-900">{medication.name}</span>
                                <span className="text-blue-700 ml-2">{medication.dosage}</span>
                                <span className="text-blue-600 ml-2">- {medication.frequency}</span>
                                {medication.purpose && (
                                  <span className="text-blue-600 ml-2">({medication.purpose})</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeMedication(medication.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {patient ? 'Update Patient' : 'Create Patient'}
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

export default PatientForm;