import React from 'react';
import {
  Shirt,
  Umbrella,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Activity,
  Sparkles,
} from 'lucide-react';
import { PlanningRecommendations } from '../types';

interface PlanningCardProps {
  recommendations: PlanningRecommendations;
}

export const PlanningCard: React.FC<PlanningCardProps> = ({ recommendations }) => {
  const { summaryTitle, summaryText, outfitAdvice, alerts, activities } = recommendations;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ideal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Ideal
          </span>
        );
      case 'Good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" /> Good
          </span>
        );
      case 'Caution':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Caution
          </span>
        );
      case 'Not Recommended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Not Advised
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="planning-recommendations-card"
      className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-7 shadow-2xl transition-all space-y-6 glow-blue"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">
              Planning & Lifestyle Intelligence
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic clothing suggestions and activity viability based on current atmospheric conditions
          </p>
        </div>
      </div>

      {/* Active Weather Advisories / Umbrella alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2.5">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-sm backdrop-blur-sm ${
                alert.type === 'warning'
                  ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                  : alert.type === 'caution'
                  ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                  : 'bg-blue-950/40 border-blue-500/30 text-blue-200'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {alert.title.toLowerCase().includes('precip') ||
                alert.title.toLowerCase().includes('rain') ? (
                  <Umbrella className="w-4 h-4 text-blue-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="font-semibold">{alert.title}: </span>
                <span className="opacity-90">{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two Column Layout: Outfit Guidance & Activity Suitability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outfit Recommendation */}
        <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-blue-400 shadow-sm">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{outfitAdvice.heading}</h4>
                <p className="text-xs text-slate-400">{summaryTitle}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {outfitAdvice.suggestion}
            </p>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Recommended Attire Checklist:
              </p>
              <ul className="space-y-1.5">
                {outfitAdvice.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>{summaryText}</span>
          </div>
        </div>

        {/* Activity Viability */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Activity Suitability</h4>
              <p className="text-xs text-slate-400">Real-time outdoor exercise & mobility rating</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {activities.map((act, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white">{act.name}</span>
                  {getStatusBadge(act.status)}
                </div>
                <p className="text-xs text-slate-400 leading-normal">{act.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
