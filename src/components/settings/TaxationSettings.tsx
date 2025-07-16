import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, Calculator, FileText } from 'lucide-react';
import { useCountryConfig } from '../../context/CountryConfigContext';
import { TaxationSettings as TaxationSettingsType, TaxType } from '../../types/settings';

const TaxationSettings: React.FC = () => {
  const { config, loading, error } = useCountryConfig();
  const [settings, setSettings] = useState<TaxationSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxType | null>(null);

  useEffect(() => {
    if (config && config.taxation) {
      setSettings({ ...config.taxation } as TaxationSettingsType);
    }
  }, [config]);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving taxation settings:', settings);
    setIsLoading(false);
  };

  const handleAddTax = () => {
    setEditingTax(null);
    setShowTaxForm(true);
  };

  const handleEditTax = (tax: TaxType) => {
    setEditingTax(tax);
    setShowTaxForm(true);
  };

  const handleDeleteTax = (taxId: string) => {
    if (window.confirm('Are you sure you want to delete this tax type?')) {
      setSettings({
        ...settings,
        taxTypes: settings.taxTypes.filter(tax => tax.id !== taxId)
      });
    }
  };

  if (loading || !settings) {
    return <div className="p-6">Loading country-specific taxation settings...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Taxation Settings</h1>
          <p className="text-gray-600 mt-1">Configure tax rates and compliance settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Tax Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Tax Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID *</label>
                <input
                  type="text"
                  value={settings.taxId}
                  onChange={(e) => setSettings({...settings, taxId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Name</label>
                <input
                  type="text"
                  value={settings.taxName}
                  onChange={(e) => setSettings({...settings, taxName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate (%)</label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={settings.defaultTaxRate}
                    onChange={(e) => setSettings({...settings, defaultTaxRate: parseFloat(e.target.value)})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Period</label>
                <select
                  value={settings.reportingPeriod}
                  onChange={(e) => setSettings({...settings, reportingPeriod: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tax Types */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tax Types</h3>
              <button
                onClick={handleAddTax}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Tax Type</span>
              </button>
            </div>

            <div className="space-y-4">
              {settings.taxTypes.map((tax) => (
                <div key={tax.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{tax.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tax.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tax.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {tax.rate}% • Applies to {tax.appliesTo} • {tax.type}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTax(tax)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTax(tax.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {settings.taxTypes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tax types configured. Add your first tax type to get started.
                </div>
              )}
            </div>
          </div>

          {/* Tax Authority Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Authority Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Authority Name</label>
                <input
                  type="text"
                  value={settings.taxAuthority.name}
                  onChange={(e) => setSettings({
                    ...settings,
                    taxAuthority: {...settings.taxAuthority, name: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  rows={3}
                  value={settings.taxAuthority.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    taxAuthority: {...settings.taxAuthority, address: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.taxAuthority.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      taxAuthority: {...settings.taxAuthority, phone: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={settings.taxAuthority.website}
                    onChange={(e) => setSettings({
                      ...settings,
                      taxAuthority: {...settings.taxAuthority, website: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Filing Deadlines */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing Deadlines</h3>
            
            <div className="space-y-4">
              {settings.reportingPeriod === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly</label>
                  <input
                    type="text"
                    value={settings.filingDeadlines.monthly || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      filingDeadlines: {...settings.filingDeadlines, monthly: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 15th of following month"
                  />
                </div>
              )}

              {(settings.reportingPeriod === 'quarterly' || settings.reportingPeriod === 'annually') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quarterly</label>
                  <input
                    type="text"
                    value={settings.filingDeadlines.quarterly || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      filingDeadlines: {...settings.filingDeadlines, quarterly: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 15th of month following quarter end"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annually</label>
                <input
                  type="text"
                  value={settings.filingDeadlines.annually || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    filingDeadlines: {...settings.filingDeadlines, annually: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., March 15th"
                />
              </div>
            </div>
          </div>

          {/* Tax Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Status</h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="taxActive"
                checked={settings.isActive}
                onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="taxActive" className="text-sm font-medium text-gray-700">
                Tax system is active
              </label>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              When disabled, no taxes will be applied to invoices
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900">Generate Tax Report</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Calculator className="h-5 w-5 text-green-600" />
                <span className="text-gray-900">Tax Calculator</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Form Modal */}
      {showTaxForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTaxForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingTax ? 'Edit Tax Type' : 'Add Tax Type'}
                </h3>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name *</label>
                    <input
                      type="text"
                      defaultValue={editingTax?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate *</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={editingTax?.rate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        defaultValue={editingTax?.type}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applies To *</label>
                    <select
                      defaultValue={editingTax?.appliesTo}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="services">Services Only</option>
                      <option value="products">Products Only</option>
                      <option value="all">All Items</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="taxTypeActive"
                      defaultChecked={editingTax?.isActive ?? true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="taxTypeActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </form>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingTax ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaxForm(false)}
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

export default TaxationSettings;