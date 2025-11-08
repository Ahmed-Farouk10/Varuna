from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from weather import WeatherService
from irrigation import IrrigationSystem
from agents import run_irrigation_analysis
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Validate environment variables
def validate_env():
    """Validate that required environment variables are set"""
    required_vars = ['MONGODB_URI', 'WEATHER_API_KEY']
    optional_vars = ['GROQ_API_KEY']  # Optional but recommended for AI chat
    missing_vars = []
    missing_optional = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    for var in optional_vars:
        if not os.getenv(var):
            missing_optional.append(var)
    
    if missing_vars:
        print("=" * 60)
        print("WARNING: Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print("=" * 60)
        print("Please create a .env file in the python_ai directory with:")
        print("  MONGODB_URI=your_mongodb_uri")
        print("  WEATHER_API_KEY=your_weather_api_key")
        print("=" * 60)
        return False
    
    if missing_optional:
        print("=" * 60)
        print("INFO: Optional environment variables (for AI chat):")
        for var in missing_optional:
            print(f"  - {var}")
        print("=" * 60)
        print("To enable AI chat features, add to your .env file:")
        print("  GROQ_API_KEY=your_groq_api_key")
        print("Get a FREE API key at: https://console.groq.com/")
        print("=" * 60)
    
    return True

# Initialize services
try:
    weather_service = WeatherService()
    irrigation_system = IrrigationSystem()
    
    # Validate environment variables
    validate_env()
except Exception as e:
    print(f"Error initializing services: {e}")
    print("Please check your .env file and MongoDB connection.")

@app.route('/')
def home():
    return jsonify({"message": "Python AI Backend is running"})

@app.route('/api/weather/<city>', methods=['GET'])
def get_weather(city):
    try:
        # Get weather data
        weather_data = weather_service.get_current_weather(city)
        
        # Check for errors in weather data
        if 'error' in weather_data:
            return jsonify({
                "error": weather_data['error'],
                "message": "Failed to fetch weather data. Please check your WEATHER_API_KEY in .env file."
            }), 500
        
        # Save to database only if data is valid
        try:
            weather_service.save_weather_data(city, weather_data)
        except Exception as save_error:
            # Log save error but don't fail the request
            print(f"Warning: Failed to save weather data to database: {save_error}")
        
        return jsonify(weather_data)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred while fetching weather data"
        }), 500

@app.route('/api/weather/history/<city>', methods=['GET'])
def get_weather_history(city):
    try:
        history = weather_service.get_weather_history(city)
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/weather/forecast/<city>', methods=['GET'])
def get_forecast(city):
    try:
        forecast_data = weather_service.get_forecast(city)
        # Check for errors in forecast data
        if 'error' in forecast_data:
            return jsonify({
                "error": forecast_data['error'],
                "message": "Failed to fetch weather forecast. Please check your WEATHER_API_KEY in .env file."
            }), 500
        return jsonify(forecast_data)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred while fetching weather forecast"
        }), 500

