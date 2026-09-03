/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastCards } from './components/ForecastCards';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { PlanningCard } from './components/PlanningCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorAlert } from './components/ErrorAlert';
import {
  CurrentWeather,
  DayForecast,
  PlanningRecommendations,
  TemperatureUnit,
} from './types';
import {
  searchLocation,
  fetchWeatherForecast,
  reverseGeocodeCoordinates,
} from './services/weatherApi';
import { generateRecommendations } from './utils/recommendations';

const DEFAULT_CITY = 'San Francisco';

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [cityName, setCityName] = useState<string>('');
  const [countryName, setCountryName] = useState<string>('');
  const [adminRegion, setAdminRegion] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayForecast | null>(null);
  const [recommendations, setRecommendations] = useState<PlanningRecommendations | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  // Helper to parse 7-day forecast raw data
  const parseDailyForecast = (daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  }): DayForecast[] => {
    const list: DayForecast[] = [];
    const limit = Math.min(7, daily.time.length);

    for (let i = 0; i < limit; i++) {
      const dateStr = daily.time[i];
      const dateObj = new Date(`${dateStr}T00:00:00`);
      const isToday = i === 0;

      list.push({
        date: dateStr,
        dayName: isToday ? 'Today' : dateObj.toLocaleDateString(undefined, { weekday: 'short' }),
        formattedDate: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        weatherCode: daily.weathercode[i],
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
        precipitation: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
        isToday,
      });
    }

    return list;
  };

  // Main fetch function by coordinates
  const loadWeatherData = useCallback(
    async (
      lat: number,
      lon: number,
      resolvedCity: string,
      resolvedCountry: string,
      resolvedAdmin?: string
    ) => {
      try {
        const forecastData = await fetchWeatherForecast(lat, lon);
        const parsedForecast = parseDailyForecast(forecastData.daily);

        setCurrentWeather(forecastData.current_weather);
        setForecasts(parsedForecast);
        setSelectedDay(parsedForecast[0] || null);

        // Compute recommendations based on current weather + today's forecast
        const recs = generateRecommendations(forecastData.current_weather, parsedForecast[0]);
        setRecommendations(recs);

        setCityName(resolvedCity);
        setCountryName(resolvedCountry);
        setAdminRegion(resolvedAdmin || '');
        setCoordinates({ lat, lon });
        setLastUpdated(new Date());
        setErrorMessage(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Unable to retrieve weather forecast data at this time.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Search city handler
  const handleSearchCity = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a city name to search.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const results = await searchLocation(trimmed, 1);
      if (!results || results.length === 0) {
        throw new Error('City not found. Please try another search.');
      }

      const match = results[0];
      await loadWeatherData(
        match.latitude,
        match.longitude,
        match.name,
        match.country,
        match.admin1
      );
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('City not found. Please try another search.');
      }
    }
  };

  // Geolocation trigger handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        setIsLoading(true);
        const { latitude, longitude } = pos.coords;

        try {
          const geo = await reverseGeocodeCoordinates(latitude, longitude);
          await loadWeatherData(latitude, longitude, geo.city, geo.country);
        } catch {
          await loadWeatherData(latitude, longitude, 'Current Location', '');
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Unable to access your location. Please enter a city manually.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please search for a city using the search bar.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Refresh current city
  const handleRefresh = () => {
    if (coordinates && cityName) {
      setIsRefreshing(true);
      loadWeatherData(
        coordinates.lat,
        coordinates.lon,
        cityName,
        countryName,
        adminRegion
      );
    } else {
      handleSearchCity(DEFAULT_CITY);
    }
  };

  // Load initial default city on mount
  useEffect(() => {
    handleSearchCity(DEFAULT_CITY);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Immersive Atmospheric Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[radial-gradient(circle,rgba(30,58,138,0.35)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(14,116,144,0.22)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* Top Header */}
      <Header
        unit={unit}
        onToggleUnit={setUnit}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Search Bar Section */}
        <section aria-label="City Search">
          <SearchBar
            onSearch={handleSearchCity}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoading={isLoading && !isRefreshing}
            isLocating={isLocating}
          />
        </section>

        {/* Visible Error Notification */}
        {errorMessage && (
          <ErrorAlert
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            onRetry={handleRefresh}
          />
        )}

        {/* Dynamic Weather Content or Loading Skeleton */}
        {isLoading && !currentWeather ? (
          <LoadingSkeleton />
        ) : currentWeather && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. Current Weather Card */}
            <section aria-label="Current Weather Conditions">
              <CurrentWeatherCard
                cityName={cityName}
                countryName={countryName}
                adminRegion={adminRegion}
                current={currentWeather}
                todayForecast={forecasts[0]}
                unit={unit}
              />
            </section>

            {/* 2. 7-Day Daily Forecast Cards */}
            {forecasts.length > 0 && (
              <section aria-label="7-Day Daily Forecast">
                <ForecastCards
                  forecasts={forecasts}
                  unit={unit}
                  selectedDate={selectedDay?.date}
                  onSelectDay={(day) => setSelectedDay(day)}
                />
              </section>
            )}

            {/* 3. Interactive Visual Temperature Trend Chart */}
            {forecasts.length > 0 && (
              <section aria-label="Temperature Trend Chart">
                <TemperatureTrendChart
                  forecasts={forecasts}
                  unit={unit}
                  selectedDay={selectedDay || undefined}
                  onSelectDay={(day) => setSelectedDay(day)}
                />
              </section>
            )}

            {/* 4. Smart Planning Recommendations (Outfit, Umbrella alerts, Activities) */}
            {recommendations && (
              <section aria-label="Planning and Outfit Recommendations">
                <PlanningCard recommendations={recommendations} />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-slate-950/60 backdrop-blur-md py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Weather Intelligence • Real-time Meteorological Data</span>
          <span className="flex items-center gap-1.5">
            Powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors"
            >
              Open-Meteo
            </a>{' '}
            APIs
          </span>
        </div>
      </footer>
    </div>
  );
}
