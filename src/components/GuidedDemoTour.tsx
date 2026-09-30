import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Radio, 
  TrendingUp, 
  ShieldAlert, 
  Bell, 
  Network,
  RotateCcw
} from 'lucide-react';

interface GuidedDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onTriggerPlumeSpike: () => void;
  onTriggerMistSuppression: () => void;
}

export const GuidedDemoTour: React.FC<GuidedDemoTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenReportModal,
  onTriggerPlumeSpike,
  onTriggerMistSuppression,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      stepNumber: 1,
      title: 'Step 1: Basin Baseline & Ground Sensor Network',
      tab: 'map',
      headline: 'Continuous Multi-Pollutant Monitoring',
      description: 'AirGuard AI continuously ingests real-time telemetry from calibrated optical particle counters and chemiluminescence stations across 5 metropolitan districts, tracking PM2.5, PM10, NO2, and coastal wind dispersion vectors.',
      actionText: 'View Spatial Map',
      action: () => onNavigateTab('map'),
      badge: 'MONITORING BASELINE',
      icon: Radio,
    },
    {
      stepNumber: 2,
      title: 'Step 2: Sentinel-5P Earth Observation Layer',
      tab: 'map',
      headline: 'Macro-Scale Atmospheric Trace Gas Corroboration',
      description: 'The spatial map integrates tropospheric NO2 column retrievals (modeled on Sentinel-5P TROPOMI satellite data). Crucially, this satellite layer is transparently marked as a simulated observation rather than fabricated ground truth.',
      actionText: 'Inspect Map Overlays',
      action: () => onNavigateTab('map'),
      badge: 'EARTH OBSERVATION',
      icon: MapPin,
    },
    {
      stepNumber: 3,
      title: 'Step 3: Citizen Incident Discovery & Photo Submission',
      tab: 'reports',
      headline: 'Crowdsourced Ground Evidence Capture',
      description: 'A community member spots an unpermitted heavy particulate plume billowing from a scrap smelting furnace stack. Using the Citizen Reporting form, they attach a geo-tagged photo, description, and voice transcript.',
      actionText: 'Open Citizen Report Form',
      action: () => {
        onNavigateTab('reports');
        onOpenReportModal();
      },
      badge: 'CROWDSOURCED EVIDENCE',
      icon: Camera,
    },
    {
      stepNumber: 4,
      title: 'Step 4: Spatial Telemetry Fusion & Spike Detection',
      tab: 'map',
      headline: 'Deterministic Sensor & Report Proximity Fusion',
      description: 'The citizen report is instantly corroborated with nearest ground monitor AQ-IND-881, which records a severe PM2.5 spike (124.5 µg/m³). Deterministic spatial clustering algorithms (< 2.5 km radius) trigger a high-priority hotspot alarm.',
      actionText: 'Simulate Industrial Plume Spike',
      action: () => {
        onNavigateTab('map');
        onTriggerPlumeSpike();
      },
      badge: 'DATA FUSION',
      icon: Radio,
    },
    {
      stepNumber: 5,
      title: 'Step 5: Gemini 3.8 Multimodal Incident Diagnostic',
      tab: 'map',
      headline: 'Zero-Hallucination Factual Evidence Synthesis',
      description: 'Gemini 3.8 analyzes the uploaded photograph and co-located sensor telemetry. It classifies the plume opacity, assesses public health risk as CRITICAL, calculates a 1.8 km downwind dispersion radius, and generates structured advice.',
      actionText: 'View Hotspot Evidence Dossier',
      action: () => onNavigateTab('map'),
      badge: 'GEMINI 3.8 MULTIMODAL',
      icon: Sparkles,
    },
    {
      stepNumber: 6,
      title: 'Step 6: 4-Horizon Atmospheric Dispersion Forecasting',
      tab: 'forecast',
      headline: 'Predictive Transport Modeling (Now, +3h, +6h, +12h)',
      description: 'Using verified meteorological wind vectors (15 km/h NW coastal breeze) and boundary-layer physics, the system models the particulate decay trajectory. Gemini provides human-readable physical interpretations without fabricating numbers.',
      actionText: 'View 4-Horizon Forecast',
      action: () => onNavigateTab('forecast'),
      badge: 'DISPERSION MODELING',
      icon: TrendingUp,
    },
    {
      stepNumber: 7,
      title: 'Step 7: Municipal Authority Dispatch & Intervention',
      tab: 'authority',
      headline: 'Rapid Closed-Loop Enforcement & Mobile Mist Suppression',
      description: 'In the Authority Response Command Center, municipal environmental inspectors dispatch rapid field teams with portable particle counters and deploy high-pressure water mist cannons to physically suppress airborne soot.',
      actionText: 'Deploy Mist Cannon Unit',
      action: () => {
        onNavigateTab('authority');
        onTriggerMistSuppression();
      },
      badge: 'RAPID INTERVENTION',
      icon: ShieldAlert,
    },
    {
      stepNumber: 8,
      title: 'Step 8: Public Health Alerts & School Guidance',
      tab: 'alerts',
      headline: 'Understandable Community Health Advisories',
      description: 'Community bulletins are automatically pushed to local schools and vulnerable residents (asthma, children, elderly). Advisories include clear indoor sealing precautions and N95 respirator guidance without unlicensed medical claims.',
      actionText: 'Inspect Public Advisories',
      action: () => onNavigateTab('alerts'),
      badge: 'COMMUNITY PROTECTION',
      icon: Bell,
    },
    {
      stepNumber: 9,
      title: 'Step 9: Closed-Loop Impact & Federated District Mesh',
      tab: 'federated',
      headline: 'Measurable Clean Air Impact & Cross-District Interoperability',
      description: 'The Impact Scorecard documents 14,200 residents protected, a 14.2-minute response velocity, and a 28.4% particulate reduction. A conceptual federated mesh demonstrates how neighboring districts share early warnings while preserving local data privacy.',
      actionText: 'View Impact & Federated Mesh',
      action: () => onNavigateTab('federated'),
      badge: 'FEDERATED MESH',
      icon: Network,
    },
  ];

  const current = tourSteps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      tourSteps[nextStep].action();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      tourSteps[prevStep].action();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
      <div className="relative w-full max-w-3xl bg-slate-900/98 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl p-5 text-slate-100 pointer-events-auto ring-1 ring-emerald-500/20">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Hackathon 12-Step Story Walkthrough
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{current.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentStep(0);
                tourSteps[0].action();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Restart Story Tour"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {current.badge}
              </span>
              <span className="text-xs font-semibold text-slate-200">{current.headline}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {current.description}
            </p>
          </div>

          <button
            onClick={current.action}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 shrink-0 self-start md:self-center"
          >
            <StepIcon className="w-4 h-4" />
            <span>{current.actionText}</span>
          </button>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  tourSteps[idx].action();
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep 
                    ? 'w-6 bg-emerald-400' 
                    : idx < currentStep 
                    ? 'w-2 bg-emerald-500/50' 
                    : 'w-2 bg-slate-700'
                }`}
                title={`Go to Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition text-xs font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === tourSteps.length - 1}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 transition text-xs font-bold shadow"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
