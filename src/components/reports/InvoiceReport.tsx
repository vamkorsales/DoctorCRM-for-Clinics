import React, { useState } from 'react';
import { InvoiceReportData } from '../../types/report';
import ReportTable from './ReportTable';

interface InvoiceReportProps {
  data: InvoiceReportData[];
}

type InvoiceKey = keyof InvoiceReportData;

const InvoiceReport: React.FC<InvoiceReportProps> = ({ data }) => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortKey, setSortKey] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filtered = data.filter(inv => !statusFilter || inv.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'date') {
      return sortOrder === 'asc'
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    } else {
      return sortOrder === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });

  const columns: { key: InvoiceKey; label: string }[] = [
    { key: 'invoiceId', label: 'Invoice ID' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
    { key: 'items', label: 'Items' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center space-x-4 mb-2">
        <label className="text-sm font-medium text-gray-700">Status:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <label className="text-sm font-medium text-gray-700 ml-4">Sort By:</label>
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as 'date' | 'amount')}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
        <button
          className="ml-2 px-2 py-1 border border-gray-300 rounded"
          onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
        >
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>
      <ReportTable
        columns={columns}
        data={sorted.map(inv => ({ ...inv, items: inv.items.join(', ') }))}
      />
    </div>
  );
};

export default InvoiceReport; 