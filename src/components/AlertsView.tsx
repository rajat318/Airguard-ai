import React, { useState } from 'react';
import { 
  Bell, 
  ShieldCheck, 
  Copy, 
  Check, 
  Users, 
  Clock, 
  Heart, 
  Home, 
  Wind 
} from 'lucide-react';
import { CommunityAlert } from '../types/environmental';
import { formatTimeAgo } from '../utils/environmentalFormatters';

interface AlertsViewProps {
  alerts: CommunityAlert[];
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAdvisory = (alert: CommunityAlert) => {
    const text = `[AirGuard AI Clean Air Advisory — ${alert.district}]\n${alert.title}\nSeverity: ${alert.severity}\nHeadline: ${alert.headline}\nPrecautions:\n${alert.recommendedPrecautions.map(p => `• ${p}`).join('\n')}\nSource: Calibrated IoT Sensor Network & Gemini AI`;
    navigator.clipboard.writeText(text);
    setCopiedId(alert.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Community Clean Air Advisories & Public Health Guidance
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Public Health Guidance Aligned with WHO & EPA Guidelines</span>
              <span aria-hidden="true">·</span>
              <span>{alerts.length} Active District Advisories</span>
            </div>
          </div>
        </div>

        {/* Quick Precautions Guidance Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded bg-teal-500/10 text-teal-400 shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Seal Indoor Envelope</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Close windows during plume transit. Operate indoor HEPA filters on medium-high setting.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded bg-rose-500/10 text-rose-400 shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Protect Vulnerable Groups</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Asthma, pediatric, geriatric, and cardiopulmonary groups should restrict outdoor exertion.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Particulate Respirator Guidance</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                For essential outdoor transit during active plumes, wear a certified, well-fitted N95/KN95 respirator.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Bulletins Feed */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isCopied = copiedId === alert.id;
          const isEmergency = alert.severity === 'EMERGENCY';

          return (
            <div
              key={alert.id}
              className={`rounded-xl p-5 border shadow-sm transition-all ${
                isEmergency
                  ? 'bg-rose-950/20 border-rose-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Alert Header: Clean typographic metadata without pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className={`font-bold uppercase tracking-wider ${
                    isEmergency ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {alert.severity} Advisory
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-200">
                    District: <strong>{alert.district}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    Issued {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyAdvisory(alert)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs transition self-start sm:self-center"
                  title="Copy Advisory Text for Schools or Community Noticeboards"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Advisory</span>
                    </>
                  )}
                </button>
              </div>

              {/* Headline */}
              <div className="mt-3">
                <h3 className="text-base font-bold text-white">{alert.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.headline}</p>
              </div>

              {/* Populations Affected & Precautions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800/80">
                {/* Affected Populations */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>High Vulnerability Populations:</span>
                  </div>
                  <ul className="space-y-1">
                    {alert.affectedPopulations.map((pop, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{pop}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Precautions */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Recommended Precautions:</span>
                  </div>
                  <ul className="space-y-1">
                    {alert.recommendedPrecautions.map((prec, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{prec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/50">
                <span>Verified by Multi-Source Sensor Fusion Engine</span>
                <span>Active through {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
