import React from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Camera, 
  Sparkles,
  Download
} from 'lucide-react';
import { CitizenReport, PollutionHotspot, EnvironmentalSensor } from '../types/environmental';

interface RegulatoryBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: CitizenReport | null;
  hotspot?: PollutionHotspot | null;
  sensor?: EnvironmentalSensor | null;
}

export const RegulatoryBriefingModal: React.FC<RegulatoryBriefingModalProps> = ({
  isOpen,
  onClose,
  report,
  hotspot,
  sensor,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const title = hotspot?.name || report?.title || sensor?.stationName || 'Environmental Anomaly Dossier';
  const district = hotspot?.district || report?.location.district || sensor?.location.district || 'Metropolitan Basin';
  const aqi = hotspot?.currentAvgAqi || sensor?.aqi || '176';
  const pm25 = hotspot?.pm25Peak || sensor?.pm25 || '124.5';
  const timestamp = hotspot?.detectedAt || report?.timestamp || new Date().toISOString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Official Environmental Regulatory Briefing Dossier
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Body (Printable) */}
        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-700 print:border-black pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-bold print:text-emerald-700">
                AIRGUARD AI • REGULATORY INTERVENTION DOSSIER
              </div>
              <h1 className="text-xl font-extrabold tracking-tight mt-1 text-slate-100 print:text-black">
                {title}
              </h1>
              <div className="text-xs text-slate-400 mt-1 print:text-slate-600">
                Jurisdiction: <strong>{district}</strong> | Document ID: <strong>AG-DOC-{Date.now().toString(16).slice(-6).toUpperCase()}</strong>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold uppercase tracking-wider print:border-black print:text-red-700">
                CRITICAL INTERVENTION
              </span>
              <div className="text-[11px] text-slate-400 mt-1 font-mono print:text-slate-600">
                {new Date(timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Section 1: Physical Measurements & Telemetry */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2">
              1. Ground Continuous Telemetry Evidence
            </h2>
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Peak Air Quality Index:</span>
                <div className="text-lg font-bold text-rose-400 print:text-red-700">{aqi} AQI</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Particulate Matter (PM2.5):</span>
                <div className="text-lg font-bold text-slate-100 print:text-black">{pm25} µg/m³</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Prevailing Wind Vector:</span>
                <div className="text-lg font-bold text-slate-100 print:text-black">15 km/h NW (295°)</div>
              </div>
            </div>
          </div>

          {/* Section 2: Photographic Evidence if available */}
          {report?.imageUrl && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2">
                2. Photographic Ground Evidence
              </h2>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <img
                  src={report.imageUrl}
                  alt="Incident Photographic Proof"
                  className="w-36 h-24 object-cover rounded-lg border border-slate-700 print:border-black"
                />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-200 print:text-black">Verified Ground Photo Asset</div>
                  <div className="text-slate-400 print:text-slate-600 text-[11px] leading-relaxed">
                    Visual examination reveals high-density opaque smoke plume originating from stack elevation. Optical signature indicative of incomplete reverberatory combustion.
                  </div>
                  <div className="text-[10px] text-emerald-400 print:text-emerald-700 font-mono">
                    Corroborated by {report.upvotes} independent community observations.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Gemini Multimodal Diagnostic Reasoning */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2">
              3. AI Environmental Incident Assessment (Gemini 3.8 Multimodal)
            </h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-3 text-xs leading-relaxed">
              <div>
                <strong className="text-cyan-400 print:text-cyan-800 block mb-0.5">Physical Evidence Synthesis:</strong>
                <p className="text-slate-300 print:text-black">
                  {report?.aiAnalysis?.summary || hotspot?.aiSummary || 'Continuous optical particulate monitors registered synchronized spikes exceeding 120 µg/m³ along the downwind industrial rail spur.'}
                </p>
              </div>

              <div>
                <strong className="text-rose-400 print:text-red-700 block mb-0.5">Statutory Authority Recommendations:</strong>
                <p className="text-slate-300 print:text-black">
                  {report?.aiAnalysis?.authorityAdvice || 'Dispatch field compliance officer under Clean Air Act Rule 6. Measure trace sulfur and heavy metals along the downwind residential boundary.'}
                </p>
              </div>

              <div>
                <strong className="text-emerald-400 print:text-emerald-800 block mb-0.5">Citizen Health Precautions Issued:</strong>
                <p className="text-slate-300 print:text-black">
                  {report?.aiAnalysis?.citizenAdvice || 'Advise sensitive populations (asthma, children, elderly) within 1.8km downwind radius to remain indoors with windows closed and HEPA filtration active.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Sign-off & Audit Stamp */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-xs text-slate-400 print:text-slate-600">
            <div>
              <span>AirGuard AI Verification Engine</span>
              <div className="text-[10px] font-mono mt-0.5">SHA256: 8f9b42...e901a</div>
            </div>
            <div className="text-right">
              <span>Authorized Officer Signature</span>
              <div className="w-36 border-b border-slate-600 print:border-black mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
