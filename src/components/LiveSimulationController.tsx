import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Wind, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  Sparkles,
  Zap,
  Droplets
} from 'lucide-react';

interface LiveSimulationControllerProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateSpike: () => void;
  onSimulateMistSuppression: () => void;
  onResetBaseline: () => void;
  isSpiked: boolean;
  isSuppressed: boolean;
}

export const LiveSimulationController: React.FC<LiveSimulationControllerProps> = ({
  isOpen,
  onClose,
  onSimulateSpike,
  onSimulateMistSuppression,
  onResetBaseline,
  isSpiked,
  isSuppressed,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 z-40 w-80 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-slate-100 ring-1 ring-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Live Plume Simulator</h4>
            <p className="text-[10px] text-slate-400">Interactive Evaluator Sandbox</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 transition"
        >
          Hide
        </button>
      </div>

      {/* Simulator Actions */}
      <div className="py-3 space-y-2.5">
        {/* Scenario 1: Trigger Illegal Burn Spike */}
        <button
          onClick={onSimulateSpike}
          className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
            isSpiked
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
              : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-200 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center gap-2 text-left">
            <Zap className={`w-4 h-4 ${isSpiked ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <div>
              <div className="font-bold">1. Simulate Industrial Smoke Surge</div>
              <div className="text-[10px] text-slate-400">Spike PM2.5 to 195 µg/m³</div>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSpiked ? 'bg-rose-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
            {isSpiked ? 'ACTIVE' : 'RUN'}
          </span>
        </button>

        {/* Scenario 2: Deploy Mist Cannon Suppression */}
        <button
          onClick={onSimulateMistSuppression}
          className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
            isSuppressed
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
              : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-200 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center gap-2 text-left">
            <Droplets className={`w-4 h-4 ${isSuppressed ? 'text-cyan-400 animate-bounce' : 'text-slate-400'}`} />
            <div>
              <div className="font-bold">2. Deploy Mobile Mist Cannon</div>
              <div className="text-[10px] text-slate-400">Knock down PM2.5 by 35%</div>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSuppressed ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
            {isSuppressed ? 'SUPPRESSED' : 'RUN'}
          </span>
        </button>

        {/* Reset Baseline */}
        <button
          onClick={onResetBaseline}
          className="w-full p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Calibrated Baseline</span>
        </button>
      </div>

      {/* Live Status indicator */}
      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Continuous Sync Status:</span>
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Reactive Loop Enabled
        </span>
      </div>
    </div>
  );
};
