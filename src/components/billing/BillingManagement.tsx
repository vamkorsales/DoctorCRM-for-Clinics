import React, { useState } from 'react';
import { Invoice, Service, BillingReport } from '../../types/billing';
import InvoiceList from './InvoiceList';
import InvoiceDetails from './InvoiceDetails';
import InvoiceForm from './InvoiceForm';
import ServiceManagement from './ServiceManagement';
import PaymentProcessing from './PaymentProcessing';
import BillingReports from './BillingReports';

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

  const handleSaveInvoice = (invoiceData: Partial<Invoice>) => {
    // In a real app, this would save to the backend
    console.log('Saving invoice:', invoiceData);
    setCurrentView('invoices');
    setEditingInvoice(null);
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