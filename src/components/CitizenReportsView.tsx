import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ThumbsUp, 
  MapPin, 
  Camera, 
  Sparkles, 
  Filter, 
  PlusCircle 
} from 'lucide-react';
import { CitizenReport } from '../types/environmental';
import { formatTimeAgo } from '../utils/environmentalFormatters';
import { upvoteReport } from '../services/api';

interface CitizenReportsViewProps {
  reports: CitizenReport[];
  onSelectReport: (report: CitizenReport) => void;
  onOpenReportModal: () => void;
  onRefreshReports: () => void;
}

export const CitizenReportsView: React.FC<CitizenReportsViewProps> = ({
  reports,
  onSelectReport,
  onOpenReportModal,
  onRefreshReports,
}) => {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filtered = reports.filter((r) => {
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    return true;
  });

  const handleUpvote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await upvoteReport(id);
      onRefreshReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Citizen Environmental Observations & Ground Evidence
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Crowdsourced Community Evidence</span>
              <span aria-hidden="true">·</span>
              <span>Corroborated by Continuous Sensor Telemetry</span>
              <span aria-hidden="true">·</span>
              <span>Diagnostic Verification by Gemini 3.8</span>
            </div>
          </div>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Citizen Report</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Categories</option>
            <option value="INDUSTRIAL_EMISSIONS">Industrial Emissions</option>
            <option value="VEHICLE_EXHAUST">Vehicle Exhaust</option>
            <option value="WASTE_INCINERATION">Waste Incineration</option>
            <option value="CONSTRUCTION_DUST">Construction Dust</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <span className="text-xs text-slate-400 ml-auto">
            {filtered.length} of {reports.length} reports
          </span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => {
          const isCritical = report.severity === 'CRITICAL';
          const isHigh = report.severity === 'HIGH';

          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Photo Preview */}
                {report.imageUrl ? (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold uppercase tracking-wider drop-shadow ${
                        isCritical
                          ? 'text-rose-400 font-extrabold'
                          : isHigh
                          ? 'text-amber-400 font-bold'
                          : 'text-cyan-400 font-semibold'
                      }`}>
                        {report.severity} Priority
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 drop-shadow">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span className="truncate max-w-[180px]">{report.location.address || report.location.district}</span>
                      </span>
                      <span>{formatTimeAgo(report.timestamp)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isCritical ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {report.severity} Priority
                    </span>
                    <span className="text-xs text-slate-400">{formatTimeAgo(report.timestamp)}</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">
                    {report.category.replace('_', ' ')}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition line-clamp-2">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* AI Badge & Upvote Footer */}
              <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {report.aiAnalysis ? (
                  <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini Corroborated ({report.aiAnalysis.confidence}%)</span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px]">Pending AI Verification</span>
                )}

                <button
                  onClick={(e) => handleUpvote(e, report.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 p-1 rounded transition"
                  title="Upvote / Corroborate Report"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-semibold text-slate-200">{report.upvotes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
