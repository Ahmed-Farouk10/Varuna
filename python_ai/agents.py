import os
from typing import Dict, Any
from autogen import AssistantAgent, UserProxyAgent, register_function
from dotenv import load_dotenv
from datetime import datetime

# Mock services (replace with your actual implementations)
class WeatherService:
    def get_current_weather(self, location):
        return {
            "location": {"localtime": datetime.now().isoformat()},
            "current": {"temp_c": 20, "condition": "Sunny", "humidity": 65},
            "forecast": {"temp_c": 22}
        }

class IrrigationSystem:
    def calculate_water_requirement(self, weather_data, soil_data, crop_data):
        return {"water_requirement": 10}  # Example value
    def make_irrigation_decision(self, field_id, water_requirement):
        return {"should_irrigate": True, "duration_minutes": 30}
    def log_irrigation_action(self, field_id, action):
        return True
    def get_soil_data(self, field_id):
        return {"moisture": 30, "temperature": 25, "ph": 6.5}
    def get_crop_data(self, field_id):
        return {
            "type": "Corn",
            "growth_stage": "Vegetative",
            "health_status": "Healthy",
            "water_requirement": 10
        }

# Define tool functions
def get_weather_forecast(location: str, days: int = 3) -> Dict[str, Any]:
    try:
        weather_service = WeatherService()
        weather_data = weather_service.get_current_weather(location)
        return {
            "location": location,
            "current": weather_data['current'],
            "forecast": weather_data.get('forecast', {}),
            "timestamp": weather_data['location']['localtime']
        }
    except Exception as e:
        return {"error": str(e)}

