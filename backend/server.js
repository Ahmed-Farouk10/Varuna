const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
// weather api key functionality
const axios = require('axios');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with options
const uri = process.env.MONGODB_URI || "mongodb+srv://ahmedayman10_:AHMEDKING2004ah@varuna.jhmrflr.mongodb.net/irrigation_db?retryWrites=true&w=majority&appName=Varuna";
mongoose.connect(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
})
.then(() => console.log("Successfully connected to MongoDB Atlas!"))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Define Weather Schema
const weatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    humidity: Number,
    precipitation: Number,
    timestamp: { type: Date, default: Date.now }
});

// Create Weather Model
const Weather = mongoose.model('Weather', weatherSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.get('/api/users', (req, res) => {
    // Placeholder for user data
    res.json({ users: [] });
});

// Weather API Routes
app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = req.params.city; // get the city from the url
        const response = await axios.get(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`
        );
        
        // Save weather data to MongoDB
        const weatherData = new Weather({
            city: city,
            temperature: response.data.current.temp_c,
            humidity: response.data.current.humidity,
            precipitation: response.data.current.precip_mm
        });
        
        await weatherData.save();
        
        res.json(response.data);
    } catch (error) {
        console.error('Weather API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Get historical weather data
app.get('/api/weather/history/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const weatherHistory = await Weather.find({ city: city })
            .sort({ timestamp: -1 })
            .limit(10);
        res.json(weatherHistory);
    } catch (error) {
        console.error('Error fetching weather history:', error);
        res.status(500).json({ error: 'Failed to fetch weather history' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
