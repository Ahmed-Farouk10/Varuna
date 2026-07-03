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
    const { message, field_id, location, action } = body;

    if (action === 'request_decision_details') {
      return new Response(JSON.stringify({
        recommendation: `**Irrigation Decision for Field ${field_id || 'field_001'}**\n\nBased on current data:\n- Location: ${location || 'Unknown'}\n- Current soil moisture is adequate\n- No immediate irrigation needed\n\nMonitor conditions and check again in 24 hours.`,
        field_id: field_id || 'field_001',
        location: location || 'Unknown',
        should_irrigate: false,
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (message) {
      const responses = [
        `Based on current conditions in ${location || 'your area'}, your field ${field_id || ''} is doing well. Soil moisture levels are within acceptable range.`,
        `I recommend checking your irrigation schedule for the upcoming week. Forecast shows moderate rainfall expected.`,
        `Your soil moisture is at optimal levels. No irrigation needed for the next 48 hours.`,
        `The current weather pattern suggests increased evaporation rates. Consider adjusting your irrigation timing to early morning hours.`
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];

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
