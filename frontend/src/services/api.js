import { createClient } from '@insforge/sdk';

const INSFORGE_BASE = 'https://zufe8vz6.us-east.insforge.app';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODU5MDh9.a7TN-dOxWcrEb4sGRMX3zJoDKTLVZV9VJ8KTtydLhW0';

const client = createClient({
  baseUrl: INSFORGE_BASE,
  anonKey: ANON_KEY
});

async function invoke(slug, body) {
  const { data, error } = await client.functions.invoke(slug, {
    body,
  });
  
  if (error) {
    console.error(`InsForge Edge Function Error (${slug}):`, error);
    // Graceful fallback to return the error object shape UI expects
    return { error: error.message || 'Function invocation failed' };
  }
  
  return data;
}

export const api = {
  getWeather: (city) => invoke('varuna-weather', { action: 'current', city }),
  getForecast: (city) => invoke('varuna-weather', { action: 'forecast', city }),
  getWeatherHistory: (city) => invoke('varuna-weather', { action: 'history', city }),
  getSoilData: (fieldId) => invoke('varuna-soil', { field_id: fieldId }),
  analyzeIrrigation: (fieldId, location) => invoke('varuna-irrigation', { action: 'analyze', field_id: fieldId, location }),
  controlIrrigation: (fieldId, durationMinutes, reason) => invoke('varuna-irrigation', { action: 'control', field_id: fieldId, duration_minutes: durationMinutes, reason }),
  getIrrigationHistory: (fieldId) => invoke('varuna-irrigation', { action: 'history', field_id: fieldId }),
  chat: (message, fieldId, location, history, action) => invoke('varuna-chat', { message, field_id: fieldId, location, history, action })
};
