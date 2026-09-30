import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Radio, 
  Wind, 
  Truck, 
  Users, 
  Plus, 
  ChevronRight 
} from 'lucide-react';
import { AuthorityAction, PollutionHotspot, CitizenReport } from '../types/environmental';
import { updateAuthorityAction, createAuthorityAction } from '../services/api';
import { formatTimeAgo } from '../utils/environmentalFormatters';

interface AuthorityCenterProps {
  actions: AuthorityAction[];
  hotspots: PollutionHotspot[];
  reports: CitizenReport[];
  onRefreshActions: () => void;
  onOpenReportModal: () => void;
}

export const AuthorityCenter: React.FC<AuthorityCenterProps> = ({
  actions,
  hotspots,
  reports,
  onRefreshActions,
  onOpenReportModal,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewActionModal, setShowNewActionModal] = useState(false);

  // New action form state
  const [actionTitle, setActionTitle] = useState('');
  const [actionType, setActionType] = useState('DISPATCH_INSPECTION');
  const [actionPriority, setActionPriority] = useState('HIGH');
  const [dispatchedTo, setDispatchedTo] = useState('Regional Air Quality Enforcement Unit 2');
  const [notes, setNotes] = useState('');

  const filteredActions = actions.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  const handleStatusChange = async (id: string, newStatus: 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      await updateAuthorityAction(id, { 
        status: newStatus,
        resolvedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined 
      });
      onRefreshActions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await createAuthorityAction({
        title: actionTitle,
        type: actionType,
        priority: actionPriority,
        dispatchedTo,
        notes,
      });
      setActionTitle('');
      setNotes('');
      setShowNewActionModal(false);
      onRefreshActions();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  Municipal Environmental Authority Response Command
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  DECISION SUPPORT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rapid intervention workflow: Citizen evidence & IoT triggers → Statutory inspection dispatch & public protection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewActionModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-rose-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Dispatch New Intervention</span>
            </button>
          </div>
        </div>

        {/* Quick Triage Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Active Hotspots</div>
              <div className="text-xl font-bold text-rose-400 mt-0.5">{hotspots.length}</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Dispatches In Progress</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">
                {actions.filter(a => a.status === 'IN_PROGRESS').length}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Interventions Completed</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">
                {actions.filter(a => a.status === 'COMPLETED').length}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Mean Triage Velocity</div>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">14.2 min</div>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Ledger & Filters */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Authority Dispatch & Intervention Log ({filteredActions.length})</span>
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['ALL', 'IN_PROGRESS', 'PENDING', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  filter === st
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Items List */}
        <div className="divide-y divide-slate-800/80 mt-2">
          {filteredActions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No interventions found matching this status filter.
            </div>
          ) : (
            filteredActions.map((action) => {
              const isCompleted = action.status === 'COMPLETED';
              const isInProgress = action.status === 'IN_PROGRESS';

              return (
                <div key={action.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        action.priority === 'CRITICAL' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {action.priority} PRIORITY
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {action.status.replace('_', ' ')}
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(action.timestamp)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-rose-300 transition">
                      {action.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                      {action.notes}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Assigned: <strong>{action.dispatchedTo}</strong></span>
                      </span>
                      {action.resolvedAt && (
                        <span className="text-emerald-400">
                          Resolved at {new Date(action.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Toggle Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isCompleted ? (
                      <button
                        onClick={() => handleStatusChange(action.id, 'COMPLETED')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(action.id, 'IN_PROGRESS')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      >
                        <span>Reopen</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal for dispatching custom intervention */}
      {showNewActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-100 mb-1">
              Dispatch Rapid Environmental Response
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Authorize field inspection units, mobile mist cannons, or clean air advisories.
            </p>

            <form onSubmit={handleCreateAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Intervention Title
                </label>
                <input
                  type="text"
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder="e.g. Stack Opacity Audit at Scrap Metal Facility"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Intervention Type
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="DISPATCH_INSPECTION">🚨 Field Inspection Crew</option>
                    <option value="BROADCAST_ADVISORY">📢 Public Clean Air Advisory</option>
                    <option value="MIST_CANNON_DEPLOYMENT">💦 Particulate Mist Cannon</option>
                    <option value="ISSUE_CITATION">⚖️ Statutory Emission Notice</option>
                    <option value="TRAFFIC_REROUTING">🚦 Traffic & Idling Enforcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={actionPriority}
                    onChange={(e) => setActionPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="CRITICAL">🔴 Critical Priority</option>
                    <option value="HIGH">🟠 High Priority</option>
                    <option value="MEDIUM">🟡 Medium Priority</option>
                    <option value="LOW">🟢 Standard Monitoring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Unit / Agency
                </label>
                <input
                  type="text"
                  value={dispatchedTo}
                  onChange={(e) => setDispatchedTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Operational Instructions & Target Area
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Verify optical plume density, check baghouse filters, coordinate with local fire dispatch..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewActionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold text-xs transition"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
