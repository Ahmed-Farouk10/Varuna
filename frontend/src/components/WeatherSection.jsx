import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// API calls routed through InsForge edge functions

const WeatherSection = ({ location }) => {
  const [city, setCity] = useState(location || '');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async (cityName) => {
      try {
        setLoading(true);
        const [currentData, forecastData] = await Promise.all([
          api.getWeather(cityName),
          api.getForecast(cityName)
        ]);
        if (currentData?.error) throw new Error(currentData.error);
        if (forecastData?.error) throw new Error(forecastData.error);
        setCurrentWeather(currentData);
        setForecast(forecastData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
        console.error('Error fetching weather data:', err);
      }
    };

    // Use location prop if provided, otherwise try geolocation
    if (location) {
      setCity(location);
      fetchWeatherData(location);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode to city using OpenStreetMap Nominatim
        try {
          const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
              lat: latitude,
              lon: longitude,
              format: 'json'
            }
          });
          const cityName = geoRes.data.address.city || geoRes.data.address.town || geoRes.data.address.village || geoRes.data.address.state || 'London';
          setCity(cityName);
          fetchWeatherData(cityName);
        } catch (geoErr) {
          setCity('London');
          fetchWeatherData('London');
        }
      }, () => {
        setCity('London');
        fetchWeatherData('London');
      });
    } else {
      setCity('London');
      fetchWeatherData('London');
    }
  }, [location]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
    </div>
  );
  
  if (!currentWeather?.current || !forecast?.forecast?.forecastday) {
    console.warn('Weather data in unexpected format:', { currentWeather, forecast });
    return (
      <div className="text-yellow-600 text-center p-4">
        Weather data unavailable in expected format.
      </div>
    );
  }

  const forecastData = {
    labels: forecast.forecast.forecastday.map(day => day.date),
    datasets: [
      {
        label: 'Precipitation (mm)',
        data: forecast.forecast.forecastday.map(day => day?.day?.totalprecip_mm ?? 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 font-cool">🌤️ Weather Information</h2>
      {city && (
        <div className="mb-3 sm:mb-4 text-gray-800 text-xs sm:text-sm font-semibold">📍 {city}</div>
      )}
      <div className="mb-4 sm:mb-6 bg-gradient-to-br from-purple-50 to-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg border-2 border-purple-200">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 font-cool">Current Weather</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-gray-700 font-cool font-semibold text-xs sm:text-sm">Temperature</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-cool">{currentWeather.current.temp_c ?? '--'}°C</p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-gray-700 font-cool font-semibold text-xs sm:text-sm">Humidity</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-cool">{currentWeather.current.humidity ?? '--'}%</p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-gray-700 font-cool font-semibold text-xs sm:text-sm">Precipitation</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-cool">{currentWeather.current.precip_mm ?? '--'}mm</p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-gray-700 font-cool font-semibold text-xs sm:text-sm">Condition</p>
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 font-cool">{currentWeather.current.condition?.text ?? '--'}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 font-cool">3-Day Forecast</h3>
        <div className="h-40 sm:h-48 lg:h-64">
          <Line 
            data={forecastData} 
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Precipitation Forecast'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Precipitation (mm)'
                  }
                }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherSection; 