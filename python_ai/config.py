from dotenv import load_dotenv 
import os
load_dotenv()
#Create config.py to load environment variables
MONGODB_URI = os.getenv('MONGODB_URI')
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
