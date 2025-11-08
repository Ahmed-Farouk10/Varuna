from typing import Dict, Any
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class IrrigationSystem:
    def __init__(self):
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            print("WARNING: MONGODB_URI not found in environment variables!")
            print("Database features will not work without a valid MongoDB connection.")
            self.mongo_client = None
            self.db = None
            self.irrigation_collection = None
            self.settings_collection = None
            self.soil_collection = None
            self.crop_collection = None
        else:
            try:
                self.mongo_client = MongoClient(mongodb_uri)
                self.db = self.mongo_client['irrigation_db']
                self.irrigation_collection = self.db['irrigation_logs']
                self.settings_collection = self.db['irrigation_settings']
                self.soil_collection = self.db['soil_data']
                self.crop_collection = self.db['crop_data']
            except Exception as e:
                print(f"WARNING: Failed to connect to MongoDB: {e}")
                self.mongo_client = None
                self.db = None
                self.irrigation_collection = None
                self.settings_collection = None
                self.soil_collection = None
                self.crop_collection = None

    def _convert_to_dict(self, doc):
        """
        Convert MongoDB document to JSON-serializable dictionary
        """
        if doc is None:
            return None
        if isinstance(doc, dict):
            return {k: self._convert_to_dict(v) for k, v in doc.items() if k != '_id'}
        if isinstance(doc, list):
            return [self._convert_to_dict(item) for item in doc]
        if isinstance(doc, ObjectId):
            return str(doc)
        if isinstance(doc, datetime):
            return doc.isoformat()
        return doc

    def get_soil_data(self, field_id: str) -> Dict[str, Any]:
        """
        Get soil data for a field
        """
        if self.soil_collection is None:
            # Return default soil data if MongoDB not configured
            return {
                'field_id': field_id,
                'moisture': 30.0,  # percentage
                'temperature': 20.0,  # celsius
                'ph': 6.5
            }
        
        try:
            soil_data = self.soil_collection.find_one({'field_id': field_id})
            if not soil_data:
                # Return default soil data if none exists
                soil_data = {
                    'field_id': field_id,
                    'moisture': 30.0,  # percentage
                    'temperature': 20.0,  # celsius
                    'ph': 6.5
                }
                try:
                    self.soil_collection.insert_one(soil_data)
                except Exception as insert_error:
                    print(f"Warning: Failed to insert soil data: {insert_error}")
            return self._convert_to_dict(soil_data)
        except Exception as e:
            print(f"Warning: Error getting soil data: {e}")
            return {
                'field_id': field_id,
                'moisture': 30.0,
                'temperature': 20.0,
                'ph': 6.5
            }

    def get_crop_data(self, field_id: str) -> Dict[str, Any]:
        """
        Get crop data for a field
        """
        if self.crop_collection is None:
            # Return default crop data if MongoDB not configured
            return {
                'field_id': field_id,
                'type': 'wheat',
                'growth_stage': 'vegetative',
                'health_status': 'good',
                'water_requirement': 5.0  # mm per day
            }
        
        try:
            crop_data = self.crop_collection.find_one({'field_id': field_id})
            if not crop_data:
                # Return default crop data if none exists
                crop_data = {
                    'field_id': field_id,
                    'type': 'wheat',
                    'growth_stage': 'vegetative',
                    'health_status': 'good',
                    'water_requirement': 5.0  # mm per day
                }
                try:
                    self.crop_collection.insert_one(crop_data)
                except Exception as insert_error:
                    print(f"Warning: Failed to insert crop data: {insert_error}")
            return self._convert_to_dict(crop_data)
        except Exception as e:
            print(f"Warning: Error getting crop data: {e}")
            return {
                'field_id': field_id,
                'type': 'wheat',
                'growth_stage': 'vegetative',
                'health_status': 'good',
                'water_requirement': 5.0
            }

    def calculate_water_requirement(self, weather_data: Dict[str, Any], soil_data: Dict[str, Any], crop_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate water requirements based on weather, soil, and crop data
        """
        try:
            # Extract relevant data
            temperature = weather_data['current']['temp_c']
            humidity = weather_data['current']['humidity']
            precipitation = weather_data['current']['precip_mm']
            soil_moisture = soil_data['moisture']
            crop_type = crop_data['type']
            growth_stage = crop_data['growth_stage']

            # Base water requirement (mm per day)
            base_requirement = {
                'wheat': 5.0,
                'corn': 7.0,
                'soybeans': 6.0,
                'rice': 8.0
            }.get(crop_type, 5.0)

            # Adjust for growth stage
            growth_multiplier = {
                'seedling': 0.5,
                'vegetative': 1.0,
                'flowering': 1.5,
                'fruiting': 1.2,
                'mature': 0.8
            }.get(growth_stage, 1.0)

            # Calculate temperature adjustment
            temp_adjustment = 1.0
            if temperature > 30:
                temp_adjustment = 1.3
            elif temperature < 10:
                temp_adjustment = 0.7

            # Calculate humidity adjustment
            humidity_adjustment = 1.0
            if humidity > 80:
                humidity_adjustment = 0.8
            elif humidity < 40:
                humidity_adjustment = 1.2

            # Calculate soil moisture adjustment
            moisture_adjustment = 1.0
            if soil_moisture < 20:
                moisture_adjustment = 1.5
            elif soil_moisture > 40:
                moisture_adjustment = 0.5

            # Calculate final water requirement
            water_requirement = (
                base_requirement *
                growth_multiplier *
                temp_adjustment *
                humidity_adjustment *
                moisture_adjustment
            )

            # Adjust for precipitation
            water_requirement = max(0, water_requirement - precipitation)

            return {
                'water_requirement': round(water_requirement, 2),
                'base_requirement': base_requirement,
                'adjustments': {
                    'growth_stage': growth_multiplier,
                    'temperature': temp_adjustment,
                    'humidity': humidity_adjustment,
                    'soil_moisture': moisture_adjustment,
                    'precipitation': precipitation
                }
            }
        except Exception as e:
            return {'error': str(e)}

    def make_irrigation_decision(self, field_id: str, water_requirement: float) -> Dict[str, Any]:
        """
        Make irrigation decision based on water requirement
        """
        try:
            # Get field settings
            if self.settings_collection is not None:
                field_settings = self.settings_collection.find_one({'field_id': field_id})
                if not field_settings:
                    field_settings = {
                        'field_id': field_id,
                        'irrigation_threshold': 2.0,  # mm
                        'max_duration': 30,  # minutes
                        'min_interval': 24  # hours
                    }
                    try:
                        self.settings_collection.insert_one(field_settings)
                    except Exception as insert_error:
                        print(f"Warning: Failed to insert settings: {insert_error}")
            else:
                # Use default settings if MongoDB not configured
                field_settings = {
                    'field_id': field_id,
                    'irrigation_threshold': 2.0,
                    'max_duration': 30,
                    'min_interval': 24
                }

            # Check last irrigation
            last_irrigation = None
            if self.irrigation_collection is not None:
                try:
                    last_irrigation = self.irrigation_collection.find_one(
                        {'field_id': field_id},
                        sort=[('timestamp', -1)]
                    )
                except Exception as e:
                    print(f"Warning: Error checking last irrigation: {e}")

            # Calculate time since last irrigation
            hours_since_last = 24  # default if no previous irrigation
            if last_irrigation:
                last_time = datetime.fromisoformat(last_irrigation['timestamp'])
                hours_since_last = (datetime.now() - last_time).total_seconds() / 3600

            # Make decision
            should_irrigate = (
                water_requirement >= field_settings['irrigation_threshold'] and
                hours_since_last >= field_settings['min_interval']
            )

            # Calculate duration if irrigation is needed
            duration = 0
            if should_irrigate:
                # Convert mm to minutes (assuming 1mm = 2 minutes of irrigation)
                duration = min(
                    int(water_requirement * 2),
                    field_settings['max_duration']
                )

            return {
                'should_irrigate': should_irrigate,
                'duration_minutes': duration,
                'water_requirement': water_requirement,
                'hours_since_last': round(hours_since_last, 1),
                'reason': self._generate_decision_reason(
                    should_irrigate,
                    water_requirement,
                    hours_since_last,
                    field_settings['irrigation_threshold']
                )
            }
        except Exception as e:
            return {'error': str(e)}

    def _generate_decision_reason(self, should_irrigate: bool, water_requirement: float, 
                                hours_since_last: float, threshold: float) -> str:
        """
        Generate a human-readable reason for the irrigation decision
        """
        if should_irrigate:
            return (
                f"Irrigation recommended because water requirement ({water_requirement:.1f}mm) "
                f"exceeds threshold ({threshold}mm) and {hours_since_last:.1f} hours have passed "
                "since last irrigation."
            )
        else:
            if water_requirement < threshold:
                return (
                    f"No irrigation needed because water requirement ({water_requirement:.1f}mm) "
                    f"is below threshold ({threshold}mm)."
                )
            else:
                return (
                    f"No irrigation needed because only {hours_since_last:.1f} hours have passed "
                    "since last irrigation."
                )

    def log_irrigation_action(self, field_id: str, action: Dict[str, Any]) -> bool:
        """
        Log irrigation action to database
        """
        if self.irrigation_collection is None:
            print("Warning: MongoDB not configured, cannot log irrigation action")
            return False
        
        try:
            log_entry = {
                'field_id': field_id,
                'action': 'irrigation' if action['should_irrigate'] else 'no_irrigation',
                'duration_minutes': action['duration_minutes'],
                'water_requirement': action['water_requirement'],
                'reason': action['reason'],
                'timestamp': datetime.now().isoformat()
            }
            self.irrigation_collection.insert_one(log_entry)
            return True
        except Exception as e:
            print(f"Error logging irrigation action: {str(e)}")
            return False

    def get_irrigation_history(self, field_id: str) -> Dict[str, Any]:
        """
        Get irrigation history for a field
        """
        if self.irrigation_collection is None:
            return []  # Return empty list if MongoDB not configured
        
        try:
            history = list(self.irrigation_collection.find(
                {'field_id': field_id},
                sort=[('timestamp', -1)]
            ).limit(10))
            return self._convert_to_dict(history)
        except Exception as e:
            print(f"Warning: Error getting irrigation history: {e}")
            return []  # Return empty list instead of error

    def close(self):
        """
        Close database connection
        """
        if self.mongo_client:
            try:
                self.mongo_client.close()
            except Exception as e:
                print(f"Warning: Error closing MongoDB connection: {e}") 