import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText,
  BarChart3,
  PieChart,
  Filter
} from 'lucide-react';
import { BillingReport } from '../../types/billing';
import { mockBillingReports } from '../../data/billingMockData';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

interface BillingReportsProps {
  onBack: () => void;
}

const BillingReports: React.FC<BillingReportsProps> = ({ onBack }) => {
  const [selectedReport, setSelectedReport] = useState<string>('revenue');
  const [dateRange, setDateRange] = useState({
    start: '2025-01-01',
    end: '2025-01-31'
  });

  const reportTypes = [
    { id: 'revenue', label: 'Revenue Report', icon: DollarSign, description: 'Total revenue and trends' },
    { id: 'outstanding', label: 'Outstanding Payments', icon: Calendar, description: 'Unpaid invoices and overdue amounts' },
    { id: 'payments', label: 'Payment Analysis', icon: TrendingUp, description: 'Payment methods and trends' },
    { id: 'insurance', label: 'Insurance Claims', icon: FileText, description: 'Insurance claim status and payments' },
    { id: 'doctor-earnings', label: 'Doctor Earnings', icon: Users, description: 'Revenue by doctor and service' },
    { id: 'service-analysis', label: 'Service Analysis', icon: BarChart3, description: 'Most popular services and pricing' }
  ];

  const generateReport = () => {
    console.log('Generating report:', selectedReport, dateRange);
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log('Exporting report as:', format);
  };

  // Mock data for demonstration
  const revenueData = {
    totalRevenue: 45250,
    paidRevenue: 38900,
    outstandingRevenue: 6350,
    monthlyTrend: [
      { month: 'Jan', revenue: 45250, target: 40000 },
      { month: 'Feb', revenue: 38900, target: 40000 },
      { month: 'Mar', revenue: 42100, target: 40000 },
      { month: 'Apr', revenue: 47800, target: 40000 }
    ]
  };

  const topServices = [
    { name: 'General Consultation', revenue: 15000, count: 100 },
    { name: 'Cardiology Consultation', revenue: 12500, count: 50 },
    { name: 'Blood Test Panel', revenue: 8400, count: 70 },
    { name: 'X-Ray Imaging', revenue: 5600, count: 70 }
  ];

  const paymentMethods = [
    { method: 'Credit Card', amount: 18500, percentage: 47.5 },
    { method: 'Insurance', amount: 12300, percentage: 31.6 },
    { method: 'Cash', amount: 5200, percentage: 13.4 },
    { method: 'Bank Transfer', amount: 2900, percentage: 7.5 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Billing</span>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Billing Reports</h1>
            <p className="text-gray-600 mt-1">Financial insights and analytics</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selection and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.totalRevenue)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.paidRevenue)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {((revenueData.paidRevenue / revenueData.totalRevenue) * 100).toFixed(1)}% collection rate
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.outstandingRevenue)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {((revenueData.outstandingRevenue / revenueData.totalRevenue) * 100).toFixed(1)}% pending
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Invoice</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(285)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Based on 159 invoices
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Actual</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-600">Target</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-4">
            {revenueData.monthlyTrend.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-2">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(data.revenue / 50000) * 200}px` }}
                  />
                  <div 
                    className="w-full bg-gray-300 rounded-t-lg"
                    style={{ height: `${(data.target / 50000) * 200}px` }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                <span className="text-xs font-medium text-gray-900">{formatCurrency(data.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.count} appointments</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(service.revenue / 15000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-gray-900">{method.method}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(method.amount)}</div>
                    <div className="text-sm text-gray-500">{method.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="47.5, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900">47.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {mockBillingReports.map((report) => (
              <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{report.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Generated {formatDate(report.generatedAt)}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingReports;