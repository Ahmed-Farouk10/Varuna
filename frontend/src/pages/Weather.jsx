import React from 'react';
import Layout from '../components/Layout';
import WeatherSection from '../components/WeatherSection';

const Weather = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <WeatherSection />
        </div>
        
        {/* Additional Weather Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">Weather Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">High UV Index</p>
                  <p className="text-sm text-yellow-700">Take necessary precautions for crop protection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">Weather History</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last 7 Days Average</span>
                <span className="font-semibold text-blue-900">23°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precipitation</span>
                <span className="font-semibold text-blue-900">45mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Humidity</span>
                <span className="font-semibold text-blue-900">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Weather; 