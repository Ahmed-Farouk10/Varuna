import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WeatherSection from '../components/WeatherSection';
import IrrigationLogs from '../components/IrrigationLogs';
import SoilMoistureChart from '../components/SoilMoistureChart';
import ChatInterface from '../components/ChatInterface';

const Home = () => {
  const [stats, setStats] = useState({
    humidity: null,
    temperature: null,
    soilMoisture: null,
    powerUsage: null,
  });
  const [systemStatus, setSystemStatus] = useState({
    pump: { status: 'Unknown', message: 'Loading...' },
    sensor: { status: 'Unknown', message: 'Loading...' },
    waterSupply: { status: 'Unknown', message: 'Loading...' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration
  const fieldId = 'field_001'; // Replace with dynamic value if needed
  const location = 'London'; // Replace with dynamic value if needed

  // Fetch data for Quick Stats and System Status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch weather data
        const weatherResponse = await fetch(`http://localhost:5001/api/weather/${location}`);
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
        const weatherData = await weatherResponse.json();
        
        // Fetch soil data
        const soilResponse = await fetch(`http://localhost:5001/api/soil/${fieldId}`);
        if (!soilResponse.ok) throw new Error('Failed to fetch soil data');
        const soilData = await soilResponse.json();
        const latestSoil = soilData[0]; // Get the most recent soil data

        // Mock power usage (replace with actual API if available)
        const powerUsage = 2.4; // Example value, replace with real data

        // Update Quick Stats
        setStats({
          humidity: weatherData.current?.humidity || 65, // Fallback to static if null
          temperature: weatherData.current?.temp_c || 24,
          soilMoisture: latestSoil?.moisture || 42,
          powerUsage: powerUsage,
        });

        // Mock system status (replace with actual API if available)
        setSystemStatus({
          pump: { status: 'Running', message: 'Running normally' },
          sensor: { status: 'Active', message: 'All sensors active' },
          waterSupply: { status: 'Optimal', message: 'Optimal pressure' },
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fieldId, location]);

  return (
    <Layout>
      <div className="relative">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 font-cool">Welcome to Varuna</h1>
          <p className="mt-2 text-gray-600">Smart Irrigation Dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-800 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Humidity</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loading ? 'Loading...' : `${stats.humidity}%`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Temperature</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loading ? 'Loading...' : `${stats.temperature}°C`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Soil Moisture</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loading ? 'Loading...' : `${stats.soilMoisture}%`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Power Usage</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loading ? 'Loading...' : `${stats.powerUsage} kW`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg

-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <WeatherSection location={location} />
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <SoilMoistureChart fieldId={fieldId} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <IrrigationLogs fieldId={fieldId} />
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <ChatInterface fieldId={fieldId} location={location} />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`h-3 w-3 rounded-full ${systemStatus.pump.status === 'Running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Pump Status</p>
                <p className="text-sm text-gray-500">{systemStatus.pump.message}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`h-3 w-3 rounded-full ${systemStatus.sensor.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sensor Network</p>
                <p className="text-sm text-gray-500">{systemStatus.sensor.message}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`h-3 w-3 rounded-full ${systemStatus.waterSupply.status === 'Optimal' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Water Supply</p>
                <p className="text-sm text-gray-500">{systemStatus.waterSupply.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;