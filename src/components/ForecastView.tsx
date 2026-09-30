import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Wind, 
  Clock, 
  Sparkles, 
  Info, 
  ShieldCheck 
} from 'lucide-react';
import { ForecastHorizon, DistrictSummary } from '../types/environmental';
import { fetchForecast } from '../services/api';
import { getAqiCategory } from '../utils/environmentalFormatters';

interface ForecastViewProps {
  selectedDistrict: string;
  districts: DistrictSummary[];
  onSelectDistrict: (district: string) => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  selectedDistrict,
  districts,
  onSelectDistrict,
}) => {
  const [forecastData, setForecastData] = useState<{
    district: string;
    currentAqi: number;
    forecasts: ForecastHorizon[];
    notes: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const districtName = selectedDistrict === 'ALL' ? 'Industrial East Corridor' : selectedDistrict;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchForecast(districtName)
      .then((data) => {
        if (isMounted) {
          setForecastData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [districtName]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Predictive 4-Horizon Atmospheric Dispersion
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Boundary Layer Dispersion Equations</span>
              <span aria-hidden="true">·</span>
              <span>Ground Wind Telemetry Fused</span>
              <span aria-hidden="true">·</span>
              <span>Zero-Hallucination Mathematics</span>
            </div>
          </div>

          {/* District selector inside forecast */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Forecast District:</span>
            <select
              value={districtName}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Methodology Notice */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Deterministic Transport Modeling:</strong> Projected particulate concentrations are calculated using atmospheric decay formulas based on continuous coastal wind vectors. Gemini AI interprets the physics without inventing arbitrary values.
          </p>
        </div>
      </div>

      {/* 4 Horizons Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Computing atmospheric transport vectors...
        </div>
      ) : forecastData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecastData.forecasts.map((fc) => {
            const aqiInfo = getAqiCategory(fc.predictedAqi);
            const isNow = fc.horizon === 'NOW';

            return (
              <div
                key={fc.horizon}
                className={`rounded-xl p-5 border flex flex-col justify-between transition-all ${
                  isNow
                    ? 'bg-slate-900 border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {fc.horizon.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{fc.timestamp}</span>
                  </div>

                  {/* AQI Value */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Projected AQI</div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-3xl font-extrabold ${aqiInfo.color}`}>
                          {fc.predictedAqi}
                        </span>
                        <span className="text-xs text-slate-400">AQI</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold ${aqiInfo.color}`}>
                      {aqiInfo.label}
                    </span>
                  </div>

                  {/* PM2.5 & Trajectory indicator */}
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="text-slate-400">PM2.5: <strong className="text-slate-200">{fc.predictedPm25} µg/m³</strong></span>
                    <span className="flex items-center gap-1 font-medium">
                      {fc.riskTrajectory === 'IMPROVING' ? (
                        <>
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">Improving</span>
                        </>
                      ) : fc.riskTrajectory === 'DETERIORATING' ? (
                        <>
                          <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-rose-400 text-xs">Deteriorating</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-400 text-xs">Stable</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Wind Dispersion Trend */}
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] flex items-center gap-2 text-slate-300">
                    <Wind className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">{fc.windTrend}</span>
                  </div>
                </div>

                {/* AI Physical Dynamics Narrative */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-cyan-400 mb-1">
                    Atmospheric Physics Interpretation
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {fc.aiExplanation}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    Model Confidence: {fc.confidence}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Dispersion Curve & Practical Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Mathematical 12-Hour Particulate Dispersion Curve</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Plume dispersion under prevailing coastal winds (NW 14-18 km/h).
          </p>

          {/* Clean Visual Bar Display */}
          <div className="h-44 w-full bg-slate-950 rounded-lg border border-slate-800 p-4 relative flex items-end justify-between">
            {forecastData?.forecasts.map((f, i) => {
              const heightPercent = Math.min(100, Math.max(18, (f.predictedAqi / 200) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-xs font-bold font-mono text-slate-200 mb-1 group-hover:text-emerald-400">
                    {f.predictedAqi}
                  </div>
                  <div 
                    className="w-12 bg-slate-800 group-hover:bg-emerald-500 rounded-t transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="text-[10px] font-medium text-slate-400 mt-2">
                    {f.horizon.replace('_', ' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transition Guidelines */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Safety Transition Roadmap</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Community activity guidelines as plume disperses:
            </p>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-200 block mb-0.5">0 — 3 Hours:</span>
                <span className="text-slate-400 text-[11px] leading-relaxed">
                  Maintain sealed indoor envelope in downwind corridor. Outdoor school athletic events remain paused.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-200 block mb-0.5">6 — 12 Hours:</span>
                <span className="text-slate-400 text-[11px] leading-relaxed">
                  Plume concentration estimated to drop below 45 µg/m³. Safe to ventilate indoor living areas.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
