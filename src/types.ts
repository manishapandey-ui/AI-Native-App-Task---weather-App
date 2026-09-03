export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day?: number;
}

export interface DailyForecastRaw {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface DailyUnits {
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeather;
  daily: DailyForecastRaw;
  daily_units?: DailyUnits;
}

export interface DayForecast {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  isToday: boolean;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
}

export interface RecommendationAlert {
  type: 'warning' | 'info' | 'caution' | 'success';
  title: string;
  message: string;
}

export interface ActivityAdvice {
  name: string;
  status: 'Ideal' | 'Good' | 'Caution' | 'Not Recommended';
  reason: string;
}

export interface PlanningRecommendations {
  summaryTitle: string;
  summaryText: string;
  outfitAdvice: {
    heading: string;
    suggestion: string;
    items: string[];
  };
  alerts: RecommendationAlert[];
  activities: ActivityAdvice[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
