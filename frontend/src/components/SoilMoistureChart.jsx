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

// Mock data for 7-day soil moisture history
const mockSoilData = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - index)); // Generate dates for the past 7 days
  return {
    field_id: 'field_001',
    moisture: 30 + Math.random() * 5 - 2.5, // Randomize around 30% (±2.5%)
    temperature: 25,
    ph: 6.5,
    timestamp: date.toISOString()
  };
});

const SoilMoistureChart = () => {
  const [soilData, setSoilData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        setLoading(true);
        const fieldId = 'field_001';
        const response = await axios.get(`${API_URL}//soil/${fieldId}`);
        setSoilData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching soil data:', err);
        // Fallback to mock data on error
        setSoilData(mockSoilData);
        setError('Using mock soil data due to API failure');
        setLoading(false);
      }
    };

    fetchSoilData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!soilData.length) return (
    <div className="text-gray-500 text-center p-4">
      No soil moisture data available
    </div>
  );

  const chartData = {
    labels: soilData.map(data => new Date(data.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: soilData.map(data => data.moisture),
        borderColor: 'rgb(75, 192, 192)', // Changed to a teal color for better visibility
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Soil Moisture Trend</h2>
      {error && (
        <div className="text-yellow-600 text-center p-2 bg-yellow-100 rounded mb-4">
          {error}
        </div>
      )}
      <div className="h-64">
        <Line 
          data={chartData} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: '7-Day Soil Moisture History'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Moisture (%)'
                },
                suggestedMax: 50 // Set a reasonable max for soil moisture
              }
            }
          }} 
        />
      </div>
    </div>
  );
};

export default SoilMoistureChart;