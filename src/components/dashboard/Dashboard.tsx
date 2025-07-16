import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { mockPatients, mockAppointments } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const totalPatients = mockPatients.length;
  const todayAppointments = mockAppointments.filter(apt => 
    new Date(apt.date).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      name: 'Total Appointments',
      value: '1,250',
      change: '+10%',
      changeType: 'increase' as const,
      color: 'bg-blue-50'
    },
    {
      name: 'Patient Satisfaction',
      value: '92%',
      change: '-5%',
      changeType: 'decrease' as const,
      color: 'bg-purple-50'
    },
    {
      name: 'Revenue',
      value: '$150,000',
      change: '+15%',
      changeType: 'increase' as const,
      color: 'bg-green-50'
    }
  ];

  const appointmentTypes = [
    { name: 'Consultation', value: 120, color: 'bg-blue-500' },
    { name: 'Follow-up', value: 80, color: 'bg-purple-500' },
    { name: 'Emergency', value: 60, color: 'bg-red-500' },
    { name: 'Routine Checkup', value: 140, color: 'bg-green-500' }
  ];

  const ageGroups = [
    { name: '0-18', value: 15, color: 'bg-blue-600' },
    { name: '19-35', value: 45, color: 'bg-blue-500' },
    { name: '36-55', value: 30, color: 'bg-blue-400' },
    { name: '56+', value: 10, color: 'bg-blue-300' }
  ];

  const monthlyData = [
    { month: 'Jan', value: 180 },
    { month: 'Feb', value: 220 },
    { month: 'Mar', value: 190 },
    { month: 'Apr', value: 280 },
    { month: 'May', value: 240 },
    { month: 'Jun', value: 320 },
    { month: 'Jul', value: 290 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of key metrics and trends</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className={`${stat.color} rounded-2xl p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-3">
                  {stat.changeType === 'increase' ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Appointments Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Appointments</h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-semibold text-gray-900">1250</span>
              <span className="text-sm text-gray-600">Last 12 Months</span>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600 ml-1">+10%</span>
              </div>
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between space-x-2">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(data.value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Types Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Types</h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-semibold text-gray-900">300</span>
              <span className="text-sm text-gray-600">This Month</span>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600 ml-1">+5%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {appointmentTypes.map((type) => (
              <div key={type.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${type.color}`} />
                  <span className="text-sm font-medium text-gray-700">{type.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${type.color}`}
                      style={{ width: `${(type.value / 140) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{type.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Patient Demographics</h3>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-3xl font-semibold text-gray-900">500</span>
            <span className="text-sm text-gray-600">This Year</span>
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 ml-1">+2%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Patient Age Groups</h4>
          {ageGroups.map((group) => (
            <div key={group.name} className="flex items-center">
              <div className="w-12 text-sm text-gray-600">{group.name}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${group.color}`}
                    style={{ width: `${group.value * 2}%` }}
                  />
                </div>
              </div>
              <div className="w-8 text-sm text-gray-600 text-right">{group.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;