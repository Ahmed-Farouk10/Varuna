const INSFORGE_BASE = 'https://zufe8vz6.us-east.insforge.app';

async function invoke(slug, body) {
  const res = await fetch(`${INSFORGE_BASE}/functions/v1/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
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
