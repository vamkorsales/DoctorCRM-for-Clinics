import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calculator } from 'lucide-react';
import { Invoice, InvoiceItem, Service } from '../../types/billing';
import { mockServices } from '../../data/billingMockData';
import { mockPatients } from '../../data/patientMockData';
import { mockDoctors } from '../../data/doctorMockData';
import { formatCurrency } from '../../utils/formatUtils';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSave: (invoice: Partial<Invoice>) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: invoice?.patientId || '',
    doctorId: invoice?.doctorId || '',
    appointmentId: invoice?.appointmentId || '',
    issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    paymentTerms: invoice?.paymentTerms || 'Net 30',
    notes: invoice?.notes || '',
    items: invoice?.items || [] as InvoiceItem[]
  });

  const [newItem, setNewItem] = useState({
    serviceId: '',
    quantity: 1,
    unitPrice: 0,
    description: ''
  });

  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Calculate due date based on payment terms
    if (formData.issueDate && formData.paymentTerms) {
      const issueDate = new Date(formData.issueDate);
      let daysToAdd = 30; // Default
      
      if (formData.paymentTerms.includes('15')) daysToAdd = 15;
      else if (formData.paymentTerms.includes('30')) daysToAdd = 30;
      else if (formData.paymentTerms.includes('60')) daysToAdd = 60;
      
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + daysToAdd);
      
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issueDate, formData.paymentTerms]);

  useEffect(() => {
    // Calculate totals
    const newSubtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const newTaxAmount = newSubtotal * 0.085; // 8.5% tax
    const newTotalAmount = newSubtotal + newTaxAmount;
    
    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotalAmount(newTotalAmount);
  }, [formData.items]);

  const handleAddItem = () => {
    if (!newItem.serviceId) return;

    const service = mockServices.find(s => s.id === newItem.serviceId);
    if (!service) return;

    const item: InvoiceItem = {
      id: `ITEM-${Date.now()}`,
      serviceId: newItem.serviceId,
      serviceName: service.name,
      serviceType: service.type,
      description: newItem.description || service.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice || service.basePrice,
      totalPrice: newItem.quantity * (newItem.unitPrice || service.basePrice),
      category: service.category,
      providedDate: formData.issueDate
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    setNewItem({
      serviceId: '',
      quantity: 1,
      unitPrice: 0,
      description: ''
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleUpdateItem = (itemId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    if (service) {
      setNewItem(prev => ({
        ...prev,
        serviceId,
        unitPrice: service.basePrice,
        description: service.description
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      ...formData,
      id: invoice?.id || `INV-${Date.now()}`,
      invoiceNumber: invoice?.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      status: invoice?.status || 'draft',
      subtotal,
      discounts: [],
      taxes: [{
        id: 'TAX-001',
        name: 'Medical Services Tax',
        rate: 8.5,
        type: 'percentage' as const,
        appliedTo: 'subtotal' as const,
        isActive: true
      }],
      totalAmount,
      paidAmount: invoice?.paidAmount || 0,
      balanceAmount: totalAmount - (invoice?.paidAmount || 0),
      paymentHistory: invoice?.paymentHistory || [],
      remindersSent: invoice?.remindersSent || 0,
      createdAt: invoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: invoice?.createdBy || 'Current User',
      lastModifiedBy: 'Current User'
    };

    onSave(invoiceData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h3>
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Invoice Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                      <select
                        required
                        value={formData.patientId}
                        onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a patient</option>
                        {mockPatients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                      <select
                        required
                        value={formData.doctorId}
                        onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a doctor</option>
                        {mockDoctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.title} {doctor.firstName} {doctor.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.issueDate}
                        onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                      <select
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Due on Receipt">Due on Receipt</option>
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 60">Net 60</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes or payment instructions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column - Invoice Items */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h4>
                    
                    {/* Add New Item */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                          <select
                            value={newItem.serviceId}
                            onChange={(e) => handleServiceSelect(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select a service</option>
                            {mockServices.filter(s => s.isActive).map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name} - {formatCurrency(service.basePrice)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={newItem.quantity}
                              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newItem.unitPrice}
                              onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={handleAddItem}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                              <Plus className="h-4 w-4 mx-auto" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            placeholder="Custom description (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Existing Items */}
                    <div className="space-y-3">
                      {formData.items.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.serviceName}</h5>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                              <div className="px-2 py-1 text-sm font-medium text-gray-900 bg-gray-50 rounded">
                                {formatCurrency(item.totalPrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {formData.items.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No items added yet. Add services above to create the invoice.
                      </div>
                    )}
                  </div>

                  {/* Invoice Totals */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calculator className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">Invoice Totals</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (8.5%):</span>
                        <span className="font-medium">{formatCurrency(taxAmount)}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={formData.items.length === 0}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                {invoice ? 'Update Invoice' : 'Create Invoice'}
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

export default InvoiceForm;