import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Send, 
  DollarSign, 
  Calendar, 
  User, 
  FileText,
  CreditCard,
  Printer,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Invoice } from '../../types/billing';
import { mockPatients } from '../../data/patientMockData';
import { mockDoctors } from '../../data/doctorMockData';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onBack: () => void;
  onEdit: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'payments' | 'history'>('details');

  const patient = mockPatients.find(p => p.id === invoice.patientId);
  const doctor = mockDoctors.find(d => d.id === invoice.doctorId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSendInvoice = () => {
    console.log('Sending invoice:', invoice.id);
  };

  const handleRecordPayment = () => {
    console.log('Recording payment for invoice:', invoice.id);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    // Header
    doc.setFontSize(18);
    doc.text('Invoice', 14, 18);
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 28);
    doc.text(`Status: ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}`, 14, 36);
    doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, 14, 44);
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 14, 52);
    doc.text(`Payment Terms: ${invoice.paymentTerms}`, 14, 60);

    // Bill To
    doc.setFontSize(14);
    doc.text('Bill To:', 14, 72);
    doc.setFontSize(12);
    doc.text(`${patient?.firstName || ''} ${patient?.lastName || ''}`, 14, 80);
    doc.text(`${patient?.email || ''}`, 14, 86);
    doc.text(`${patient?.phone || ''}`, 14, 92);
    if (patient?.address) {
      doc.text(`${patient.address.street}`, 14, 98);
      doc.text(`${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`, 14, 104);
    }

    // Provider
    doc.setFontSize(14);
    doc.text('Provider:', 110, 72);
    doc.setFontSize(12);
    doc.text(`${doctor?.title || ''} ${doctor?.firstName || ''} ${doctor?.lastName || ''}`, 110, 80);
    doc.text(`${doctor?.specialization || ''}`, 110, 86);
    doc.text(`${doctor?.email || ''}`, 110, 92);
    doc.text(`${doctor?.phone || ''}`, 110, 98);

    // Items Table
    autoTable(doc, {
      startY: 112,
      head: [[
        'Service',
        'Description',
        'Quantity',
        'Unit Price',
        'Total'
      ]],
      body: invoice.items.map(item => [
        item.serviceName,
        item.description,
        item.quantity,
        formatCurrency(item.unitPrice),
        formatCurrency(item.totalPrice)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });

    // Amount Summary
    let summaryY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 130;
    doc.setFontSize(12);
    doc.text(`Subtotal: ${formatCurrency(invoice.subtotal)}`, 14, summaryY);
    doc.text(`Tax: ${invoice.taxes && invoice.taxes.length > 0 ? invoice.taxes.map(t => `${t.name} (${t.rate}%)`).join(', ') : 'N/A'}`, 14, summaryY + 8);
    doc.text(`Total: ${formatCurrency(invoice.totalAmount)}`, 14, summaryY + 16);
    doc.text(`Paid: ${formatCurrency(invoice.paidAmount)}`, 14, summaryY + 24);
    doc.text(`Balance: ${formatCurrency(invoice.balanceAmount)}`, 14, summaryY + 32);

    // Notes
    if (invoice.notes) {
      doc.setFontSize(11);
      doc.text('Notes:', 14, summaryY + 44);
      doc.setFontSize(10);
      doc.text(invoice.notes, 14, summaryY + 50);
    }

    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  const tabs = [
    { id: 'details', label: 'Invoice Details', icon: FileText },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'history', label: 'Activity History', icon: Calendar }
  ];

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
            <span>Back to Invoices</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSendInvoice}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Send className="h-4 w-4" />
              <span>Send Invoice</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Invoice Header Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoice.invoiceNumber}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Issue Date: {formatDate(invoice.issueDate)}</div>
              <div>Due Date: {formatDate(invoice.dueDate)}</div>
              <div>Payment Terms: {invoice.paymentTerms}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To</h3>
            <div className="space-y-2">
              <div className="font-medium text-gray-900">
                {patient?.firstName} {patient?.lastName}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{patient?.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{patient?.phone}</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5" />
                <div>
                  <div>{patient?.address.street}</div>
                  <div>{patient?.address.city}, {patient?.address.state} {patient?.address.zipCode}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Provider</h3>
            <div className="space-y-2">
              <div className="font-medium text-gray-900">
                {doctor?.title} {doctor?.firstName} {doctor?.lastName}
              </div>
              <div className="text-sm text-gray-600">{doctor?.specialization}</div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{doctor?.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{doctor?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(invoice.paidAmount)}</div>
            <div className="text-sm text-gray-600">Paid Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(invoice.balanceAmount)}</div>
            <div className="text-sm text-gray-600">Balance Due</div>
          </div>
          <div className="text-center">
            {invoice.balanceAmount > 0 && (
              <button
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Record Payment
              </button>
            )}
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
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* Invoice Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.serviceName}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{item.description}</div>
                          {item.providedBy && (
                            <div className="text-xs text-gray-500">Provided by: {item.providedBy}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  
                  {invoice.discounts.map((discount) => (
                    <div key={discount.id} className="flex justify-between text-green-600">
                      <span>{discount.name}:</span>
                      <span>-{discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}</span>
                    </div>
                  ))}
                  
                  {invoice.taxes.map((tax) => (
                    <div key={tax.id} className="flex justify-between">
                      <span className="text-gray-600">{tax.name} ({tax.rate}%):</span>
                      <span className="font-medium">{formatCurrency((invoice.subtotal * tax.rate) / 100)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
              <button
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Record Payment
              </button>
            </div>
            
            {invoice.paymentHistory.length > 0 ? (
              <div className="space-y-4">
                {invoice.paymentHistory.map((payment) => (
                  <div key={payment.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(payment.paymentDate)} • {payment.paymentMethod.replace('-', ' ')}
                        </div>
                        {payment.transactionId && (
                          <div className="text-xs text-gray-500">
                            Transaction ID: {payment.transactionId}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          by {payment.processedBy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments recorded</h3>
                <p className="text-gray-500">Payments will appear here once recorded.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Activity History</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Invoice Created</div>
                    <div className="text-sm text-gray-600">
                      Created by {invoice.createdBy} on {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              
              {invoice.remindersSent > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">Reminders Sent</div>
                      <div className="text-sm text-gray-600">
                        {invoice.remindersSent} reminder(s) sent
                        {invoice.lastReminderDate && ` • Last sent: ${formatDate(invoice.lastReminderDate)}`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;