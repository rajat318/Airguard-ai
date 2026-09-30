import React from 'react';
import { 
  Wind, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Bell, 
  Network, 
  PlusCircle, 
  Sparkles,
  Info,
  Radio,
  Sliders
} from 'lucide-react';
import { DistrictSummary } from '../types/environmental';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  districts: DistrictSummary[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onOpenReportModal: () => void;
  onOpenTransparencyModal: () => void;
  onOpenGuidedTour: () => void;
  onToggleSimulator: () => void;
  isSimulatorOpen: boolean;
  liveSensorsCount: number;
  activeHotspotsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  districts,
  selectedDistrict,
  onSelectDistrict,
  onOpenReportModal,
  onOpenTransparencyModal,
  onOpenGuidedTour,
  onToggleSimulator,
  isSimulatorOpen,
  liveSensorsCount,
  activeHotspotsCount,
}) => {
  const tabs = [
    { id: 'map', label: 'Spatial Map & Layers', icon: MapPin },
    { id: 'telemetry', label: 'Sensor Network Telemetry', icon: Activity },
    { id: 'reports', label: 'Citizen Evidence Reports', icon: AlertTriangle },
    { id: 'forecast', label: 'Predictive 4-Horizon Dispersion', icon: TrendingUp },
    { id: 'authority', label: 'Authority Response Command', icon: ShieldAlert },
    { id: 'alerts', label: 'Public Health Advisories', icon: Bell },
    { id: 'federated', label: 'Federated Mesh & Impact', icon: Network },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 text-slate-100">
      {/* Top Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity & System Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight text-white">
                AirGuard AI
              </h1>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-xs text-slate-400 font-medium">
                Track 2 Clean Air & Climate Resilience
              </span>
            </div>
            {/* Unboxed inline system health indicators (Anti-AI-slop: No pills) */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {liveSensorsCount} Stations Active
              </span>
              <span className="text-slate-600">·</span>
              {activeHotspotsCount > 0 ? (
                <span className="text-rose-400 font-medium">
                  {activeHotspotsCount} Critical Hotspots
                </span>
              ) : (
                <span className="text-slate-400">Normal Baseline</span>
              )}
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-slate-400 hidden sm:inline">
                Gemini 3.8 Multimodal Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* District Selector */}
          <div className="flex items-center">
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Metro Districts</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} (AQI {d.avgAqi})
                </option>
              ))}
            </select>
          </div>

          {/* Guided Story Tour Trigger */}
          <button
            onClick={onOpenGuidedTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 text-xs font-medium transition"
            title="Guided 12-Step Hackathon Walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Story Tour</span>
          </button>

          {/* Interactive Plume Simulator Toggle */}
          <button
            onClick={onToggleSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isSimulatorOpen
                ? 'bg-teal-950/80 border-teal-500 text-teal-300 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-700 text-slate-300'
            }`}
            title="Interactive Plume & Mist Cannon Sandbox"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            <span>Live Simulator</span>
          </button>

          {/* Scientific Transparency Info */}
          <button
            onClick={onOpenTransparencyModal}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition"
            title="Scientific Provenance & Zero-Hallucination Charter"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Segmented Tab Navigation (Clean functional buttons, zero pill fluff) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
