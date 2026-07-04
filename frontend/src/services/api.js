import { createClient } from '@insforge/sdk';

const INSFORGE_BASE = 'https://5utryqc7.us-east.insforge.app';
const ANON_KEY = 'anon_1738e9c998b3b1a426586247b73f54e570696e405ea5b116ccfb68eb0c714110';

const client = createClient({
  baseUrl: INSFORGE_BASE,
  anonKey: ANON_KEY,
  functionsUrl: 'https://5utryqc7.function2.insforge.app'
});

async function invoke(slug, body) {
  const { data, error } = await client.functions.invoke(slug, {
    body,
  });
  
  if (error) {
    const msg = typeof error === 'string' ? error : error?.message || error?.error || JSON.stringify(error);
    console.error(`InsForge Edge Function Error (${slug}):`, error);
    return { error: msg || 'Function invocation failed' };
  }
  
  // Check for application-level errors in the response data
  if (data && typeof data === 'object' && data.error) {
    const appErr = typeof data.error === 'string' ? data.error : data.error?.message || JSON.stringify(data.error);
    return { error: appErr };
  }
  
  // Unwrap InsForge response wrapper if present
  if (data && typeof data === 'object' && 'value' in data) {
    return data.value;
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
