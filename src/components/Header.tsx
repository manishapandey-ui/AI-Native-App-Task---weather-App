import React from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { TemperatureUnit } from '../types';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (newUnit: TemperatureUnit) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: Date;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) => {
  return (
    <header className="w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Weather<span className="text-blue-400">Intelligence</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Live Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Precise atmospheric forecasts & smart planning
            </p>
          </div>
        </div>

        {/* Actions & Unit Toggle */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-slate-400 hidden lg:inline-block font-mono">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* Refresh button */}
          <button
            id="header-refresh-btn"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh weather data"
            title="Refresh weather data"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* Celsius / Fahrenheit Switch */}
          <div
            id="unit-toggle-container"
            className="inline-flex items-center p-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md"
            role="radiogroup"
            aria-label="Temperature Unit"
          >
            <button
              id="unit-btn-celsius"
              type="button"
              role="radio"
              aria-checked={unit === 'celsius'}
              onClick={() => onToggleUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                unit === 'celsius'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="unit-btn-fahrenheit"
              type="button"
              role="radio"
              aria-checked={unit === 'fahrenheit'}
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                unit === 'fahrenheit'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
