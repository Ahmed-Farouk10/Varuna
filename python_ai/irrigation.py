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
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.db = self.mongo_client['irrigation_db']
        self.irrigation_collection = self.db['irrigation_logs']
        self.settings_collection = self.db['irrigation_settings']
        self.soil_collection = self.db['soil_data']
        self.crop_collection = self.db['crop_data']

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
                self.soil_collection.insert_one(soil_data)
            return self._convert_to_dict(soil_data)
        except Exception as e:
            return {'error': str(e)}

    def get_crop_data(self, field_id: str) -> Dict[str, Any]:
        """
        Get crop data for a field
        """
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
                self.crop_collection.insert_one(crop_data)
            return self._convert_to_dict(crop_data)
        except Exception as e:
            return {'error': str(e)}

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
            field_settings = self.settings_collection.find_one({'field_id': field_id})
            if not field_settings:
                field_settings = {
                    'field_id': field_id,
                    'irrigation_threshold': 2.0,  # mm
                    'max_duration': 30,  # minutes
                    'min_interval': 24  # hours
                }
                self.settings_collection.insert_one(field_settings)

            # Check last irrigation
            last_irrigation = self.irrigation_collection.find_one(
                {'field_id': field_id},
                sort=[('timestamp', -1)]
            )

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
        try:
            history = list(self.irrigation_collection.find(
                {'field_id': field_id},
                sort=[('timestamp', -1)]
            ).limit(10))
            return self._convert_to_dict(history)
        except Exception as e:
            return {'error': str(e)}

    def close(self):
        """
        Close database connection
        """
        self.mongo_client.close() 