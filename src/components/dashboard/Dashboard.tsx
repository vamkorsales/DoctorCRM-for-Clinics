import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Dashboard: React.FC = () => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [patientSatisfaction, setPatientSatisfaction] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
  const [ageGroups, setAgeGroups] = useState<any[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*');
      if (appointmentsError) console.error('Error fetching appointments:', appointmentsError);

      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*');
      if (patientsError) console.error('Error fetching patients:', patientsError);

      if (appointments) {
        setTotalAppointments(appointments.length);
        const today = new Date().toDateString();
        setTodayAppointments(appointments.filter(apt => new Date(apt.date).toDateString() === today).length);

        // Calculate patient satisfaction (assuming a satisfaction_score column)
        const totalSatisfaction = appointments.reduce((acc, apt) => acc + (apt.satisfaction_score || 0), 0);
        setPatientSatisfaction(appointments.length > 0 ? Math.round((totalSatisfaction / appointments.length) * 10) / 10 : 0);

        // Calculate revenue (assuming a price column)
        const totalRevenue = appointments.reduce((acc, apt) => acc + (apt.price || 0), 0);
        setRevenue(totalRevenue);

        // Process monthly data
        const monthly: { [key: string]: number } = {};
        appointments.forEach(apt => {
          const month = new Date(apt.date).toLocaleString('default', { month: 'short' });
          if (monthly[month]) {
            monthly[month]++;
          } else {
            monthly[month] = 1;
          }
        });
        setMonthlyData(Object.keys(monthly).map(m => ({ month: m, value: monthly[m] })));

        // Process appointment types
        const types: { [key: string]: number } = {};
        appointments.forEach(apt => {
          const type = apt.type || 'General';
          if (types[type]) {
            types[type]++;
          } else {
            types[type] = 1;
          }
        });
        setAppointmentTypes(Object.keys(types).map(t => ({ name: t, value: types[t], color: 'bg-blue-500' })));
      }

      if (patients) {
        setTotalPatients(patients.length);

        // Process age groups
        const ages: { [key: string]: number } = {
          '0-18': 0,
          '19-35': 0,
          '36-55': 0,
          '56+': 0
        };
        patients.forEach(p => {
          const age = new Date().getFullYear() - new Date(p.date_of_birth).getFullYear();
          if (age <= 18) ages['0-18']++;
          else if (age <= 35) ages['19-35']++;
          else if (age <= 55) ages['36-55']++;
          else ages['56+']++;
        });
        setAgeGroups(Object.keys(ages).map(ag => ({ name: ag, value: (ages[ag] / patients.length) * 100, color: 'bg-blue-600' })));
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      name: 'Total Appointments',
      value: totalAppointments.toLocaleString(),
      change: '+10%', // Placeholder
      changeType: 'increase' as const,
      color: 'bg-blue-50'
    },
    {
      name: 'Patient Satisfaction',
      value: `${patientSatisfaction}%`,
      change: '-5%', // Placeholder
      changeType: 'decrease' as const,
      color: 'bg-purple-50'
    },
    {
      name: 'Revenue',
      value: `$${revenue.toLocaleString()}`,
      change: '+15%', // Placeholder
      changeType: 'increase' as const,
      color: 'bg-green-50'
    }
  ];

  const maxValue = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.value)) : 0;

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
              <span className="text-3xl font-semibold text-gray-900">{totalAppointments}</span>
              <span className="text-sm text-gray-600">Last 12 Months</span>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600 ml-1">+10%</span>
              </div>
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between space-x-2">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${maxValue > 0 ? (data.value / maxValue) * 100 : 0}%` }}
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
              <span className="text-3xl font-semibold text-gray-900">{totalAppointments}</span>
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
                      style={{ width: `${(type.value / totalAppointments) * 100}%` }}
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
            <span className="text-3xl font-semibold text-gray-900">{totalPatients}</span>
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
                    style={{ width: `${group.value}%` }}
                  />
                </div>
              </div>
              <div className="w-8 text-sm text-gray-600 text-right">{group.value.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;