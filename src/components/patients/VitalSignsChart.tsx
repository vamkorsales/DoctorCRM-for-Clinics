import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Plus } from 'lucide-react';
import { Patient, VitalSigns } from '../../types/patient';
import { formatDate } from '../../utils/dateUtils';

interface VitalSignsChartProps {
  patient: Patient;
}

const VitalSignsChart: React.FC<VitalSignsChartProps> = ({ patient }) => {
  const [selectedMetric, setSelectedMetric] = useState<'bloodPressure' | 'heartRate' | 'temperature' | 'weight' | 'bmi'>('bloodPressure');
  const [timeRange, setTimeRange] = useState<'1month' | '3months' | '6months' | '1year'>('3months');

  const getFilteredData = () => {
    const now = new Date();
    const monthsBack = {
      '1month': 1,
      '3months': 3,
      '6months': 6,
      '1year': 12
    }[timeRange];

    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
    
    return patient.vitalSigns
      .filter(vital => new Date(vital.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(vital => ({
        date: formatDate(vital.date),
        systolic: vital.bloodPressure.systolic,
        diastolic: vital.bloodPressure.diastolic,
        heartRate: vital.heartRate,
        temperature: vital.temperature,
        weight: vital.weight,
        bmi: vital.bmi,
        fullDate: vital.date
      }));
  };

  const chartData = getFilteredData();

  const getChartConfig = () => {
    switch (selectedMetric) {
      case 'bloodPressure':
        return {
          lines: [
            { dataKey: 'systolic', stroke: '#ef4444', name: 'Systolic' },
            { dataKey: 'diastolic', stroke: '#3b82f6', name: 'Diastolic' }
          ],
          yAxisLabel: 'mmHg'
        };
      case 'heartRate':
        return {
          lines: [{ dataKey: 'heartRate', stroke: '#10b981', name: 'Heart Rate' }],
          yAxisLabel: 'BPM'
        };
      case 'temperature':
        return {
          lines: [{ dataKey: 'temperature', stroke: '#f59e0b', name: 'Temperature' }],
          yAxisLabel: '°F'
        };
      case 'weight':
        return {
          lines: [{ dataKey: 'weight', stroke: '#8b5cf6', name: 'Weight' }],
          yAxisLabel: 'lbs'
        };
      case 'bmi':
        return {
          lines: [{ dataKey: 'bmi', stroke: '#06b6d4', name: 'BMI' }],
          yAxisLabel: 'BMI'
        };
    }
  };

  const chartConfig = getChartConfig();

  const getLatestReading = () => {
    if (patient.vitalSigns.length === 0) return null;
    return patient.vitalSigns[patient.vitalSigns.length - 1];
  };

  const latestReading = getLatestReading();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bloodPressure">Blood Pressure</option>
              <option value="heartRate">Heart Rate</option>
              <option value="temperature">Temperature</option>
              <option value="weight">Weight</option>
              <option value="bmi">BMI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="h-4 w-4" />
          <span>Add Reading</span>
        </button>
      </div>

      {/* Latest Reading Summary */}
      {latestReading && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Latest Reading</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Blood Pressure</p>
              <p className="text-lg font-semibold text-gray-900">
                {latestReading.bloodPressure.systolic}/{latestReading.bloodPressure.diastolic}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Heart Rate</p>
              <p className="text-lg font-semibold text-gray-900">{latestReading.heartRate} bpm</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Temperature</p>
              <p className="text-lg font-semibold text-gray-900">
                {latestReading.temperature}°{latestReading.temperatureUnit === 'celsius' ? 'C' : 'F'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Weight</p>
              <p className="text-lg font-semibold text-gray-900">
                {latestReading.weight} {latestReading.weightUnit}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">BMI</p>
              <p className="text-lg font-semibold text-gray-900">{latestReading.bmi}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Recorded</p>
              <p className="text-sm text-gray-600">{formatDate(latestReading.date)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedMetric === 'bloodPressure' ? 'Blood Pressure' :
             selectedMetric === 'heartRate' ? 'Heart Rate' :
             selectedMetric === 'temperature' ? 'Temperature' :
             selectedMetric === 'weight' ? 'Weight' : 'BMI'} Trends
          </h3>
        </div>

        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  label={{ value: chartConfig.yAxisLabel, angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value, name) => [value, name]}
                />
                <Legend />
                {chartConfig.lines.map((line, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.stroke}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={line.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
              <p className="text-gray-500 mb-4">
                No vital signs recorded for the selected time range.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Add First Reading
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Readings Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Readings</h3>
        </div>
        
        {patient.vitalSigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Pressure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heart Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BMI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recorded By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.vitalSigns.slice(-10).reverse().map((vital) => (
                  <tr key={vital.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(vital.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vital.heartRate} bpm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vital.temperature}°{vital.temperatureUnit === 'celsius' ? 'C' : 'F'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vital.weight} {vital.weightUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vital.bmi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vital.recordedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vital signs recorded</h3>
            <p className="text-gray-500 mb-4">Start tracking the patient's vital signs to monitor their health.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Add First Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VitalSignsChart;