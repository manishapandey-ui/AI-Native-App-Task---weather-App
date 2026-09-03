import React, { useState } from 'react';
import { DayForecast, TemperatureUnit } from '../types';
import {
  formatTemp,
  celsiusToFahrenheit,
  getWeatherCondition,
  getWeatherIconComponent,
} from '../utils/weatherCodes';
import { Droplets, Info } from 'lucide-react';

interface TemperatureTrendChartProps {
  forecasts: DayForecast[];
  unit: TemperatureUnit;
  selectedDay?: DayForecast;
  onSelectDay?: (day: DayForecast) => void;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({
  forecasts,
  unit,
  selectedDay,
  onSelectDay,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!forecasts || forecasts.length === 0) {
    return null;
  }

  // Convert values based on unit
  const data = forecasts.map((f) => ({
    ...f,
    displayMax: unit === 'fahrenheit' ? celsiusToFahrenheit(f.maxTemp) : f.maxTemp,
    displayMin: unit === 'fahrenheit' ? celsiusToFahrenheit(f.minTemp) : f.minTemp,
  }));

  // Chart Dimensions
  const width = 800;
  const height = 300;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 40;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Min & Max calculations with margin
  const allMaxValues = data.map((d) => d.displayMax);
  const allMinValues = data.map((d) => d.displayMin);
  const rawMin = Math.min(...allMinValues);
  const rawMax = Math.max(...allMaxValues);
  const rangeMargin = Math.max(2, Math.ceil((rawMax - rawMin) * 0.15));

  const chartMin = Math.floor(rawMin - rangeMargin);
  const chartMax = Math.ceil(rawMax + rangeMargin);
  const chartRange = chartMax - chartMin || 1;

  // Helper coordinate getters
  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - ((val - chartMin) / chartRange) * chartHeight;
  };

  // Generate smooth SVG cubic Bézier path
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const maxPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.displayMax) }));
  const minPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.displayMin) }));

  const maxPath = createSmoothPath(maxPoints);
  const minPath = createSmoothPath(minPoints);

  // Area under curve paths
  const maxAreaPath = `${maxPath} L ${maxPoints[maxPoints.length - 1].x} ${
    paddingTop + chartHeight
  } L ${maxPoints[0].x} ${paddingTop + chartHeight} Z`;

  // Horizontal Grid Lines
  const gridTicksCount = 4;
  const gridTicks = Array.from({ length: gridTicksCount + 1 }, (_, i) => {
    const val = chartMin + (chartRange / gridTicksCount) * i;
    return {
      value: Math.round(val),
      y: getY(val),
    };
  });

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedDay ? forecasts.findIndex(f => f.date === selectedDay.date) : 0;
  const activeItem = data[activeIndex >= 0 ? activeIndex : 0];
  const activeCondition = activeItem ? getWeatherCondition(activeItem.weatherCode) : null;
  const ActiveIcon = activeItem ? getWeatherIconComponent(activeItem.weatherCode, true) : null;

  return (
    <div
      id="temperature-trend-chart-container"
      className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all glow-blue"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            7-Day Temperature Trend
          </h3>
          <p className="text-xs text-slate-400">
            Interactive daily high & low temperature comparison
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
            <span className="text-slate-300">Max Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 ring-2 ring-sky-400/30" />
            <span className="text-slate-300">Min Temp</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Stage */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Gradient for Max Temp Area */}
            <linearGradient id="maxTempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradient for Min Temp Area */}
            <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and labels */}
          {gridTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-400 font-mono font-medium"
              >
                {tick.value}°
              </text>
            </g>
          ))}

          {/* Vertical Guides for each day */}
          {data.map((_, i) => (
            <line
              key={`guide-${i}`}
              x1={getX(i)}
              y1={paddingTop}
              x2={getX(i)}
              y2={paddingTop + chartHeight}
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
            />
          ))}

          {/* Area Fills */}
          <path d={maxAreaPath} fill="url(#maxTempGradient)" />

          {/* Spline Lines */}
          <path
            d={maxPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={minPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Crosshair Line for Active Index */}
          {activeItem && (
            <line
              x1={getX(activeIndex)}
              y1={paddingTop - 10}
              x2={getX(activeIndex)}
              y2={paddingTop + chartHeight + 10}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="transition-all duration-150 pointer-events-none"
            />
          )}

          {/* Data Points */}
          {data.map((day, i) => {
            const mx = getX(i);
            const myMax = getY(day.displayMax);
            const myMin = getY(day.displayMin);
            const isActive = activeIndex === i;

            return (
              <g key={`points-${i}`}>
                {/* Max Temp Point */}
                <circle
                  cx={mx}
                  cy={myMax}
                  r={isActive ? 6 : 4}
                  fill="#0f172a"
                  stroke="#f43f5e"
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all duration-150 pointer-events-none"
                />

                {/* Min Temp Point */}
                <circle
                  cx={mx}
                  cy={myMin}
                  r={isActive ? 6 : 4}
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all duration-150 pointer-events-none"
                />

                {/* Day of Week Label on X Axis */}
                <text
                  x={mx}
                  y={height - 18}
                  textAnchor="middle"
                  className={`text-[12px] font-semibold transition-colors pointer-events-none ${
                    isActive ? 'fill-blue-400 font-bold' : 'fill-slate-300'
                  }`}
                >
                  {day.isToday ? 'Today' : day.dayName}
                </text>
                <text
                  x={mx}
                  y={height - 4}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-medium pointer-events-none"
                >
                  {day.formattedDate}
                </text>

                {/* Transparent Interactive Hover Column */}
                <rect
                  x={mx - chartWidth / (data.length * 2)}
                  y={0}
                  width={chartWidth / data.length}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onClick={() => onSelectDay?.(forecasts[i])}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Detail Strip below chart */}
        {activeItem && activeCondition && (
          <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              {ActiveIcon && (
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-blue-400 shadow-sm">
                  <ActiveIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{activeItem.isToday ? 'Today' : activeItem.dayName}</span>
                  <span className="text-slate-400 font-normal">({activeItem.formattedDate})</span>
                </div>
                <div className="text-slate-300">{activeCondition.label}</div>
              </div>
            </div>

            <div className="flex items-center gap-5 font-semibold">
              <div className="flex items-center gap-1 text-rose-400">
                <span>High:</span>
                <span className="text-sm font-bold">{formatTemp(activeItem.maxTemp, unit)}</span>
              </div>
              <div className="flex items-center gap-1 text-sky-400">
                <span>Low:</span>
                <span className="text-sm font-bold">{formatTemp(activeItem.minTemp, unit)}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-300 font-medium">
                <Droplets className="w-3.5 h-3.5" />
                <span>{activeItem.precipitation.toFixed(1)} mm precip</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 shrink-0 text-blue-400" />
        <span>Hover or tap any day to inspect exact temperatures and atmospheric outlook.</span>
      </div>
    </div>
  );
};
