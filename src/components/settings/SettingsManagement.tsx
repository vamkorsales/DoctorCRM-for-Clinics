import React, { useState } from 'react';
import ClinicProfileSettings from './ClinicProfileSettings';
import TaxationSettings from './TaxationSettings';
import BankingSettings from './BankingSettings';
import DataManagementSettings from './DataManagementSettings';
import InvoiceSettings from './InvoiceSettings';
import PrescriptionSettings from './PrescriptionSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import IntegrationSettings from './IntegrationSettings';
import SystemSettings from './SystemSettings';

type SettingsSection = 
  | 'clinic-profile' 
  | 'taxation' 
  | 'banking' 
  | 'data-management' 
  | 'invoices' 
  | 'prescriptions' 
  | 'notifications' 
  | 'security' 
  | 'integrations' 
  | 'system';

const SettingsManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('clinic-profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'clinic-profile':
        return <ClinicProfileSettings />;
      case 'taxation':
        return <TaxationSettings />;
      case 'banking':
        return <BankingSettings />;
      case 'data-management':
        return <DataManagementSettings />;
      case 'invoices':
        return <InvoiceSettings />;
      case 'prescriptions':
        return <PrescriptionSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'system':
        return <SystemSettings />;
      default:
        return <ClinicProfileSettings />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Settings Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          <nav className="space-y-1">
            {[
              { id: 'clinic-profile', label: 'Clinic Profile', description: 'Basic clinic information' },
              { id: 'taxation', label: 'Taxation', description: 'Tax settings and rates' },
              { id: 'banking', label: 'Banking', description: 'Payment and banking details' },
              { id: 'data-management', label: 'Data Management', description: 'Backup and retention policies' },
              { id: 'invoices', label: 'Invoice Settings', description: 'Invoice templates and automation' },
              { id: 'prescriptions', label: 'Prescriptions', description: 'Prescription templates and validation' },
              { id: 'notifications', label: 'Notifications', description: 'Email, SMS, and alerts' },
              { id: 'security', label: 'Security', description: 'Authentication and compliance' },
              { id: 'integrations', label: 'Integrations', description: 'Third-party connections' },
              { id: 'system', label: 'System', description: 'General system settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SettingsSection)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs mt-1 ${
                  activeSection === item.id ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsManagement;