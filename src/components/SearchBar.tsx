import React, { useState } from 'react';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';
import { GeocodingResult } from '../types';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onSelectResult?: (result: GeocodingResult) => void;
  onUseCurrentLocation?: () => void;
  isLoading: boolean;
  isLocating?: boolean;
}

const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom' },
  { name: 'New York', country: 'United States' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Paris', country: 'France' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Singapore', country: 'Singapore' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onUseCurrentLocation,
  isLoading,
  isLocating,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleQuickSelect = (cityName: string) => {
    setQuery(cityName);
    onSearch(cityName);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
            <Search className="w-5 h-5" />
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city (e.g., Paris, Tokyo, San Francisco, Mumbai)..."
            disabled={isLoading}
            className="w-full pl-11 pr-10 py-3 text-sm md:text-base bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg shadow-black/20 text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-slate-950/40 disabled:text-slate-500"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          id="search-submit-btn"
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0 border border-blue-400/30"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span>Search</span>
            </>
          )}
        </button>

        {/* Use Geolocation Button */}
        {onUseCurrentLocation && (
          <button
            id="use-my-location-btn"
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating || isLoading}
            title="Use current GPS location"
            aria-label="Use current location"
            className="inline-flex items-center justify-center p-3 text-slate-300 hover:text-white bg-slate-900/60 backdrop-blur-xl hover:bg-white/10 border border-white/10 active:bg-white/15 disabled:opacity-60 rounded-xl shadow-lg shadow-black/20 transition-all cursor-pointer shrink-0"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5 text-slate-300" />
            )}
          </button>
        )}
      </form>

      {/* Popular Quick-Select Pills */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-400" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            id={`quick-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={() => handleQuickSelect(city.name)}
            disabled={isLoading}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white hover:border-blue-400/40 border border-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
