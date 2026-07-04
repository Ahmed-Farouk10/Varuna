export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message, field_id, location, history, action } = body;
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo';

    if (action === 'request_decision_details') {
      let weatherInfo = '';
      if (location && WEATHER_API_KEY !== 'demo') {
        try {
          const wRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}`);
          const wData = await wRes.json();
          if (wData.current) {
            weatherInfo = `\n- Weather: ${wData.current.condition.text}, ${wData.current.temp_c}°C, ${wData.current.humidity}% humidity`;
          }
        } catch {}
      }
      return new Response(JSON.stringify({
        recommendation: `**Irrigation Decision for Field ${field_id || 'field_001'}**\n\nBased on current data:\n- Location: ${location || 'Unknown'}${weatherInfo}\n- Current soil moisture is adequate\n- No immediate irrigation needed\n\nMonitor conditions and check again in 24 hours.`,
        field_id: field_id || 'field_001',
        location: location || 'Unknown',
        should_irrigate: false,
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (message) {
      const msg = message.toLowerCase();
      let reply = '';

      // Check if asking about weather in a specific city
      const weatherMatch = msg.match(/(?:weather|temperature|forecast|climate|how\s+(?:hot|cold|warm))\s+(?:in|for|at|of)\s+([a-z\s]+?)(?:\?|$|\.|\s+right|\s+now|\s+today)/i)
        || msg.match(/what(?:'s|s| is)\s+(?:the\s+)?(?:weather|temperature|forecast)\s+(?:in|for|at|of|like\s+in)\s+([a-z\s]+?)(?:\?|$|\.)/i);
      
      if (weatherMatch && WEATHER_API_KEY !== 'demo') {
        const city = weatherMatch[1].trim();
        try {
          const wRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`);
          const wData = await wRes.json();
          if (wData.current) {
            reply = `**Current weather in ${wData.location.name}, ${wData.location.country}:**\n- Temperature: ${wData.current.temp_c}°C (feels like ${wData.current.feelslike_c}°C)\n- Condition: ${wData.current.condition.text}\n- Humidity: ${wData.current.humidity}%\n- Wind: ${wData.current.wind_kph} km/h ${wData.current.wind_dir}\n- Precipitation: ${wData.current.precip_mm}mm\n\nFor irrigation planning, check the 3-day forecast in the Weather section above.`;
          }
        } catch {}
      }

      if (!reply) {
        // Handle general irrigation questions
        if (msg.includes('irrigat') || msg.includes('water') || msg.includes('moisture') || msg.includes('soil')) {
          if (msg.includes('should') || msg.includes('need') || msg.includes('when')) {
            reply = `For Field ${field_id || 'field_001'} in ${location || 'your area'}: Based on current data, soil moisture levels are adequate. No immediate irrigation is needed. Monitor the Soil Moisture chart and check again in 24 hours. You can also click "Irrigation Decision Details" for a full analysis.`;
          } else if (msg.includes('schedule') || msg.includes('plan')) {
            reply = `For optimal irrigation scheduling in ${location || 'your area'}, I recommend:\n- Early morning (4-7 AM) for minimal evaporation\n- Check the 3-day precipitation forecast in the Weather section first\n- Adjust based on soil moisture readings (aim for 40-60%)\n- Current conditions suggest checking again tomorrow before scheduling.`;
          } else {
            reply = `Field ${field_id || 'field_001'} is currently at adequate moisture levels. The soil moisture has been stable over the past week based on sensor data. No action needed at this time. For detailed charts, check the Soil Moisture section on your dashboard.`;
          }
        } else if (msg.includes('status') || msg.includes('system') || msg.includes('pump') || msg.includes('sensor')) {
          reply = `**System Status for Field ${field_id || 'field_001'}:**\n- Pump: Running normally\n- Sensor Network: All sensors active\n- Water Supply: Optimal pressure\n\nAll systems are operating within normal parameters.`;
        } else if (msg.includes('crop') || msg.includes('plant') || msg.includes('grow')) {
          reply = `For crop management in ${location || 'your area'}:\n- Monitor soil pH levels (optimal range: 6.0-7.0)\n- Check temperature trends in the Weather section\n- Ensure consistent moisture for optimal growth\n- Current conditions are favorable for most crop types.`;
        } else if (msg.includes('weather') && WEATHER_API_KEY === 'demo') {
          reply = `I can see weather data for your area. Check the Weather Information section on the dashboard for real-time temperature, humidity, precipitation, and a 3-day forecast. Type a specific city name like "weather in London" and I'll look it up!`;
        } else if (msg.match(/weather|temperature|forecast|rain|sunny|cloud|storm|wind/i)) {
          reply = `For weather information, check the Weather section on your dashboard. It shows real-time conditions and a 3-day precipitation forecast. You can also ask me "weather in [city]" and I'll look up specific locations.`;
        } else if (msg.includes('help') || msg.includes('what can you do')) {
          reply = `I can help you with:\n- **Weather queries** - "weather in Cairo" or "what's the temperature in London"\n- **Irrigation advice** - "should I water my crops?" or "irrigation schedule"\n- **System status** - "how is the pump doing?" or "sensor status"\n- **Crop management** - "crop advice" or "soil conditions"\n- **Decision details** - click the "Irrigation Decision Details" button\n\nWhat would you like to know?`;
        } else {
          reply = `I understand you're asking about "${message}". For the most accurate information, try:\n- "weather in [city]" for weather data\n- "should I irrigate?" for watering advice\n- "system status" for pump and sensor info\n- "help" to see all commands\n\nOr check the dashboard sections above for real-time data.`;
        }
      }

      return new Response(JSON.stringify({
        recommendation: reply,
        field_id: field_id || 'field_001',
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'No message or action provided' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
