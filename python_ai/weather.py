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
        
        if not self.api_key:
            print("WARNING: WEATHER_API_KEY not found in environment variables!")
            print("Weather API features will not work without a valid API key.")
        
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            print("WARNING: MONGODB_URI not found in environment variables!")
            print("Database features will not work without a valid MongoDB connection.")
            self.client = None
            self.db = None
            self.weather_collection = None
        else:
            try:
                self.client = MongoClient(mongodb_uri)
                self.db = self.client['irrigation_db']
                self.weather_collection = self.db['weather']
            except Exception as e:
                print(f"WARNING: Failed to connect to MongoDB: {e}")
                self.client = None
                self.db = None
                self.weather_collection = None

    def get_current_weather(self, location: str) -> Dict[str, Any]:
        """Fetch current weather data for a location"""
        if not self.api_key:
            return {
                "error": "WEATHER_API_KEY not configured",
                "message": "Please set WEATHER_API_KEY in your .env file to fetch weather data."
            }
        
        try:
            response = requests.get(
                f"{self.base_url}/current.json",
                params={
                    "key": self.api_key,
                    "q": location,
                    "aqi": "no"
                },
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                return {
                    "error": "Invalid API key",
                    "message": "The Weather API key is invalid. Please check your WEATHER_API_KEY in .env file."
                }
            elif e.response.status_code == 400:
                return {
                    "error": "Invalid location",
                    "message": f"Could not find weather data for location: {location}"
                }
            else:
                return {
                    "error": f"HTTP {e.response.status_code}: {str(e)}",
                    "message": "Failed to fetch weather data from API."
                }
        except requests.exceptions.RequestException as e:
            return {
                "error": f"Request failed: {str(e)}",
                "message": "Failed to connect to weather API. Please check your internet connection."
            }
        except Exception as e:
            return {
                "error": str(e),
                "message": "An unexpected error occurred while fetching weather data."
            }

    def save_weather_data(self, city, weather_data):
        """
        Save weather data to MongoDB
        """
        if self.weather_collection is None:
            return None  # MongoDB not configured
        
        # Check if weather_data has an error
        if 'error' in weather_data:
            return None  # Don't save error responses
        
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
            print(f"Warning: Failed to save weather data to database: {e}")
            return None  # Don't raise exception, just log warning

    def get_weather_history(self, city, limit=10):
        """
        Get historical weather data for a city
        """
        if self.weather_collection is None:
            return []  # Return empty list if MongoDB not configured
        
        try:
            history = list(self.weather_collection.find(
                {'city': city},
                {'_id': 0}
            ).sort('timestamp', -1).limit(limit))
            return history
        except Exception as e:
            print(f"Warning: Failed to fetch weather history: {e}")
            return []  # Return empty list instead of raising exception

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
        if not self.api_key:
            return {
                "error": "WEATHER_API_KEY not configured",
                "message": "Please set WEATHER_API_KEY in your .env file to fetch weather forecast."
            }
        
        try:
            response = requests.get(
                f"{self.base_url}/forecast.json",
                params={
                    "key": self.api_key,
                    "q": location,
                    "days": days,
                    "aqi": "no"
                },
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                return {
                    "error": "Invalid API key",
                    "message": "The Weather API key is invalid. Please check your WEATHER_API_KEY in .env file."
                }
            elif e.response.status_code == 400:
                return {
                    "error": "Invalid location",
                    "message": f"Could not find weather forecast for location: {location}"
                }
            else:
                return {
                    "error": f"HTTP {e.response.status_code}: {str(e)}",
                    "message": "Failed to fetch weather forecast from API."
                }
        except requests.exceptions.RequestException as e:
            return {
                "error": f"Request failed: {str(e)}",
                "message": "Failed to connect to weather API. Please check your internet connection."
            }
        except Exception as e:
            return {
                "error": str(e),
                "message": "An unexpected error occurred while fetching weather forecast."
            }

    def close(self):
        """
        Close MongoDB connection
        """
        if self.client:
            try:
                self.client.close()
            except Exception as e:
                print(f"Warning: Error closing MongoDB connection: {e}")

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