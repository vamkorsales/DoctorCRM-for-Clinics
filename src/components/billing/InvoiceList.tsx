import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  DollarSign, 
  Calendar,
  User,
  Download,
  Send,
  Eye,
  Edit,
  MoreVertical,
  Settings,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { Invoice, BillingSearchFilters } from '../../types/billing';
import { mockInvoices } from '../../data/billingMockData';
import { mockPatients } from '../../data/patientMockData';
import { mockDoctors } from '../../data/doctorMockData';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';

interface InvoiceListProps {
  onInvoiceSelect: (invoice: Invoice) => void;
  onCreateInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onViewChange: (view: 'services' | 'payments' | 'reports') => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  onInvoiceSelect,
  onCreateInvoice,
  onEditInvoice,
  onViewChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BillingSearchFilters>({});
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'patient' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const filteredInvoices = useMemo(() => {
    let filtered = mockInvoices.filter(invoice => {
      const patient = mockPatients.find(p => p.id === invoice.patientId);
      const doctor = mockDoctors.find(d => d.id === invoice.doctorId);
      
      const matchesSearch = !searchTerm || 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${doctor?.firstName} ${doctor?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status?.length || filters.status.includes(invoice.status);
      const matchesDoctor = !filters.doctorId || invoice.doctorId === filters.doctorId;
      const matchesPatient = !filters.patientId || invoice.patientId === filters.patientId;

      let matchesDateRange = true;
      if (filters.dateRange) {
        const invoiceDate = new Date(invoice.issueDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        matchesDateRange = invoiceDate >= startDate && invoiceDate <= endDate;
      }

      let matchesAmountRange = true;
      if (filters.amountRange) {
        matchesAmountRange = invoice.totalAmount >= filters.amountRange.min && 
                           invoice.totalAmount <= filters.amountRange.max;
      }

      return matchesSearch && matchesStatus && matchesDoctor && matchesPatient && 
             matchesDateRange && matchesAmountRange;
    });

    // Sort invoices
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'patient':
          const patientA = mockPatients.find(p => p.id === a.patientId);
          const patientB = mockPatients.find(p => p.id === b.patientId);
          comparison = `${patientA?.firstName} ${patientA?.lastName}`.localeCompare(`${patientB?.firstName} ${patientB?.lastName}`);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mockInvoices, searchTerm, filters, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-600" />;
      case 'overdue': return <Calendar className="h-4 w-4 text-red-600" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };

  const handleBulkAction = (action: 'send' | 'delete' | 'export') => {
    console.log(`Bulk ${action} for invoices:`, selectedInvoices);
    setSelectedInvoices([]);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidRevenue = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const outstandingRevenue = filteredInvoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').reduce((sum, inv) => sum + inv.balanceAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-600 mt-1">Manage patient invoices and billing</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onViewChange('reports')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => onViewChange('payments')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </button>
          <button
            onClick={() => onViewChange('services')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Settings className="h-4 w-4" />
            <span>Services</span>
          </button>
          <button
            onClick={onCreateInvoice}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(paidRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(outstandingRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices by number, patient, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 border rounded-lg transition-colors duration-200 ${
              showFilters ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'date' | 'amount' | 'patient' | 'status');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="patient-asc">Patient A-Z</option>
            <option value="status-asc">Status</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  multiple
                  value={filters.status || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({...filters, status: values});
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <select
                  value={filters.doctorId || ''}
                  onChange={(e) => setFilters({...filters, doctorId: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Doctors</option>
                  {mockDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.title} {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        ...filters.dateRange,
                        start: e.target.value,
                        end: filters.dateRange?.end || ''
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        start: filters.dateRange?.start || '',
                        end: e.target.value
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.amountRange?.min || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      amountRange: {
                        ...filters.amountRange,
                        min: parseFloat(e.target.value) || 0,
                        max: filters.amountRange?.max || 10000
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.amountRange?.max || ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      amountRange: {
                        min: filters.amountRange?.min || 0,
                        max: parseFloat(e.target.value) || 10000
                      }
                    })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedInvoices.length} invoice(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('send')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Send
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                >
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating your first invoice.'}
            </p>
            <button
              onClick={onCreateInvoice}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Create First Invoice
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Table Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1 grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                  <div>Invoice</div>
                  <div>Patient</div>
                  <div>Doctor</div>
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="w-20 text-sm font-medium text-gray-700">Actions</div>
              </div>
            </div>

            {/* Invoice Rows */}
            {filteredInvoices.map((invoice) => {
              const patient = mockPatients.find(p => p.id === invoice.patientId);
              const doctor = mockDoctors.find(d => d.id === invoice.doctorId);
              
              return (
                <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-8">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex-1 grid grid-cols-6 gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">Due: {formatDate(invoice.dueDate)}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">
                          {patient?.firstName} {patient?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{patient?.email}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">
                          {doctor?.title} {doctor?.firstName} {doctor?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{doctor?.specialization}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">{formatDate(invoice.issueDate)}</div>
                        <div className="text-sm text-gray-500">{invoice.paymentTerms}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</div>
                        {invoice.balanceAmount > 0 && (
                          <div className="text-sm text-red-600">
                            Balance: {formatCurrency(invoice.balanceAmount)}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-20 flex items-center space-x-1">
                      <button
                        onClick={() => onInvoiceSelect(invoice)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditInvoice(invoice)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Summary */}
        {filteredInvoices.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {filteredInvoices.length} of {mockInvoices.length} invoices
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;