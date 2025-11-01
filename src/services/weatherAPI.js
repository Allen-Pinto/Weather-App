import { API_KEY, API_BASE_URL } from '../utils/constants';
import weatherCache from './cache';

export const fetchWeatherData = async (city, forceRefresh = false) => {
  const cacheKey = `weather_${city}`;
  
  if (!forceRefresh) {
    const cached = weatherCache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    weatherCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const searchCities = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search.json?key=${API_KEY}&q=${query}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};