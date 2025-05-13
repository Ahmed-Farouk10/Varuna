import React from 'react';
import Layout from '../components/Layout';
import SoilMoistureChart from '../components/SoilMoistureChart';

const Analytics = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Water Usage</dt>
                    <dd className="text-lg font-semibold text-gray-900">2,450 L</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Efficiency</dt>
                    <dd className="text-lg font-semibold text-gray-900">92%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Uptime</dt>
                    <dd className="text-lg font-semibold text-gray-900">99.9%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Cost Savings</dt>
                    <dd className="text-lg font-semibold text-gray-900">$1,234</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">Soil Moisture Trends</h3>
            <SoilMoistureChart />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">Water Usage Analysis</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Water usage chart will be displayed here
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">Detailed Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Water Usage by Zone</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zone A</span>
                  <span className="font-medium">450L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zone B</span>
                  <span className="font-medium">380L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zone C</span>
                  <span className="font-medium">290L</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Irrigation Schedule</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Morning</span>
                  <span className="font-medium">6:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Afternoon</span>
                  <span className="font-medium">2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evening</span>
                  <span className="font-medium">8:00 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">System Health</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pump Status</span>
                  <span className="text-green-600 font-medium">Optimal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sensor Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Maintenance</span>
                  <span className="font-medium">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics; 