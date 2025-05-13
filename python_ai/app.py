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

# Initialize services
weather_service = WeatherService()
irrigation_system = IrrigationSystem()

@app.route('/')
def home():
    return jsonify({"message": "Python AI Backend is running"})

@app.route('/api/weather/<city>', methods=['GET'])
def get_weather(city):
    try:
        # Get weather data
        weather_data = weather_service.get_current_weather(city)
        # Save to database
        weather_service.save_weather_data(city, weather_data)
        return jsonify(weather_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        return jsonify(forecast_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        
        # Get historical soil data (last 7 days)
        history = list(irrigation_system.soil_collection.find(
            {'field_id': field_id},
            {'_id': 0}
        ).sort('timestamp', -1).limit(7))
        
        if not history:
            # If no history exists, create some sample data
            now = datetime.now()
            history = [
                {
                    'field_id': field_id,
                    'moisture': soil_data['moisture'] + (i - 3),  # Vary around current
                    'temperature': soil_data['temperature'],
                    'ph': soil_data['ph'],
                    'timestamp': (now - timedelta(days=i)).isoformat()
                }
                for i in range(7)
            ]
            
            # Save the sample data
            irrigation_system.soil_collection.insert_many(history)
        
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@socketio.on('message')
def handle_message(data):
    """Handle incoming chat messages"""
    try:
        # Run irrigation analysis with AutoGen agents
        analysis = run_irrigation_analysis(data.get('field_id', ''), data.get('location', ''))
        emit('response', analysis)
    except Exception as e:
        emit('response', {'error': str(e)})

if __name__ == '__main__':
    try:
        socketio.run(app, port=5001, debug=True)
    finally:
        weather_service.close()
        irrigation_system.close() 