def get_soil_moisture(field_id: str) -> Dict[str, Any]:
    try:
        irrigation_system = IrrigationSystem()
        soil_data = irrigation_system.get_soil_data(field_id)
        return {
            "field_id": field_id,
            "moisture": soil_data["moisture"],
            "temperature": soil_data["temperature"],
            "ph": soil_data["ph"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

def get_crop_status(field_id: str) -> Dict[str, Any]:
    try:
        irrigation_system = IrrigationSystem()
        crop_data = irrigation_system.get_crop_data(field_id)
        return {
            "field_id": field_id,
            "crop_type": crop_data["type"],
            "growth_stage": crop_data["growth_stage"],
            "health_status": crop_data["health_status"],
            "water_requirement": crop_data["water_requirement"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

def control_irrigation(field_id: str, duration_minutes: int, reason: str) -> str:
    try:
        irrigation_system = IrrigationSystem()
        action = {
            'should_irrigate': True,
            'duration_minutes': duration_minutes,
            'water_requirement': 0,
            'reason': reason
        }
        if irrigation_system.log_irrigation_action(field_id, action):
            return f"Irrigation started for {field_id}, duration: {duration_minutes} minutes. Reason: {reason}"
        return "Failed to log irrigation action"
    except Exception as e:
        return f"Error controlling irrigation: {str(e)}"

# Load environment variables
load_dotenv()

# Groq configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
llm_config = {
    "config_list": [{
        "model": "llama-3.3-70b-versatile",
        "api_key": GROQ_API_KEY,
        "base_url": "https://api.groq.com/openai/v1",
        "api_type": "openai"
    }],
    "temperature": 0.7,
    "timeout": 60,
    "cache_seed": None
}

# Create specialized agents
weather_agent = AssistantAgent(
    name="WeatherAgent",
    llm_config=llm_config,
    system_message="You are a weather analysis expert. Your responsibilities include: 1. Analyzing current weather conditions 2. Predicting weather patterns 3. Assessing weather impact on irrigation 4. Alerting about extreme weather conditions 5. Providing weather-based irrigation recommendations"
)

soil_agent = AssistantAgent(
    name="SoilAgent",
    llm_config=llm_config,
    system_message="**if the user mesage includes asking for an analysis**(ELSE DNT RETRUN ANYTHING)You are a soil monitoring expert. Your responsibilities include: 1. Analyzing soil moisture levels 2. Monitoring soil temperature 3. Assessing soil nutrient levels 4. Providing soil health recommendations 5. Determining optimal irrigation timing based on soil conditions"
)

crop_agent = AssistantAgent(
    name="CropAgent",
    llm_config=llm_config,
    system_message="**if the user mesage includes asking for an analysis**(ELSE DNT RETRUN ANYTHING)You are a crop management expert. Your responsibilities include: 1. Monitoring crop growth stages 2. Assessing crop water needs 3. Identifying crop stress indicators 4. Providing crop-specific recommendations 5. Optimizing irrigation for crop health"
)

irrigation_agent = AssistantAgent(
    name="IrrigationAgent",
    llm_config=llm_config,
    system_message='''
    IF THE USER MESSAGE INCLUDES ASKING FOR AN ANALYSIS YOU ARE AN IRRIGATION DECISION-MAKING EXPERT. YOUR RESPONSIBILITIES INCLUDE: 1. ANALYZING WEATHER AND SOIL DATA 2. DETERMINING OPTIMAL IRRIGATION SCHEDULES 3. CALCULATING WATER REQUIREMENTS 4. OPTIMIZING WATER USAGE EFFICIENCY 5. MAKING FINAL IRRIGATION DECISIONS BASED ON ALL FACTORS
    else : you are a farming assistant
    DONT SHOW THE IRRIGATION DATA 
    '''
)

farmer_agent = AssistantAgent(
    name="FarmerAgent",
    llm_config=llm_config,
    system_message="**if the user mesage includes asking for an analysis**(ELSE DNT RETRUN ANYTHING) You are a farmer communication expert. Your responsibilities include: 1. Explaining irrigation decisions to farmers 2. Providing clear recommendations 3. Addressing farmer concerns 4. Suggesting best practices 5. Maintaining clear communication"
)

user_proxy = UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=1,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "workspace", "use_docker": False},
    llm_config=llm_config,
    system_message="A proxy for the user to interact with the irrigation system."
)

# Register tools with individual agents
weather_agent.register_function(function_map={"get_weather_forecast": get_weather_forecast})
soil_agent.register_function(function_map={"get_soil_moisture": get_soil_moisture})
crop_agent.register_function(function_map={"get_crop_status": get_crop_status})
irrigation_agent.register_function(function_map={"control_irrigation": control_irrigation})

def run_irrigation_analysis(field_id: str, location: str, user_message: str = None):
    """
    Run the complete irrigation analysis process
    """
    try:
        # Get current data
        weather_data = get_weather_forecast(location)
        soil_data = get_soil_moisture(field_id)
        crop_data = get_crop_status(field_id)

        # Check for errors in data
        if 'error' in weather_data:
            return {"error": f"Weather data error: {weather_data['error']}"}
        if 'error' in soil_data:
            return {"error": f"Soil data error: {soil_data['error']}"}
        if 'error' in crop_data:
            return {"error": f"Crop data error: {crop_data['error']}"}

        # Initialize irrigation system
        irrigation_system = IrrigationSystem()

        # Calculate water requirement
        water_requirement = irrigation_system.calculate_water_requirement(
            weather_data, soil_data, crop_data
        )

        if 'error' in water_requirement:
            return {"error": f"Water requirement error: {water_requirement['error']}"}

        # Make irrigation decision
        decision = irrigation_system.make_irrigation_decision(
            field_id, water_requirement['water_requirement']
        )

        if 'error' in decision:
            return {"error": f"Irrigation decision error: {decision['error']}"}

        # Prepare response message
        response_message = f"Analyzing irrigation needs for field {field_id} in {location}."
        if user_message:
            response_message += f"\nUser query: {user_message}"

        # Initialize conversation with irrigation agent
        messages = []
        
        # Initiate chat and capture messages
        chat_result = user_proxy.initiate_chat(
            irrigation_agent,
            message=f"""{response_message}
            
            Current data:
            - Weather: {weather_data}
            - Soil: {soil_data}
            - Crop: {crop_data}
            - Water Requirement: {water_requirement}
            - Irrigation Decision: {decision}
            
            Please coordinate with other agents to make the best irrigation decision and respond to the user's query."""
        )

        # Extract messages from chat history
        # Note: chat_messages is a dict with recipient as key
        chat_history = user_proxy.chat_messages.get(irrigation_agent, [])
        for msg in chat_history:
            content = msg.get("content", "")
            if content and not content.rstrip().endswith("TERMINATE"):
                messages.append(content)

        # Return structured response
        return {
            "field_id": field_id,
            "location": location,
            "user_message": user_message,
            "weather_data": weather_data,
            "soil_data": soil_data,
            "crop_data": crop_data,
            "water_requirement": water_requirement,
            "irrigation_decision": decision,
            "recommendation": messages[-1] if messages else "No recommendation available"
        }
    except Exception as e:
        return {"error": f"Failed to run irrigation analysis: {str(e)}"}