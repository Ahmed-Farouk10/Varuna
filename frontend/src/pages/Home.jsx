import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WeatherSection from '../components/WeatherSection';
import IrrigationLogs from '../components/IrrigationLogs';
import SoilMoistureChart from '../components/SoilMoistureChart';
import ChatInterface from '../components/ChatInterface';
import PetalParticles from '../components/PetalParticles';

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
  const [fieldId, setFieldId] = useState(localStorage.getItem('fieldId') || 'field_001');
  const [location, setLocation] = useState(localStorage.getItem('location') || '');
  const [showConfig, setShowConfig] = useState(!localStorage.getItem('location'));

  // Save to localStorage when changed
  useEffect(() => {
    if (fieldId) localStorage.setItem('fieldId', fieldId);
  }, [fieldId]);

  useEffect(() => {
    if (location) localStorage.setItem('location', location);
  }, [location]);

  // Fetch data for Quick Stats and System Status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!location) {
          setLoading(false);
          return;
        }

        // Fetch weather data
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const weatherResponse = await fetch(`${API_URL}/api/weather/${location}`);
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
        const weatherData = await weatherResponse.json();
        
        // Fetch soil data
        const soilResponse = await fetch(`${API_URL}/api/soil/${fieldId}`);
        if (!soilResponse.ok) throw new Error('Failed to fetch soil data');
        const soilData = await soilResponse.json();

        const latestSoil = soilData[0] || { moisture: 42, temperature: 20, ph: 6.5 };

        // Mock power usage
        const powerUsage = 2.4;

        // Update Quick Stats
        setStats({
          humidity: weatherData.current?.humidity || 65,
          temperature: weatherData.current?.temp_c || 24,
          soilMoisture: latestSoil?.moisture || 42,
          powerUsage: powerUsage,
        });

        // Mock system status
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
      <PetalParticles />
      <div className="w-full space-y-4 sm:space-y-6 animate-fadeIn relative z-10">
        {/* Welcome Header - Spline Purple Theme */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-4 sm:p-6 border-2 border-purple-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-cool drop-shadow-lg">Welcome to Varuna</h1>
              <p className="mt-1 sm:mt-2 text-gray-700 text-sm sm:text-base lg:text-lg font-medium">Smart Irrigation Dashboard</p>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-5 py-2.5 bg-[#A49FFF] text-white rounded-lg hover:bg-[#B8E6D8] hover:text-black transition-all duration-300 font-semibold text-sm sm:text-base whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {showConfig ? 'Hide Config' : '⚙️ Configure'}
            </button>
          </div>
        </div>

        {/* Configuration Panel - Spline Theme */}
        {showConfig && (
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 sm:p-6 border-2 border-purple-200/50 animate-slideDown shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 font-cool">📍 Configure Your Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field ID
                </label>
                <input
                  type="text"
                  value={fieldId}
                  onChange={(e) => setFieldId(e.target.value)}
                  placeholder="e.g., field_001"
                  className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A49FFF] focus:border-[#A49FFF] bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Location (City Name)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Cairo, New York, Tokyo"
                  className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A49FFF] focus:border-[#A49FFF] bg-white text-gray-900"
                />
                <p className="mt-2 text-xs text-gray-500">Enter your city name for accurate weather data</p>
              </div>
            </div>
            {location && (
              <div className="mt-4 p-3 bg-gradient-to-r from-[#7AD7B1]/20 to-[#4CAB5B]/20 text-gray-800 rounded-lg text-sm border-2 border-[#7AD7B1]/50 shadow-sm animate-scaleIn">
                ✓ Using location: <strong className="text-gray-900">{location}</strong> | Field: <strong className="text-gray-900">{fieldId}</strong>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Quick Stats Grid - Purple Shaded with Dark Text */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scaleIn border-2 border-purple-300/50 relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#A49FFF]/20 to-transparent"></div>
            {/* Decorative diamond pattern */}
            <div className="absolute top-2 right-2 w-12 h-12 opacity-20">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-600">
                <path d="M12 2L15 9L22 10L15 15L12 22L9 15L2 10L9 9L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg ring-2 ring-purple-300/50">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-gray-800 text-xs sm:text-sm font-bold mb-1">Humidity</p>
                <p className="text-gray-900 text-2xl sm:text-4xl font-extrabold">
                  {loading ? '...' : `${stats.humidity}%`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scaleIn border-2 border-purple-300/50 relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#A49FFF]/20 to-transparent"></div>
            {/* Decorative diamond pattern */}
            <div className="absolute top-2 right-2 w-12 h-12 opacity-20">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-600">
                <path d="M12 2L15 9L22 10L15 15L12 22L9 15L2 10L9 9L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg ring-2 ring-purple-300/50">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-gray-800 text-xs sm:text-sm font-bold mb-1">Temperature</p>
                <p className="text-gray-900 text-2xl sm:text-4xl font-extrabold">
                  {loading ? '...' : `${stats.temperature}°C`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scaleIn border-2 border-purple-300/50 relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#A49FFF]/20 to-transparent"></div>
            {/* Decorative diamond pattern */}
            <div className="absolute top-2 right-2 w-12 h-12 opacity-20">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-600">
                <path d="M12 2L15 9L22 10L15 15L12 22L9 15L2 10L9 9L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg ring-2 ring-purple-300/50">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-gray-800 text-xs sm:text-sm font-bold mb-1">Soil Moisture</p>
                <p className="text-gray-900 text-2xl sm:text-4xl font-extrabold">
                  {loading ? '...' : `${stats.soilMoisture}%`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scaleIn border-2 border-purple-300/50 relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#A49FFF]/20 to-transparent"></div>
            {/* Decorative diamond pattern */}
            <div className="absolute top-2 right-2 w-12 h-12 opacity-20">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-600">
                <path d="M12 2L15 9L22 10L15 15L12 22L9 15L2 10L9 9L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg ring-2 ring-purple-300/50">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-gray-800 text-xs sm:text-sm font-bold mb-1">Power Usage</p>
                <p className="text-gray-900 text-2xl sm:text-4xl font-extrabold">
                  {loading ? '...' : `${stats.powerUsage} kW`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Spline White Theme */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 sm:p-6 border-2 border-purple-200/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              <WeatherSection location={location} />
            </div>
            
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 sm:p-6 border-2 border-purple-200/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <SoilMoistureChart fieldId={fieldId} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 sm:p-6 border-2 border-purple-200/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeIn" style={{ animationDelay: '0.7s' }}>
              <IrrigationLogs fieldId={fieldId} />
            </div>
            
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 sm:p-6 border-2 border-purple-200/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              <ChatInterface fieldId={fieldId} location={location} />
            </div>
          </div>
        </div>

        {/* System Status - Spline Theme */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 sm:p-6 border-2 border-purple-200/50 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 font-cool">System Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 p-4 bg-purple-50/80 backdrop-blur-sm rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
              <div className={`h-4 w-4 rounded-full ${systemStatus.pump.status === 'Running' ? 'bg-[#7AD7B1] animate-pulse shadow-lg' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Pump Status</p>
                <p className="text-xs text-gray-800 mt-0.5 font-medium">{systemStatus.pump.message}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50/80 backdrop-blur-sm rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
              <div className={`h-4 w-4 rounded-full ${systemStatus.sensor.status === 'Active' ? 'bg-[#7AD7B1] animate-pulse shadow-lg' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Sensor Network</p>
                <p className="text-xs text-gray-800 mt-0.5 font-medium">{systemStatus.sensor.message}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50/80 backdrop-blur-sm rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
              <div className={`h-4 w-4 rounded-full ${systemStatus.waterSupply.status === 'Optimal' ? 'bg-[#7AD7B1] animate-pulse shadow-lg' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Water Supply</p>
                <p className="text-xs text-gray-700 mt-0.5 font-medium">{systemStatus.waterSupply.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
