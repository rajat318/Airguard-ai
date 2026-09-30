import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Info, 
  Cpu, 
  Database, 
  FileCheck2, 
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                AirGuard AI — Scientific Integrity & Transparency Charter
              </h3>
              <p className="text-xs text-slate-400">
                Adhering to Track 2: Clean Air & Climate Resilience Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs leading-relaxed text-slate-300">
          {/* Engineering Pipeline */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>Real Engineering Pipeline vs Fake AI Wrappers</span>
            </h4>
            <p className="text-slate-300 text-xs">
              AirGuard AI is not a generic chatbot. Gemini 3.8 never invents sensor measurements, AQI values, or geographical facts. The system operates on a validated multi-stage data fusion pipeline:
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-400">
              <span className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200">Sensor & Citizen Data</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200">Validation & Normalization</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200">Spatial Proximity Fusion</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200">Deterministic Anomaly Trigger</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="p-1.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">Gemini Multimodal Reasoning</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="p-1.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-bold">Authority Action & Alert</span>
            </div>
          </div>

          {/* Strict Provenance Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Data Provenance Classifications</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold block mb-1">
                  [OBSERVED_SENSOR]
                </span>
                <p className="text-[11px] text-slate-400">
                  Continuous calibrated optical/electrochemical telemetry from physical IoT hardware monitors.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 text-[10px] font-bold block mb-1">
                  [CITIZEN_REPORT]
                </span>
                <p className="text-[11px] text-slate-400">
                  Crowdsourced evidence submitted by community members with GPS stamps, photos, and voice notes.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 text-[10px] font-bold block mb-1">
                  [SIMULATED_DEMO]
                </span>
                <p className="text-[11px] text-slate-400">
                  Clearly disclosed simulation data (e.g. Sentinel-5P satellite raster adapter) for hackathon demonstration.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-bold block mb-1">
                  [FORECAST_MODEL]
                </span>
                <p className="text-[11px] text-slate-400">
                  Deterministic mathematical calculations based on atmospheric boundary physics and wind dispersion.
                </p>
              </div>
            </div>
          </div>

          {/* Model Safety & Non-Medical Advice */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            <strong className="block font-semibold mb-1 flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Public Health & Non-Medical Disclaimer</span>
            </strong>
            AirGuard AI provides environmental precautions and advisory guidance aligned with WHO and EPA air quality guidelines. The platform does not diagnose clinical conditions or provide individualized medical prescriptions.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Charter
          </button>
        </div>
      </div>
    </div>
  );
};
