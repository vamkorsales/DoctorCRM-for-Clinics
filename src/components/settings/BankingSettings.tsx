import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, CreditCard, Building, DollarSign, Shield } from 'lucide-react';
import { useCountryConfig } from '../../context/CountryConfigContext';
import { mockBankingDetails } from '../../data/settingsMockData';
import { BankingDetails, BankAccount, PaymentMethodConfig } from '../../types/settings';

const BankingSettings: React.FC = () => {
  const { config, loading, error } = useCountryConfig();
  const [settings, setSettings] = useState<BankingDetails>(mockBankingDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  useEffect(() => {
    if (config && config.system && config.system.general && config.system.general.currency) {
      setSettings((prev) => ({
        ...prev,
        primaryAccount: {
          ...prev.primaryAccount,
          currency: config.system && config.system.general && config.system.general.currency ? config.system.general.currency : prev.primaryAccount.currency
        },
        secondaryAccounts: prev.secondaryAccounts.map(acc => ({
          ...acc,
          currency: config.system && config.system.general && config.system.general.currency ? config.system.general.currency : acc.currency
        })),
      }));
    }
  }, [config]);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving banking settings:', settings);
    setIsLoading(false);
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowAccountForm(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setShowAccountForm(true);
  };

  const togglePaymentMethod = (methodId: string) => {
    setSettings({
      ...settings,
      paymentMethods: settings.paymentMethods.map(method =>
        method.id === methodId ? { ...method, isEnabled: !method.isEnabled } : method
      )
    });
  };

  if (loading) {
    return <div className="p-6">Loading country-specific banking settings...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Banking & Payment Settings</h1>
          <p className="text-gray-600 mt-1">Configure bank accounts and payment processing</p>
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
          {/* Primary Bank Account */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Primary Bank Account</h3>
              <button
                onClick={() => handleEditAccount(settings.primaryAccount)}
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{settings.primaryAccount.accountName}</h4>
                  <p className="text-blue-100">{settings.primaryAccount.bankName}</p>
                </div>
                <Building className="h-8 w-8 text-blue-200" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-100">Account Number:</span>
                  <span className="font-mono">{settings.primaryAccount.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Routing Number:</span>
                  <span className="font-mono">{settings.primaryAccount.routingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Account Type:</span>
                  <span className="capitalize">{settings.primaryAccount.accountType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Accounts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Secondary Accounts</h3>
              <button
                onClick={handleAddAccount}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Account</span>
              </button>
            </div>

            <div className="space-y-4">
              {settings.secondaryAccounts.map((account) => (
                <div key={account.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{account.accountName}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {account.bankName} • {account.accountNumber} • {account.accountType}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {settings.secondaryAccounts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No secondary accounts configured.
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>

            <div className="space-y-4">
              {settings.paymentMethods.map((method) => (
                <div key={method.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={method.isEnabled}
                          onChange={() => togglePaymentMethod(method.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {method.method.replace('-', ' ')}
                        </h4>
                        <div className="text-sm text-gray-600">
                          Processing Fee: {method.feeType === 'percentage' ? `${method.processingFee}%` : `$${method.processingFee}`}
                          {method.provider && ` • Provider: ${method.provider}`}
                        </div>
                      </div>
                    </div>

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reconciliation Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reconciliation Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoReconcile"
                  checked={settings.reconciliationSettings.autoReconcile}
                  onChange={(e) => setSettings({
                    ...settings,
                    reconciliationSettings: {
                      ...settings.reconciliationSettings,
                      autoReconcile: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoReconcile" className="text-sm font-medium text-gray-700">
                  Enable automatic reconciliation
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reconciliation Period</label>
                  <select
                    value={settings.reconciliationSettings.reconciliationPeriod}
                    onChange={(e) => setSettings({
                      ...settings,
                      reconciliationSettings: {
                        ...settings.reconciliationSettings,
                        reconciliationPeriod: e.target.value as any
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tolerance Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.reconciliationSettings.toleranceAmount}
                    onChange={(e) => setSettings({
                      ...settings,
                      reconciliationSettings: {
                        ...settings.reconciliationSettings,
                        toleranceAmount: parseFloat(e.target.value)
                      }
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
          {/* Auto Deposit */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto Deposit</h3>
            
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="autoDeposit"
                checked={settings.autoDeposit}
                onChange={(e) => setSettings({...settings, autoDeposit: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoDeposit" className="text-sm font-medium text-gray-700">
                Enable automatic deposits
              </label>
            </div>
            
            <p className="text-xs text-gray-500">
              Automatically deposit payments to your primary bank account
            </p>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-900">PCI DSS Compliant</div>
                  <div className="text-xs text-green-700">Payment data is encrypted</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-blue-900">SSL Encryption</div>
                  <div className="text-xs text-blue-700">All transactions are secure</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Methods:</span>
                <span className="font-medium text-gray-900">
                  {settings.paymentMethods.filter(m => m.isEnabled).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bank Accounts:</span>
                <span className="font-medium text-gray-900">
                  {1 + settings.secondaryAccounts.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Merchant Accounts:</span>
                <span className="font-medium text-gray-900">
                  {settings.merchantAccounts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Form Modal */}
      {showAccountForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAccountForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
                </h3>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      defaultValue={editingAccount?.bankName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                    <input
                      type="text"
                      defaultValue={editingAccount?.accountName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                      <input
                        type="text"
                        defaultValue={editingAccount?.accountNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number *</label>
                      <input
                        type="text"
                        defaultValue={editingAccount?.routingNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
                      <select
                        defaultValue={editingAccount?.accountType}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        defaultValue={editingAccount?.currency}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="accountActive"
                      defaultChecked={editingAccount?.isActive ?? true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="accountActive" className="ml-2 block text-sm text-gray-900">
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
                  {editingAccount ? 'Update' : 'Add'} Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAccountForm(false)}
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

export default BankingSettings;