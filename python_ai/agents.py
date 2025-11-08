import os
import requests
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

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in environment variables!")
    print("AI chat features will not work without a valid Groq API key.")

llm_config = {
    "config_list": [{
        "model": "llama-3.3-70b-versatile",
        "api_key": GROQ_API_KEY or "dummy-key",  # Use dummy if not set to prevent crash
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

# Groq API configuration (FREE TIER AVAILABLE)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def groq_query(prompt, history=None):
    """Query Groq API for AI responses. Groq offers a free tier with fast inference."""
    if not GROQ_API_KEY:
        return "AI assistant is not configured. Please set GROQ_API_KEY in your .env file.\n\nTo get a free API key:\n1. Visit https://console.groq.com/\n2. Sign up for a free account\n3. Create an API key\n4. Add GROQ_API_KEY=your_key_here to your .env file"
    
    # Build messages array for chat completion
    messages = [
        {
            "role": "system",
            "content": "You are an expert irrigation and agriculture assistant. Provide helpful, concise, and practical answers about farming, irrigation, weather, soil, and crops."
        }
    ]
    
    # Add conversation history
    if history:
        for h in history:
            role = h.get('role', 'user')
            content = h.get('content', '')
            if role in ['user', 'assistant']:
                messages.append({"role": role, "content": content})
    
    # Add current user message
    messages.append({"role": "user", "content": prompt})
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.1-8b-instant",  # Fast and free model
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 512,
        "top_p": 1,
        "stream": False
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 401:
            return "Invalid GROQ_API_KEY. Please check your API key in the .env file.\n\nGet a free key at: https://console.groq.com/"
        elif response.status_code == 429:
            return "Rate limit exceeded. Please wait a moment and try again. (Groq free tier has rate limits)"
        elif not response.ok:
            return f"API error: {response.status_code}. Please check your GROQ_API_KEY or try again later."
        
        data = response.json()
        
        if 'choices' in data and len(data['choices']) > 0:
            text = data['choices'][0]['message']['content'].strip()
            return text if text else "I understand your question, but I'm having trouble generating a response. Please try rephrasing."
        else:
            return "Unexpected response format from AI service. Please try again."
            
    except requests.exceptions.Timeout:
        return "Request timed out. Please try again."
    except requests.exceptions.RequestException as e:
        return f"Network error: {str(e)}. Please check your internet connection."
    except Exception as e:
        return f"Error: {str(e)}. Please try again."

def run_irrigation_analysis(field_id, location, user_message=None, history=None):
    if not GROQ_API_KEY:
        return {"error": "No Groq API key configured. Please set GROQ_API_KEY in your .env file.\n\nGet a free API key at: https://console.groq.com/"}
    
    greetings = ['hi', 'hello', 'hey', 'السلام عليكم', 'مرحبا', 'aloha', 'hola', 'bonjour', 'ciao']
    if user_message and user_message.strip().lower() in greetings:
        return {'recommendation': "Hello! I'm your irrigation assistant. How can I help you today?"}
    
    # Build context-aware prompt with system info
    location_context = f"Field {field_id}" + (f" in {location}" if location else "")
    sys_info = f"Context: {location_context}. You help with weather analysis, soil monitoring, crop management, and irrigation scheduling."
    
    # Add user's question
    user_question = user_message or "How can you help with irrigation?"
    prompt = f"{sys_info}\n\nUser: {user_question}"
    
    # Get AI response with conversation history
    assistant_reply = groq_query(prompt, history)
    
    return {"recommendation": assistant_reply}