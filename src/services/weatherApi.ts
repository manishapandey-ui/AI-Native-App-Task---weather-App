import { ForecastResponse, GeocodingResponse, GeocodingResult } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches for a location by city name using Open-Meteo Geocoding API.
 */
export async function searchLocation(query: string, count: number = 5): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a city name to search.');
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Location search request failed with status: ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('City not found. Please try another search.');
    }

    return data.results;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected error occurred while searching for the location.');
  }
}

/**
 * Fetches forecast and current weather data using Open-Meteo Forecast API.
 */
export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<ForecastResponse> {
  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather forecast request failed with status: ${response.status}`);
    }

    const data: ForecastResponse = await response.json();

    if (!data.current_weather || !data.daily) {
      throw new Error('Incomplete weather information received from weather service.');
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to fetch weather forecast data.');
  }
}

/**
 * Optional reverse geocoding to resolve city name when user clicks "Use My Location"
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lon: number
): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      return { city, country };
    }
  } catch {
    // Non-critical fallback
  }
  return {
    city: `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
    country: '',
  };
}
