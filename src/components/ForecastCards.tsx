import React from 'react';
import { Droplets, ArrowUp, ArrowDown } from 'lucide-react';
import { DayForecast, TemperatureUnit } from '../types';
import {
  formatTemp,
  getWeatherCondition,
  getWeatherIconComponent,
} from '../utils/weatherCodes';

interface ForecastCardsProps {
  forecasts: DayForecast[];
  unit: TemperatureUnit;
  selectedDate?: string;
  onSelectDay?: (day: DayForecast) => void;
}

export const ForecastCards: React.FC<ForecastCardsProps> = ({
  forecasts,
  unit,
  selectedDate,
  onSelectDay,
}) => {
  // Compute global min and max across all 7 days for relative visual bars
  const globalMin = Math.min(...forecasts.map((d) => d.minTemp));
  const globalMax = Math.max(...forecasts.map((d) => d.maxTemp));
  const tempSpread = Math.max(1, globalMax - globalMin);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-white">7-Day Forecast</h3>
        <span className="text-xs font-medium text-slate-400">
          Showing daily outlook & precipitation
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecasts.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode);
          const Icon = getWeatherIconComponent(day.weatherCode, true);
          const isSelected = selectedDate === day.date;

          // Calculate relative percentage positions for the mini temp bar
          const leftPercent = Math.max(0, ((day.minTemp - globalMin) / tempSpread) * 100);
          const rightPercent = Math.min(100, ((day.maxTemp - globalMin) / tempSpread) * 100);
          const widthPercent = Math.max(14, rightPercent - leftPercent);

          return (
            <div
              key={day.date}
              id={`forecast-card-day-${idx}`}
              onClick={() => onSelectDay?.(day)}
              className={`flex flex-col justify-between p-4 rounded-xl border backdrop-blur-xl transition-all cursor-pointer select-none text-left relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30'
                  : 'bg-slate-900/60 hover:bg-slate-800/60 border-white/10 hover:border-blue-500/40 shadow-md hover:shadow-blue-500/10'
              }`}
            >
              {day.isToday && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Today
                </span>
              )}

              {/* Day Header */}
              <div>
                <p className="text-sm font-bold text-white">
                  {day.isToday ? 'Today' : day.dayName}
                </p>
                <p className="text-xs text-slate-400">{day.formattedDate}</p>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-4 flex flex-col items-center justify-center text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-blue-400 mb-1.5 shadow-sm">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {condition.label}
                </span>
              </div>

              {/* Temperature High / Low */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-rose-400 flex items-center">
                    <ArrowUp className="w-3 h-3 inline mr-0.5" />
                    {formatTemp(day.maxTemp, unit)}
                  </span>
                  <span className="text-sky-400 flex items-center">
                    <ArrowDown className="w-3 h-3 inline mr-0.5" />
                    {formatTemp(day.minTemp, unit)}
                  </span>
                </div>

                {/* Relative Temperature Bar */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-sky-300 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                {/* Precipitation total */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    Rain
                  </span>
                  <span className={day.precipitation > 0 ? 'font-semibold text-blue-300' : 'text-slate-500'}>
                    {day.precipitation.toFixed(1)} mm
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
