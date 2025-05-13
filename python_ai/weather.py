import requests
import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
from typing import Dict, Any

# Load environment variables
load_dotenv()

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv('WEATHER_API_KEY')
        self.base_url = "http://api.weatherapi.com/v1"
        self.client = MongoClient(os.getenv('MONGODB_URI'))
        self.db = self.client['irrigation_db']
        self.weather_collection = self.db['weather']

    def get_current_weather(self, location: str) -> Dict[str, Any]:
        """Fetch current weather data for a location"""
        try:
            response = requests.get(
                f"{self.base_url}/current.json",
                params={
                    "key": self.api_key,
                    "q": location,
                    "aqi": "no"
                }
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}

    def save_weather_data(self, city, weather_data):
        """
        Save weather data to MongoDB
        """
        try:
            weather_doc = {
                'city': city,
                'temperature': weather_data['current']['temp_c'],
                'humidity': weather_data['current']['humidity'],
                'precipitation': weather_data['current']['precip_mm'],
                'wind_speed': weather_data['current']['wind_kph'],
                'condition': weather_data['current']['condition']['text'],
                'uv_index': weather_data['current']['uv'],
                'timestamp': datetime.utcnow()
            }
            self.weather_collection.insert_one(weather_doc)
            return weather_doc
        except Exception as e:
            raise Exception(f"Error saving weather data: {str(e)}")

    def get_weather_history(self, city, limit=10):
        """
        Get historical weather data for a city
        """
        try:
            history = list(self.weather_collection.find(
                {'city': city},
                {'_id': 0}
            ).sort('timestamp', -1).limit(limit))
            return history
        except Exception as e:
            raise Exception(f"Error fetching weather history: {str(e)}")

    def get_irrigation_recommendation(self, city):
        """
        Get irrigation recommendation based on weather data
        """
        try:
            weather_data = self.get_current_weather(city)
            current = weather_data['current']
            
            # Basic irrigation logic (you can enhance this based on your needs)
            recommendation = {
                'should_irrigate': False,
                'reason': '',
                'weather_data': current
            }

            # Check precipitation
            if current['precip_mm'] > 0:
                recommendation['should_irrigate'] = False
                recommendation['reason'] = 'Rain detected, no irrigation needed'
            # Check humidity
            elif current['humidity'] > 80:
                recommendation['should_irrigate'] = False
                recommendation['reason'] = 'High humidity, no irrigation needed'
            # Check temperature
            elif current['temp_c'] > 30:
                recommendation['should_irrigate'] = True
                recommendation['reason'] = 'High temperature, irrigation recommended'
            # Default case
            else:
                recommendation['should_irrigate'] = True
                recommendation['reason'] = 'Normal conditions, irrigation recommended'

            return recommendation
        except Exception as e:
            raise Exception(f"Error getting irrigation recommendation: {str(e)}")

    def get_forecast(self, location: str, days: int = 3) -> Dict[str, Any]:
        """Fetch forecast data for a location"""
        try:
            response = requests.get(
                f"{self.base_url}/forecast.json",
                params={
                    "key": self.api_key,
                    "q": location,
                    "days": days,
                    "aqi": "no"
                }
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}

    def close(self):
        """
        Close MongoDB connection
        """
        self.client.close()

def get_weather_data() -> Dict[str, Any]:
    """Get current weather data for the default location"""
    weather_service = WeatherService()
    return weather_service.get_current_weather("London")

def get_soil_data() -> Dict[str, Any]:
    """Get soil data (simulated for now)"""
    return {
        "moisture": 25,  # Example: 25%
        "temperature": 20,  # Example: 20°C
        "ph": 6.5,  # Example: pH level
        "nutrients": {
            "nitrogen": "medium",
            "phosphorus": "high",
            "potassium": "medium"
        }
    }

def get_crop_data() -> Dict[str, Any]:
    """Get crop data (simulated for now)"""
    return {
        "type": "wheat",
        "growth_stage": "vegetative",
        "days_since_planting": 45,
        "health_status": "good",
        "water_requirement": "medium"
    } 