import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sparkles,
} from 'lucide-react';
import { WeatherConditionInfo } from '../types';

/**
 * Open-Meteo WMO Weather interpretation codes (WW)
 * 0: Clear sky
 * 1, 2, 3: Mainly clear, partly cloudy, and overcast
 * 45, 48: Fog and depositing rime fog
 * 51, 53, 55: Drizzle: Light, moderate, and dense intensity
 * 56, 57: Freezing Drizzle: Light and dense intensity
 * 61, 63, 65: Rain: Slight, moderate and heavy intensity
 * 66, 67: Freezing Rain: Light and heavy intensity
 * 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
 * 77: Snow grains
 * 80, 81, 82: Rain showers: Slight, moderate, and violent
 * 85, 86: Snow showers slight and heavy
 * 95: Thunderstorm: Slight or moderate
 * 96, 99: Thunderstorm with slight and heavy hail
 */

export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: 'Bright sunshine with virtually no clouds.',
        category: 'clear',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly clear skies with scattered thin clouds.',
        category: 'clear',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Mix of sun and passing cloud cover.',
        category: 'cloudy',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Persistent cloud cover blanketing the sky.',
        category: 'cloudy',
      };
    case 45:
      return {
        label: 'Foggy',
        description: 'Reduced visibility due to atmospheric fog.',
        category: 'fog',
      };
    case 48:
      return {
        label: 'Depositing Rime Fog',
        description: 'Freezing fog depositing frosty ice crystals.',
        category: 'fog',
      };
    case 51:
      return {
        label: 'Light Drizzle',
        description: 'Fine, gentle droplets drifting intermittently.',
        category: 'drizzle',
      };
    case 53:
      return {
        label: 'Moderate Drizzle',
        description: 'Steady light drizzle across the area.',
        category: 'drizzle',
      };
    case 55:
      return {
        label: 'Dense Drizzle',
        description: 'Continuous heavy drizzle limiting visibility.',
        category: 'drizzle',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Sub-zero drizzle creating slippery glaze surfaces.',
        category: 'drizzle',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Intermittent gentle rain showers.',
        category: 'rain',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady rainfall across the area.',
        category: 'rain',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Intense downpour with rapid accumulation.',
        category: 'rain',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Cold liquid precipitation freezing immediately upon impact.',
        category: 'rain',
      };
    case 71:
      return {
        label: 'Slight Snow',
        description: 'Light flurries dancing through the air.',
        category: 'snow',
      };
    case 73:
      return {
        label: 'Moderate Snow',
        description: 'Steady snowfall building up a clean white mantle.',
        category: 'snow',
      };
    case 75:
      return {
        label: 'Heavy Snow',
        description: 'Significant blizzard-like snowfall reducing visibility.',
        category: 'snow',
      };
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Small, opaque white ice particles falling gently.',
        category: 'snow',
      };
    case 80:
      return {
        label: 'Slight Rain Showers',
        description: 'Brief, passing rain showers with sunny breaks.',
        category: 'rain',
      };
    case 81:
      return {
        label: 'Moderate Rain Showers',
        description: 'Brisk passing shower spells.',
        category: 'rain',
      };
    case 82:
      return {
        label: 'Violent Rain Showers',
        description: 'Sudden, powerful torrential rain burst.',
        category: 'rain',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Brisk convective snow showers with windy gusts.',
        category: 'snow',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Lightning activity and electrical rumblings accompanied by rain.',
        category: 'thunderstorm',
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm with Hail',
        description: 'Severe electrical storm producing damaging hail pellets.',
        category: 'thunderstorm',
      };
    default:
      return {
        label: 'Fair Conditions',
        description: 'Standard atmospheric conditions.',
        category: 'clear',
      };
  }
}

/**
 * Returns a suitable Lucide Icon component for the weather condition.
 */
export function getWeatherIconComponent(
  code: number,
  isDay: boolean = true
): React.ComponentType<{ className?: string }> {
  switch (code) {
    case 0:
      return isDay ? Sun : Moon;
    case 1:
      return isDay ? Sun : Moon;
    case 2:
      return isDay ? CloudSun : CloudMoon;
    case 3:
      return Cloud;
    case 45:
    case 48:
      return CloudFog;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return CloudDrizzle;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return CloudRain;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return CloudSnow;
    case 95:
    case 96:
    case 99:
      return CloudLightning;
    default:
      return isDay ? Sun : Sparkles;
  }
}

/**
 * Helper to convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Formats a temperature in Celsius based on active unit preference
 */
export function formatTemp(tempC: number, unit: 'celsius' | 'fahrenheit'): string {
  const val = unit === 'fahrenheit' ? celsiusToFahrenheit(tempC) : tempC;
  return `${Math.round(val)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

/**
 * Formats windspeed with unit
 */
export function formatWindSpeed(kmh: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}
