import React from 'react';
import {
  Wind,
  Droplets,
  ArrowUp,
  ArrowDown,
  Navigation2,
  Calendar,
  Clock,
  Compass,
} from 'lucide-react';
import { CurrentWeather, DayForecast, TemperatureUnit } from '../types';
import {
  formatTemp,
  formatWindSpeed,
  getWeatherCondition,
  getWeatherIconComponent,
} from '../utils/weatherCodes';

interface CurrentWeatherCardProps {
  cityName: string;
  countryName: string;
  adminRegion?: string;
  current: CurrentWeather;
  todayForecast?: DayForecast;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  cityName,
  countryName,
  adminRegion,
  current,
  todayForecast,
  unit,
}) => {
  const condition = getWeatherCondition(current.weathercode);
  const isDay = current.is_day !== undefined ? current.is_day === 1 : true;
  const WeatherIcon = getWeatherIconComponent(current.weathercode, isDay);

  const formattedTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl transition-all glow-blue"
    >
      {/* Immersive Background Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col justify-between gap-6">
        {/* Top bar: City & Date info */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {cityName}
              </h2>
              {countryName && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/10 text-slate-200 border border-white/10">
                  {countryName}
                </span>
              )}
            </div>

            {adminRegion && adminRegion !== cityName && (
              <p className="text-sm text-slate-400 font-medium mt-0.5">{adminRegion}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Condition Tag */}
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">{condition.label}</span>
          </div>
        </div>

        {/* Hero Section: Big Temperature & Weather Icon */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-6 pt-2 pb-2">
          {/* Main Temperature */}
          <div className="sm:col-span-7 flex items-baseline gap-4">
            <div className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white">
              {formatTemp(current.temperature, unit)}
            </div>

            {todayForecast && (
              <div className="flex flex-col gap-1 text-sm font-medium">
                <div className="flex items-center gap-1 text-rose-400">
                  <ArrowUp className="w-4 h-4" />
                  <span>High: {formatTemp(todayForecast.maxTemp, unit)}</span>
                </div>
                <div className="flex items-center gap-1 text-sky-400">
                  <ArrowDown className="w-4 h-4" />
                  <span>Low: {formatTemp(todayForecast.minTemp, unit)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Weather Icon & Condition Description */}
          <div className="sm:col-span-5 flex items-center gap-4 sm:justify-end">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg text-blue-400 backdrop-blur-md">
              <WeatherIcon className="w-12 h-12" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{condition.label}</p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xs">{condition.description}</p>
            </div>
          </div>
        </div>

        {/* Bottom Key Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
          {/* Wind Speed */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wind className="w-4 h-4 text-blue-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white mt-1">
              {formatWindSpeed(current.windspeed, unit)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <Navigation2
                className="w-3 h-3 text-slate-400"
                style={{ transform: `rotate(${current.winddirection}deg)` }}
              />
              <span>{Math.round(current.winddirection)}° direction</span>
            </div>
          </div>

          {/* Precipitation Today */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Droplets className="w-4 h-4 text-indigo-400" />
              <span>Precipitation</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white mt-1">
              {todayForecast ? `${todayForecast.precipitation.toFixed(1)} mm` : '0.0 mm'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">24-hour total</div>
          </div>

          {/* Atmospheric Profile */}
          <div className="col-span-2 sm:col-span-1 p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Sky Mode</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white mt-1 capitalize">
              {isDay ? 'Daytime' : 'Night'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">WMO Code {current.weathercode}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
