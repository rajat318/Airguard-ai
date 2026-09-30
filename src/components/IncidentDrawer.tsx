import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Radio, 
  Satellite, 
  Wind, 
  ThumbsUp, 
  Activity,
  Layers,
  FileCheck
} from 'lucide-react';
import { 
  CitizenReport, 
  PollutionHotspot, 
  EnvironmentalSensor 
} from '../types/environmental';
import { formatTimeAgo, getAqiCategory, getProvenanceBadge } from '../utils/environmentalFormatters';
import { upvoteReport, createAuthorityAction } from '../services/api';

interface IncidentDrawerProps {
  selectedReport?: CitizenReport | null;
  selectedHotspot?: PollutionHotspot | null;
  selectedSensor?: EnvironmentalSensor | null;
  onClose: () => void;
  onActionCreated?: () => void;
  onOpenBriefing?: () => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({
  selectedReport,
  selectedHotspot,
  selectedSensor,
  onClose,
  onActionCreated,
  onOpenBriefing,
}) => {
  const [upvotes, setUpvotes] = useState<number>(selectedReport?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState('');

  if (!selectedReport && !selectedHotspot && !selectedSensor) return null;

  const handleUpvote = async () => {
    if (!selectedReport || hasUpvoted) return;
    try {
      const res = await upvoteReport(selectedReport.id);
      setUpvotes(res.upvotes);
      setHasUpvoted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDispatchAction = async (type: string, title: string) => {
    setIsDispatching(true);
    setDispatchSuccess('');
    try {
      await createAuthorityAction({
        hotspotId: selectedHotspot?.id,
        reportId: selectedReport?.id,
        title,
        type,
        priority: 'CRITICAL',
        dispatchedTo: 'Regional Rapid Clean Air Intervention Unit',
        notes: `Immediate action initiated from Incident Evidence Inspector for ${
          selectedHotspot?.name || selectedReport?.title || 'Sensor Alert'
        }.`,
      });
      setDispatchSuccess(`Action dispatched: ${title}`);
      if (onActionCreated) onActionCreated();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 transition-transform">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {selectedHotspot ? 'Detected Hotspot Cluster' : selectedReport ? 'Citizen Evidence Incident' : 'IoT Sensor Node'}
            </span>
            <h3 className="text-sm font-bold text-slate-100 truncate max-w-[280px]">
              {selectedHotspot?.name || selectedReport?.title || selectedSensor?.stationName}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {dispatchSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{dispatchSuccess}</span>
          </div>
        )}

        {/* 1. PHOTOGRAPHIC EVIDENCE (If Citizen Report or Hotspot with image) */}
        {selectedReport?.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-800 relative group">
            <img
              src={selectedReport.imageUrl}
              alt="Citizen Evidence"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-3">
              <div className="flex items-center justify-between w-full text-xs">
                <span className="bg-slate-900/90 text-cyan-300 px-2 py-0.5 rounded font-mono text-[10px] border border-cyan-500/30">
                  PHOTOGRAPHIC EVIDENCE
                </span>
                <span className="text-slate-300 text-[11px]">
                  {formatTimeAgo(selectedReport.timestamp)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. CORE METRICS STRIP */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400">Peak Air Quality</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-rose-400">
                {selectedHotspot?.currentAvgAqi || selectedSensor?.aqi || '176'}
              </span>
              <span className="text-xs text-slate-400">AQI</span>
            </div>
            <div className="text-[10px] text-rose-400 mt-1 font-medium">Unhealthy / Alert</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400">PM2.5 Concentration</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-100">
                {selectedHotspot?.pm25Peak || selectedSensor?.pm25 || selectedReport?.aiAnalysis?.estimatedPlumeRadiusKm ? '124.5' : '88.2'}
              </span>
              <span className="text-xs text-slate-400">µg/m³</span>
            </div>
            <div className="text-[10px] text-amber-400 mt-1">WHO 24h: 15 µg/m³</div>
          </div>
        </div>

        {/* 3. GEMINI 3.8 MULTIMODAL REASONING PANEL */}
        {(selectedReport?.aiAnalysis || selectedHotspot?.aiSummary) && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Gemini 3.8 Multimodal Reasoning
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                Confidence: {selectedReport?.aiAnalysis?.confidence || selectedHotspot?.confidence || 94}%
              </span>
            </div>

            {/* Incident Classification */}
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Diagnostic Classification
              </div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">
                {selectedReport?.aiAnalysis?.incidentType || selectedHotspot?.name}
              </div>
            </div>

            {/* Factual Summary */}
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Evidence Synthesis
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedReport?.aiAnalysis?.summary || selectedHotspot?.aiSummary}
              </p>
            </div>

            {/* Possible Contributors */}
            {selectedReport?.aiAnalysis?.possibleContributors && (
              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">
                  Probable Physical Contributors
                </div>
                <ul className="space-y-1">
                  {selectedReport.aiAnalysis.possibleContributors.map((c, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Downwind Affected Area & Plume Radius */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Estimated Plume Footprint</span>
                <div className="font-semibold text-slate-200 mt-0.5">
                  {selectedReport?.aiAnalysis?.affectedArea || 'Downwind corridor radius ~1.8 km'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Radius</span>
                <div className="font-bold text-rose-400">
                  {selectedReport?.aiAnalysis?.estimatedPlumeRadiusKm || selectedHotspot?.radiusKm || 1.6} km
                </div>
              </div>
            </div>

            {/* Citizen Advice vs Authority Advice */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs">
                <span className="font-bold text-teal-400 block mb-1">Community Protection Advice:</span>
                <p className="text-teal-200/90 leading-relaxed">
                  {selectedReport?.aiAnalysis?.citizenAdvice ||
                    'Keep windows and doors closed. Avoid vigorous outdoor physical exertion. Sensitive groups should remain indoors with HEPA air filtration active.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <span className="font-bold text-rose-400 block mb-1">Authority Statutory Guidance:</span>
                <p className="text-rose-200/90 leading-relaxed">
                  {selectedReport?.aiAnalysis?.authorityAdvice ||
                    'Dispatch field environmental compliance officer with handheld optical particle counter to conduct stack opacity verification.'}
                </p>
              </div>
            </div>

            {/* Scientific Transparency & Limitations */}
            {selectedReport?.aiAnalysis?.limitations && (
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block mb-1">Uncertainties & Limitations:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                  {selectedReport.aiAnalysis.limitations.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 4. SATELLITE LAYER CORROBORATION (Sentinel-5P simulated) */}
        {selectedHotspot?.satelliteObservation && (
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Satellite className="w-4 h-4" />
                <span>Sentinel-5P TROPOMI Corroboration</span>
              </div>
              <span className="text-[10px] text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/20">
                [SIMULATED OBSERVATION]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
              <div>
                <span className="text-[10px] text-slate-400">NO₂ Tropospheric Column:</span>
                <div className="font-bold text-indigo-300">
                  {selectedHotspot.satelliteObservation.no2TroposphericColumn} × 10¹⁵ molec/cm²
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Aerosol Optical Depth (AOD):</span>
                <div className="font-bold text-indigo-300">
                  {selectedHotspot.satelliteObservation.aerosolOpticalDepth}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CITIZEN UPVOTES */}
        {selectedReport && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-slate-400">Community Corroboration:</span>
            <button
              onClick={handleUpvote}
              disabled={hasUpvoted}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                hasUpvoted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{upvotes} Upvotes</span>
            </button>
          </div>
        )}

        {/* 6. RAPID INTERVENTION ACTIONS (For Authorities & Responders) */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Initiate Rapid Authority Interventions
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() =>
                handleDispatchAction(
                  'DISPATCH_INSPECTION',
                  `Emergency Stack & Fugitive Emission Inspection at ${
                    selectedHotspot?.name || selectedReport?.title || 'Corridor'
                  }`
                )
              }
              disabled={isDispatching}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-900/60 to-red-900/60 hover:from-rose-800/70 hover:to-red-800/70 border border-rose-500/40 text-slate-100 text-xs font-semibold transition text-left group"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition" />
                <span>Dispatch Mobile Inspection Unit (Air Quality Enforcement)</span>
              </div>
              <span className="text-[10px] text-rose-300 font-mono">PRIORITY 1</span>
            </button>

            <button
              onClick={() =>
                handleDispatchAction(
                  'BROADCAST_ADVISORY',
                  `Clean Air Community Health Alert for ${
                    selectedHotspot?.district || selectedReport?.location.district || 'District'
                  }`
                )
              }
              disabled={isDispatching}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition text-left"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Broadcast Local Health Advisory to Schools & Residents</span>
              </div>
              <span className="text-[10px] text-slate-400">PUBLIC PUSH</span>
            </button>

            <button
              onClick={() =>
                handleDispatchAction(
                  'MIST_CANNON_DEPLOYMENT',
                  `Deploy High-Pressure Water Mist Cannons for Particulate Suppression`
                )
              }
              disabled={isDispatching}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition text-left"
            >
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <span>Deploy Mobile Dust / Soot Mist Suppression Unit</span>
              </div>
              <span className="text-[10px] text-slate-400">PHYSICAL</span>
            </button>

            {onOpenBriefing && (
              <button
                onClick={onOpenBriefing}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400 text-xs font-semibold transition text-left"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Generate Official Regulatory Dossier (Print / PDF)</span>
                </div>
                <span className="text-[10px] text-slate-400">COMPLIANCE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
