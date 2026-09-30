import React, { useState } from 'react';
import { 
  MapPin, 
  Radio, 
  AlertTriangle, 
  Wind, 
  Satellite, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Camera,
  Sliders,
  Crosshair
} from 'lucide-react';
import { 
  EnvironmentalSensor, 
  CitizenReport, 
  PollutionHotspot 
} from '../types/environmental';
import { getAqiCategory } from '../utils/environmentalFormatters';

interface EnvironmentalMapProps {
  sensors: EnvironmentalSensor[];
  reports: CitizenReport[];
  hotspots: PollutionHotspot[];
  onSelectSensor: (sensor: EnvironmentalSensor) => void;
  onSelectReport: (report: CitizenReport) => void;
  onSelectHotspot: (hotspot: PollutionHotspot) => void;
  selectedDistrict: string;
}

export const EnvironmentalMap: React.FC<EnvironmentalMapProps> = ({
  sensors,
  reports,
  hotspots,
  onSelectSensor,
  onSelectReport,
  onSelectHotspot,
  selectedDistrict,
}) => {
  // Layer toggles
  const [showSensors, setShowSensors] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showSatellite, setShowSatellite] = useState(true);
  const [showWindVectors, setShowWindVectors] = useState(true);
  const [satelliteOpacity, setSatelliteOpacity] = useState(0.65);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string } | null>(null);

  // Map coordinate boundary projection:
  // Center roughly at 37.77, -122.41 (Lat min 37.730, max 37.820; Lng min -122.465, max -122.370)
  const minLat = 37.730;
  const maxLat = 37.820;
  const minLng = -122.465;
  const maxLng = -122.370;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(4, Math.min(96, y))
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const lat = maxLat - yRatio * (maxLat - minLat);
    const lng = minLng + xRatio * (maxLng - minLng);

    setCursorCoords({
      lat: lat.toFixed(4),
      lng: lng.toFixed(4)
    });
  };

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[620px]">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Controls Bar (Segmented button design) */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-md pointer-events-auto text-xs">
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition ${
              showSensors 
                ? 'bg-slate-800 text-emerald-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sensors ({sensors.length})</span>
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition ${
              showHotspots 
                ? 'bg-slate-800 text-rose-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hotspots ({hotspots.length})</span>
          </button>

          <button
            onClick={() => setShowReports(!showReports)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition ${
              showReports 
                ? 'bg-slate-800 text-cyan-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Citizen Reports ({reports.length})</span>
          </button>

          <button
            onClick={() => setShowSatellite(!showSatellite)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition ${
              showSatellite 
                ? 'bg-slate-800 text-purple-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Sentinel-5P NO₂</span>
          </button>

          <button
            onClick={() => setShowWindVectors(!showWindVectors)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition ${
              showWindVectors 
                ? 'bg-slate-800 text-teal-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Vectors</span>
          </button>
        </div>

        {/* Top Right: Real-time Coordinate HUD & Zoom */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {cursorCoords && (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>{cursorCoords.lat}° N, {cursorCoords.lng}° W</span>
            </div>
          )}

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/95 border border-slate-700/80 shadow-md text-xs">
            <button
              onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.1))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Geospatial Viewport */}
      <div 
        onMouseMove={handleMouseMove}
        className="relative flex-1 w-full h-full overflow-hidden bg-[#070b14] cursor-crosshair"
      >
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SVG Vector Map */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tacticalGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(51, 65, 85, 0.14)" strokeWidth="0.75" />
              </pattern>

              <radialGradient id="hotspotPlumeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(244, 63, 94, 0.45)" />
                <stop offset="40%" stopColor="rgba(249, 115, 22, 0.25)" />
                <stop offset="85%" stopColor="rgba(234, 179, 8, 0.08)" />
                <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
              </radialGradient>

              <radialGradient id="satelliteHeatGradient" cx="72%" cy="38%" r="48%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.35)" />
                <stop offset="40%" stopColor="rgba(236, 72, 153, 0.22)" />
                <stop offset="80%" stopColor="rgba(59, 130, 246, 0.08)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </radialGradient>
            </defs>

            {/* Tactical Grid */}
            <rect width="100%" height="100%" fill="url(#tacticalGrid)" />

            {/* Waterway / Bay Coastline */}
            <path
              d="M 780 0 Q 750 180 730 320 T 710 600 L 1000 600 L 1000 0 Z"
              fill="rgba(15, 23, 42, 0.9)"
              stroke="rgba(30, 41, 59, 0.9)"
              strokeWidth="2"
            />
            <text x="830" y="220" fill="rgba(71, 85, 105, 0.7)" fontSize="11" letterSpacing="3" fontWeight="bold">
              SAN FRANCISCO BAY WATERWAY
            </text>

            {/* District Boundaries */}
            {/* Industrial East */}
            <rect 
              x="62%" y="22%" width="22%" height="45%" rx="8"
              fill="rgba(244, 63, 94, 0.03)"
              stroke="rgba(244, 63, 94, 0.25)"
              strokeDasharray="3 3"
            />
            <text x="63%" y="26%" fill="rgba(244, 63, 94, 0.85)" fontSize="10" fontWeight="bold" letterSpacing="1">
              DISTRICT: INDUSTRIAL EAST CORRIDOR
            </text>

            {/* Central Urban */}
            <rect 
              x="30%" y="20%" width="30%" height="40%" rx="8"
              fill="rgba(59, 130, 246, 0.03)"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeDasharray="3 3"
            />
            <text x="32%" y="24%" fill="rgba(96, 165, 250, 0.8)" fontSize="10" fontWeight="bold" letterSpacing="1">
              DISTRICT: CENTRAL URBAN CORE
            </text>

            {/* Southern Port */}
            <rect 
              x="55%" y="68%" width="25%" height="24%" rx="8"
              fill="rgba(245, 158, 11, 0.03)"
              stroke="rgba(245, 158, 11, 0.2)"
              strokeDasharray="3 3"
            />
            <text x="56%" y="72%" fill="rgba(251, 191, 36, 0.8)" fontSize="10" fontWeight="bold" letterSpacing="1">
              DISTRICT: SOUTHERN LOGISTICS PORT
            </text>

            {/* Major Arterial Roads */}
            <path d="M 0 350 Q 400 340 730 330" fill="none" stroke="rgba(71, 85, 105, 0.35)" strokeWidth="2.5" />
            <path d="M 450 0 L 450 600" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="2" />
            <path d="M 680 0 L 680 600" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="2" />

            {/* Satellite Sentinel-5P Layer with Opacity Control */}
            {showSatellite && (
              <g style={{ opacity: satelliteOpacity }} className="transition-opacity duration-300">
                <rect width="100%" height="100%" fill="url(#satelliteHeatGradient)" />
                <text x="64%" y="49%" fill="rgba(192, 132, 252, 0.7)" fontSize="10" letterSpacing="2" fontWeight="600">
                  SENTINEL-5P NO₂ COLUMN RETRIEVAL: 18.4 × 10¹⁵ molec/cm² [SIMULATED]
                </text>
              </g>
            )}

            {/* Wind Vector Arrows */}
            {showWindVectors && (
              <g className="text-teal-400/40 opacity-70">
                {[
                  { x: 180, y: 120 }, { x: 340, y: 140 }, { x: 520, y: 130 },
                  { x: 220, y: 280 }, { x: 420, y: 300 }, { x: 600, y: 270 },
                  { x: 260, y: 440 }, { x: 480, y: 460 }, { x: 640, y: 430 },
                ].map((pt, i) => (
                  <g key={i} transform={`translate(${pt.x}, ${pt.y}) rotate(115)`}>
                    <line x1="0" y1="0" x2="26" y2="0" stroke="rgba(45, 212, 191, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <polygon points="26,-3 32,0 26,3" fill="rgba(45, 212, 191, 0.7)" />
                  </g>
                ))}
              </g>
            )}

            {/* Hotspots */}
            {showHotspots && hotspots.map((h) => {
              const pos = project(h.center.lat, h.center.lng);
              return (
                <g key={h.id} className="cursor-pointer" onClick={() => onSelectHotspot(h)}>
                  <ellipse
                    cx={`${pos.x}%`}
                    cy={`${pos.y}%`}
                    rx={h.radiusKm * 48}
                    ry={h.radiusKm * 34}
                    transform={`rotate(25, ${pos.x * 8}, ${pos.y * 5})`}
                    fill="url(#hotspotPlumeGrad)"
                    className="animate-pulse"
                  />
                  <circle
                    cx={`${pos.x}%`}
                    cy={`${pos.y}%`}
                    r="8"
                    fill="rgba(239, 68, 68, 0.9)"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>

          {/* IoT Sensor Markers */}
          {showSensors && sensors.map((sensor) => {
            const pos = project(sensor.location.lat, sensor.location.lng);
            const aqiData = getAqiCategory(sensor.aqi);
            const isAlert = sensor.status === 'ALERT';

            return (
              <div
                key={sensor.id}
                onClick={() => onSelectSensor(sensor)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform hover:scale-110"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {isAlert && (
                  <span className="absolute -inset-1 rounded-md bg-rose-500 opacity-60 animate-ping" />
                )}

                <div className={`relative px-2 py-1 rounded shadow-md border backdrop-blur-md flex items-center gap-1.5 transition-all ${
                  isAlert 
                    ? 'bg-rose-950/90 border-rose-500 text-rose-200' 
                    : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-emerald-500'
                }`}>
                  <Radio className={`w-3 h-3 ${isAlert ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                  <span className={`text-xs font-bold font-mono ${aqiData.color}`}>
                    {sensor.aqi}
                  </span>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                  <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2.5 shadow-xl text-xs w-52">
                    <div className="font-semibold text-emerald-400 truncate">{sensor.stationName}</div>
                    <div className="text-[11px] text-slate-400">{sensor.location.district}</div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[11px]">
                      <span>AQI: <strong className={aqiData.color}>{sensor.aqi}</strong></span>
                      <span>PM2.5: <strong>{sensor.pm25} µg</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Citizen Report Pins */}
          {showReports && reports.map((report) => {
            const pos = project(report.location.lat, report.location.lng);
            const isCritical = report.severity === 'CRITICAL';

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="absolute z-15 -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform hover:scale-110"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className={`p-1.5 rounded-full border shadow-md flex items-center justify-center transition-all ${
                  isCritical 
                    ? 'bg-rose-500 text-slate-950 border-white ring-2 ring-rose-400/50' 
                    : 'bg-cyan-500 text-slate-950 border-white'
                }`}>
                  <Camera className="w-3 h-3" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                  <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2.5 shadow-xl text-xs w-56">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-cyan-400">Citizen Report</span>
                      <span className="text-[10px] text-rose-400 font-bold">{report.severity}</span>
                    </div>
                    <div className="font-medium text-slate-200 line-clamp-1 mt-1">{report.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>{report.location.district}</span>
                      <span>{report.upvotes} upvotes</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Map Bar: Legend + Satellite Opacity Slider */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
        {/* AQI Scale (Clean text markers) */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-400 font-medium">AQI Range:</span>
          <span className="text-emerald-400 font-mono">0-50 Good</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-400 font-mono">51-100 Moderate</span>
          <span className="text-slate-600">·</span>
          <span className="text-orange-400 font-mono">101-150 Sensitive</span>
          <span className="text-slate-600">·</span>
          <span className="text-rose-400 font-mono">151-200 Unhealthy</span>
          <span className="text-slate-600">·</span>
          <span className="text-purple-400 font-mono">201+ Hazardous</span>
        </div>

        {/* Satellite Opacity Slider */}
        {showSatellite && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Satellite Layer Opacity:</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={satelliteOpacity}
              onChange={(e) => setSatelliteOpacity(parseFloat(e.target.value))}
              className="w-20 accent-purple-400 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-purple-300 w-8">
              {Math.round(satelliteOpacity * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
