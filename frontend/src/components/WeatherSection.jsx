import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const WeatherSection = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async (cityName) => {
      try {
        setLoading(true);
        const [currentResponse, forecastResponse] = await Promise.all([
          axios.get(`${API_URL}/api/weather/${cityName}`),
          axios.get(`${API_URL}/api/weather/forecast/${cityName}`)
        ]);
        setCurrentWeather(currentResponse.data);
        setForecast(forecastResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
        console.error('Error fetching weather data:', err);
      }
    };

    // Use browser geolocation
    if (navigator.geolocation) {
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
  }, []);

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
  
  if (!currentWeather || !forecast) return null;

  const forecastData = {
    labels: forecast.forecast.forecastday.map(day => day.date),
    datasets: [
      {
        label: 'Precipitation (mm)',
        data: forecast.forecast.forecastday.map(day => day.day.totalprecip_mm),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-900 font-cool">Weather Information</h2>
      <div className="mb-2 text-blue-900 font-cool text-lg">Location: {city}</div>
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">Current Weather</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-gray-600 font-cool">Temperature</p>
            <p className="text-3xl font-bold text-blue-900 font-cool">{currentWeather.current.temp_c}°C</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 font-cool">Humidity</p>
            <p className="text-3xl font-bold text-blue-900 font-cool">{currentWeather.current.humidity}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 font-cool">Precipitation</p>
            <p className="text-3xl font-bold text-blue-900 font-cool">{currentWeather.current.precip_mm}mm</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 font-cool">Condition</p>
            <p className="text-xl font-semibold text-blue-900 font-cool">{currentWeather.current.condition.text}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-blue-800 font-cool">3-Day Forecast</h3>
        <div className="h-64">
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