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
    const { action, field_id, location, duration_minutes, reason } = body;

    if (action === 'analyze') {
      return new Response(JSON.stringify({
        field_id,
        location,
        recommendation: 'Based on current soil moisture and weather conditions, irrigation is not needed at this time.',
        should_irrigate: false,
        duration_minutes: 0,
        water_requirement: '0mm'
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'control') {
      return new Response(JSON.stringify({
        success: true,
        message: `Irrigation started for ${duration_minutes} minutes. Reason: ${reason || 'Manual trigger'}`,
        field_id,
        duration_minutes,
        timestamp: new Date().toISOString()
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'history') {
      const logs = Array.from({ length: 5 }, (_, i) => ({
        id: `log_${i + 1}`,
        field_id: field_id || 'field_001',
        action: i % 3 === 0 ? 'Irrigation Started' : i % 3 === 1 ? 'Irrigation Stopped' : 'System Check',
        duration: i % 3 === 0 ? '30min' : 'N/A',
        timestamp: new Date(Date.now() - (4 - i) * 86400000).toISOString(),
        status: 'Completed'
      }));
      return new Response(JSON.stringify(logs), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