@app.route('/api/irrigation/analyze', methods=['POST'])
def analyze_irrigation():
    try:
        data = request.get_json()
        field_id = data.get('field_id')
        location = data.get('location')

        if not field_id or not location:
            return jsonify({"error": "field_id and location are required"}), 400

        # Get the latest irrigation decision
        weather_data = weather_service.get_current_weather(location)
        soil_data = irrigation_system.get_soil_data(field_id)
        crop_data = irrigation_system.get_crop_data(field_id)

        # Check for errors in the data
        if 'error' in weather_data:
            return jsonify({"error": f"Weather data error: {weather_data['error']}"}), 500
        if 'error' in soil_data:
            return jsonify({"error": f"Soil data error: {soil_data['error']}"}), 500
        if 'error' in crop_data:
            return jsonify({"error": f"Crop data error: {crop_data['error']}"}), 500

        # Calculate water requirement
        water_requirement = irrigation_system.calculate_water_requirement(
            weather_data,
            soil_data,
            crop_data
        )

        # Check for error in water requirement calculation
        if 'error' in water_requirement:
            return jsonify({"error": f"Water requirement calculation error: {water_requirement['error']}"}), 500

        # Make irrigation decision
        decision = irrigation_system.make_irrigation_decision(
            field_id,
            water_requirement['water_requirement']
        )

        # Check for error in irrigation decision
        if 'error' in decision:
            return jsonify({"error": f"Irrigation decision error: {decision['error']}"}), 500

        return jsonify({
            "field_id": field_id,
            "location": location,
            "weather_data": weather_data,
            "soil_data": soil_data,
            "crop_data": crop_data,
            "water_requirement": water_requirement,
            "irrigation_decision": decision
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/irrigation/control', methods=['POST'])
def control_irrigation():
    try:
        data = request.get_json()
        field_id = data.get('field_id')
        duration_minutes = data.get('duration_minutes')
        reason = data.get('reason')

        if not all([field_id, duration_minutes, reason]):
            return jsonify({"error": "field_id, duration_minutes, and reason are required"}), 400

        action = {
            'should_irrigate': True,
            'duration_minutes': duration_minutes,
            'water_requirement': 0,
            'reason': reason
        }

        success = irrigation_system.log_irrigation_action(field_id, action)
        
        if success:
            return jsonify({
                "message": f"Irrigation started for {field_id}",
                "duration_minutes": duration_minutes,
                "reason": reason
            })
        else:
            return jsonify({"error": "Failed to log irrigation action"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/irrigation/history/<field_id>', methods=['GET'])
def get_irrigation_history(field_id):
    try:
        history = irrigation_system.get_irrigation_history(field_id)
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/soil/<field_id>', methods=['GET'])
def get_soil_data(field_id):
    try:
        # Get soil data from irrigation system
        soil_data = irrigation_system.get_soil_data(field_id)
        
        # Check if MongoDB is configured
        if irrigation_system.soil_collection is None:
            # Return sample data if MongoDB not configured
            now = datetime.now()
            history = [
                {
                    'field_id': field_id,
                    'moisture': soil_data.get('moisture', 30.0) + (i - 3),
                    'temperature': soil_data.get('temperature', 20.0),
                    'ph': soil_data.get('ph', 6.5),
                    'timestamp': (now - timedelta(days=i)).isoformat()
                }
                for i in range(7)
            ]
            return jsonify(history)
        
        # Get historical soil data (last 7 days)
        try:
            history = list(irrigation_system.soil_collection.find(
                {'field_id': field_id},
                {'_id': 0}
            ).sort('timestamp', -1).limit(7))
        except Exception as e:
            print(f"Warning: Error fetching soil history: {e}")
            history = []
        
        if not history:
            # If no history exists, create some sample data
            now = datetime.now()
            history = [
                {
                    'field_id': field_id,
                    'moisture': soil_data.get('moisture', 30.0) + (i - 3),  # Vary around current
                    'temperature': soil_data.get('temperature', 20.0),
                    'ph': soil_data.get('ph', 6.5),
                    'timestamp': (now - timedelta(days=i)).isoformat()
                }
                for i in range(7)
            ]
            
            # Save the sample data only if MongoDB is available
            if irrigation_system.soil_collection is not None:
                try:
                    irrigation_system.soil_collection.insert_many(history)
                except Exception as insert_error:
                    print(f"Warning: Failed to insert sample soil data: {insert_error}")
        
        return jsonify(history)
    except Exception as e:
        print(f"Error in get_soil_data endpoint: {e}")
        import traceback
        traceback.print_exc()
        # Return sample data as fallback
        now = datetime.now()
        fallback_history = [
            {
                'field_id': field_id,
                'moisture': 30.0 + (i - 3),
                'temperature': 20.0,
                'ph': 6.5,
                'timestamp': (now - timedelta(days=i)).isoformat()
            }
            for i in range(7)
        ]
        return jsonify(fallback_history)

@socketio.on('message')
def handle_message(data):
    try:
        field_id = data.get('field_id', 'field_001')
        location = data.get('location', '') or ''
        user_message = data.get('message', '')
        history = data.get('history')
        if data.get('action') == 'request_decision_details':
            # Get current system state for comprehensive report
            try:
                # Use existing service instances
                if location:
                    weather_data = weather_service.get_current_weather(location)
                else:
                    weather_data = {"error": "No location specified", "message": "Please configure your location in the dashboard"}
                soil_data = irrigation_system.get_soil_data(field_id)
                crop_data = irrigation_system.get_crop_data(field_id)
                
                # Calculate current decision
                if 'error' not in weather_data and 'error' not in soil_data and 'error' not in crop_data:
                    water_req = irrigation_system.calculate_water_requirement(weather_data, soil_data, crop_data)
                    if 'error' not in water_req:
                        decision = irrigation_system.make_irrigation_decision(field_id, water_req['water_requirement'])
                        
                        # Get historical logs if available
                        logs = []
                        if irrigation_system.irrigation_collection is not None:
                            try:
                                logs = list(irrigation_system.irrigation_collection.find({"field_id": field_id}).sort("timestamp", -1).limit(1))
                            except:
                                pass
                        
                        # Build comprehensive report
                        summary = f"**Irrigation Decision Details for {field_id}**\n\n"
                        summary += f"**Location:** {location if location else 'Not configured - Please set your location in the dashboard'}\n\n"
                        summary += f"**Current Weather:**\n"
                        if 'error' not in weather_data:
                            summary += f"- Condition: {weather_data.get('current', {}).get('condition', {}).get('text', 'N/A')}\n"
                            summary += f"- Temperature: {weather_data.get('current', {}).get('temp_c', 'N/A')}°C\n"
                            summary += f"- Humidity: {weather_data.get('current', {}).get('humidity', 'N/A')}%\n"
                            summary += f"- Precipitation: {weather_data.get('current', {}).get('precip_mm', 'N/A')}mm\n\n"
                        summary += f"**Soil Status:**\n"
                        summary += f"- Moisture: {soil_data.get('moisture', 'N/A')}%\n"
                        summary += f"- Temperature: {soil_data.get('temperature', 'N/A')}°C\n"
                        summary += f"- pH: {soil_data.get('ph', 'N/A')}\n\n"
                        summary += f"**Crop Status:**\n"
                        summary += f"- Type: {crop_data.get('type', 'N/A')}\n"
                        summary += f"- Growth Stage: {crop_data.get('growth_stage', 'N/A')}\n"
                        summary += f"- Health: {crop_data.get('health_status', 'N/A')}\n\n"
                        summary += f"**Water Requirement:** {water_req.get('water_requirement', 'N/A')} mm/day\n\n"
                        summary += f"**Irrigation Decision:**\n"
                        if 'error' not in decision:
                            summary += f"- Should Irrigate: {'Yes' if decision.get('should_irrigate', False) else 'No'}\n"
                            summary += f"- Duration: {decision.get('duration_minutes', 0)} minutes\n"
                            summary += f"- Reason: {decision.get('reason', 'N/A')}\n\n"
                        if logs:
                            log = logs[0]
                            summary += f"**Last Irrigation Log:**\n"
                            summary += f"- Date: {log.get('timestamp', 'N/A')}\n"
                            summary += f"- Action: {log.get('action', 'N/A')}\n"
                            summary += f"- Duration: {log.get('duration_minutes', 'N/A')} minutes\n"
                        else:
                            summary += "**Note:** No previous irrigation logs found for this field.\n"
                        
                        emit('response', {"recommendation": summary})
                    else:
                        emit('response', {"recommendation": f"Error calculating water requirement: {water_req.get('error', 'Unknown error')}"})
                else:
                    emit('response', {"recommendation": "Unable to fetch current system data. Please check your API keys and database connection."})
            except Exception as e:
                print(f"Error generating decision details: {e}")
                import traceback
                traceback.print_exc()
                emit('response', {"recommendation": f"Error generating report: {str(e)}"})
            return
        result = run_irrigation_analysis(field_id, location, user_message, history=history)
        emit('response', result)
    except Exception as e:
        error_msg = str(e)
        if 'Invalid API Key' in error_msg or '401' in error_msg:
            error_msg = "Invalid Groq API key. Please check your GROQ_API_KEY in .env file. Get a free key at: https://console.groq.com/"
        elif 'API key' in error_msg.lower():
            error_msg = "API key error. Please check your environment variables in .env file."
        emit('response', {'error': error_msg})

if __name__ == '__main__':
    try:
        socketio.run(app, port=5001, debug=True)
    finally:
        weather_service.close()
        irrigation_system.close() 