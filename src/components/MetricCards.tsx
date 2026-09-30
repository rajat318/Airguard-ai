import React from 'react';
import { 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  Gauge, 
  AlertCircle 
} from 'lucide-react';
import { EnvironmentalSensor, DistrictSummary } from '../types/environmental';
import { getAqiCategory } from '../utils/environmentalFormatters';

interface MetricCardsProps {
  sensors: EnvironmentalSensor[];
  selectedDistrict: string;
  districts: DistrictSummary[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  sensors,
  selectedDistrict,
  districts,
}) => {
  const relevantSensors = sensors.length > 0 ? sensors : [];
  const avgAqi = relevantSensors.length > 0
    ? Math.round(relevantSensors.reduce((acc, s) => acc + s.aqi, 0) / relevantSensors.length)
    : 75;

  const avgPm25 = relevantSensors.length > 0
    ? Math.round((relevantSensors.reduce((acc, s) => acc + s.pm25, 0) / relevantSensors.length) * 10) / 10
    : 24.5;

  const avgPm10 = relevantSensors.length > 0
    ? Math.round((relevantSensors.reduce((acc, s) => acc + s.pm10, 0) / relevantSensors.length) * 10) / 10
    : 45.2;

  const avgNo2 = relevantSensors.length > 0
    ? Math.round((relevantSensors.reduce((acc, s) => acc + s.no2, 0) / relevantSensors.length) * 10) / 10
    : 34.0;

  const avgTemp = relevantSensors.length > 0
    ? Math.round((relevantSensors.reduce((acc, s) => acc + s.temperature, 0) / relevantSensors.length) * 10) / 10
    : 21.8;

  const avgHumidity = relevantSensors.length > 0
    ? Math.round(relevantSensors.reduce((acc, s) => acc + s.humidity, 0) / relevantSensors.length)
    : 52;

  const avgWindSpeed = relevantSensors.length > 0
    ? Math.round((relevantSensors.reduce((acc, s) => acc + s.windSpeed, 0) / relevantSensors.length) * 10) / 10
    : 14.2;

  const windDir = relevantSensors[0]?.windDirectionCardinal || 'NW';
  const windDegrees = relevantSensors[0]?.windDirection || 300;
  const aqiInfo = getAqiCategory(avgAqi);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
      {/* Context Bar: Unboxed clean metadata (anti-slop rule) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">
            {selectedDistrict === 'ALL' ? 'Metropolitan Basin Environmental Status' : selectedDistrict}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>Observed Ground IoT Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>{relevantSensors.length} Stations Reporting</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Continuous 10s Sampling</span>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Ref: WHO Global Air Quality Guidelines
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* AQI Primary Hero Card */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Air Quality Index</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-extrabold tracking-tight ${aqiInfo.color}`}>
                {avgAqi}
              </span>
              <span className="text-xs text-slate-400 font-mono">AQI</span>
              <span className={`text-xs font-semibold ml-auto ${aqiInfo.color}`}>
                {aqiInfo.label}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 leading-snug">
              {aqiInfo.description}
            </p>
          </div>
        </div>

        {/* Fine Particulate PM2.5 */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Fine Particulate (PM2.5)</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-100">{avgPm25}</span>
              <span className="text-xs text-slate-400 font-mono">µg/m³</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">WHO 24h: 15 µg/m³</span>
            <span className={avgPm25 > 15 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
              {avgPm25 > 15 ? `${Math.round((avgPm25 / 15) * 10) / 10}× threshold` : 'Optimal'}
            </span>
          </div>
        </div>

        {/* Coarse Dust PM10 */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Coarse Dust (PM10)</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-100">{avgPm10}</span>
              <span className="text-xs text-slate-400 font-mono">µg/m³</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">WHO 24h: 45 µg/m³</span>
            <span className={avgPm10 > 45 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
              {avgPm10 > 45 ? 'Elevated' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Nitrogen Dioxide NO2 */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Nitrogen Dioxide (NO2)</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-100">{avgNo2}</span>
              <span className="text-xs text-slate-400 font-mono">ppb</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Combustion & Exhaust</span>
            <span className={avgNo2 > 50 ? 'text-rose-400 font-medium' : 'text-slate-300 font-medium'}>
              {avgNo2 > 50 ? 'Heavy Exhaust' : 'Moderate'}
            </span>
          </div>
        </div>
      </div>

      {/* Meteorological Dispersion Strip */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-teal-400" />
          <span>Wind: <strong>{avgWindSpeed} km/h {windDir}</strong> ({windDegrees}°)</span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <span>Temp: <strong>{avgTemp} °C</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-400" />
          <span>Humidity: <strong>{avgHumidity}%</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-purple-400" />
          <span>Pressure: <strong>1013.8 hPa</strong></span>
        </div>
      </div>
    </div>
  );
};
