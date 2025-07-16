import React, { useState } from 'react';
import { Save, Link, CheckCircle, XCircle, Settings, Plus } from 'lucide-react';

const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Electronic Health Records (EHR)', provider: 'Epic', status: 'connected', lastSync: '2024-01-15 10:30' },
    { id: 2, name: 'Payment Gateway', provider: 'Stripe', status: 'connected', lastSync: '2024-01-15 09:45' },
    { id: 3, name: 'Laboratory System', provider: 'LabCorp', status: 'disconnected', lastSync: 'Never' },
    { id: 4, name: 'Pharmacy Network', provider: 'CVS Health', status: 'pending', lastSync: 'Never' }
  ]);

  const handleSave = () => {
    console.log('Integration settings saved');
  };

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, status: integration.status === 'connected' ? 'disconnected' : 'connected' }
        : integration
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Settings className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'disconnected':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Integration Settings</h1>
        <p className="text-gray-600">Manage third-party connections and data synchronization</p>
      </div>

      <div className="space-y-8">
        {/* Active Integrations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Active Integrations</h2>
            </div>
            <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              Add Integration
            </button>
          </div>

          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-600">Provider: {integration.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </span>
                    <button
                      onClick={() => toggleIntegration(integration.id)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Last sync: {integration.lastSync}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Synchronization Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-sync Frequency
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="real-time">Real-time</option>
                <option value="15-minutes">Every 15 minutes</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="manual">Manual only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Time Window
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="24-7">24/7</option>
                <option value="business-hours">Business hours only</option>
                <option value="off-hours">Off-hours only</option>
                <option value="custom">Custom schedule</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable automatic conflict resolution</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Log all synchronization activities</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Send notifications on sync failures</span>
            </label>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Webhook Endpoints</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-mono">https://api.clinic.com/webhooks/appointments</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-mono">https://api.clinic.com/webhooks/payments</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Rate Limit
                </label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Requests per hour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout Duration (seconds)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Mapping */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Mapping</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
              <div>Local Field</div>
              <div>External Field</div>
              <div>Mapping Status</div>
            </div>

            {[
              { local: 'patient_id', external: 'patient.id', status: 'mapped' },
              { local: 'appointment_date', external: 'appointment.datetime', status: 'mapped' },
              { local: 'doctor_name', external: 'provider.full_name', status: 'mapped' },
              { local: 'insurance_info', external: 'insurance.details', status: 'unmapped' }
            ].map((mapping, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 py-2 text-sm border-b border-gray-100">
                <div className="font-mono text-gray-900">{mapping.local}</div>
                <div className="font-mono text-gray-600">{mapping.external}</div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mapping.status === 'mapped' 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {mapping.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;