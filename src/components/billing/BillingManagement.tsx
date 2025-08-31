import React, { useState } from 'react';
import { Invoice, Service, BillingReport } from '../../types/billing';
import InvoiceList from './InvoiceList';
import InvoiceDetails from './InvoiceDetails';
import InvoiceForm from './InvoiceForm';
import ServiceManagement from './ServiceManagement';
import PaymentProcessing from './PaymentProcessing';
import BillingReports from './BillingReports';
import { supabase } from '../../supabaseClient';

type ViewType = 'invoices' | 'invoice-details' | 'invoice-form' | 'services' | 'payments' | 'reports';

const BillingManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('invoice-details');
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setCurrentView('invoice-form');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('invoice-form');
  };

  const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      if (editingInvoice) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editingInvoice.id);

        if (error) {
          throw error;
        }
        console.log('Invoice updated successfully');
      } else {
        // Create new invoice
        const { error } = await supabase
          .from('invoices')
          .insert([invoiceData]);

        if (error) {
          throw error;
        }
        console.log('Invoice created successfully');
      }

      setCurrentView('invoices');
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleBack = () => {
    setCurrentView('invoices');
    setSelectedInvoice(null);
    setEditingInvoice(null);
  };

  const handleCancel = () => {
    setCurrentView('invoices');
    setEditingInvoice(null);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSelectedInvoice(null);
    setEditingInvoice(null);
  };

  return (
    <div className="space-y-6">
      {currentView === 'invoices' && (
        <InvoiceList
          onInvoiceSelect={handleInvoiceSelect}
          onCreateInvoice={handleCreateInvoice}
          onEditInvoice={handleEditInvoice}
          onViewChange={handleViewChange}
        />
      )}

      {currentView === 'invoice-details' && selectedInvoice && (
        <InvoiceDetails
          invoice={selectedInvoice}
          onBack={handleBack}
          onEdit={() => handleEditInvoice(selectedInvoice)}
        />
      )}

      {currentView === 'invoice-form' && (
        <InvoiceForm
          invoice={editingInvoice || undefined}
          onSave={handleSaveInvoice}
          onCancel={handleCancel}
        />
      )}

      {currentView === 'services' && (
        <ServiceManagement onBack={handleBack} />
      )}

      {currentView === 'payments' && (
        <PaymentProcessing onBack={handleBack} />
      )}

      {currentView === 'reports' && (
        <BillingReports onBack={handleBack} />
      )}
    </div>
  );
};

export default BillingManagement;