import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="loading-weather-skeleton" className="space-y-6 animate-pulse w-full">
      {/* Current Weather Card Skeleton */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-white/10 rounded-lg" />
            <div className="h-4 w-32 bg-white/5 rounded-md" />
            <div className="h-3 w-40 bg-white/5 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-white/5 border border-white/10 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-3">
          <div className="sm:col-span-7 flex items-baseline gap-4">
            <div className="h-20 w-44 bg-white/10 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-20 bg-white/5 rounded-md" />
              <div className="h-4 w-20 bg-white/5 rounded-md" />
            </div>
          </div>
          <div className="sm:col-span-5 flex items-center gap-4 sm:justify-end">
            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/10 rounded-md" />
              <div className="h-3 w-36 bg-white/5 rounded-md" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
          <div className="h-16 bg-white/5 border border-white/10 rounded-xl" />
          <div className="h-16 bg-white/5 border border-white/10 rounded-xl" />
          <div className="col-span-2 sm:col-span-1 h-16 bg-white/5 border border-white/10 rounded-xl" />
        </div>
      </div>

      {/* 7-Day Forecast Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-36 bg-white/10 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-4 shadow-lg"
            >
              <div className="space-y-1">
                <div className="h-4 w-12 bg-white/10 rounded-md" />
                <div className="h-3 w-16 bg-white/5 rounded-md" />
              </div>
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl mx-auto" />
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="h-3 w-full bg-white/10 rounded-md" />
                <div className="h-1.5 w-full bg-white/5 rounded-full" />
                <div className="h-2.5 w-14 bg-white/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Chart Skeleton */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="h-5 w-48 bg-white/10 rounded-md" />
          <div className="h-4 w-32 bg-white/5 rounded-md" />
        </div>
        <div className="h-56 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
          <div className="h-2 w-full max-w-md bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
};
