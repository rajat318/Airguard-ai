/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { EnvironmentalMap } from './components/EnvironmentalMap';
import { MetricCards } from './components/MetricCards';
import { CitizenReportModal } from './components/CitizenReportModal';
import { IncidentDrawer } from './components/IncidentDrawer';
import { ForecastView } from './components/ForecastView';
import { AuthorityCenter } from './components/AuthorityCenter';
import { AlertsView } from './components/AlertsView';
import { CitizenReportsView } from './components/CitizenReportsView';
import { FederatedView } from './components/FederatedView';
import { TransparencyModal } from './components/TransparencyModal';
import { GuidedDemoTour } from './components/GuidedDemoTour';
import { LiveSimulationController } from './components/LiveSimulationController';
import { RegulatoryBriefingModal } from './components/RegulatoryBriefingModal';

import { 
  DistrictSummary, 
  EnvironmentalSensor, 
  CitizenReport, 
  PollutionHotspot, 
  AuthorityAction, 
  CommunityAlert 
} from './types/environmental';

import { 
  fetchDistricts, 
  fetchSensors, 
  fetchHotspots, 
  fetchReports, 
  fetchActions, 
  fetchAlerts 
} from './services/api';

import { 
  AlertTriangle, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Radio, 
  Wind,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Core Data States
  const [districts, setDistricts] = useState<DistrictSummary[]>([]);
  const [sensors, setSensors] = useState<EnvironmentalSensor[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [hotspots, setHotspots] = useState<PollutionHotspot[]>([]);
  const [actions, setActions] = useState<AuthorityAction[]>([]);
  const [alerts, setAlerts] = useState<CommunityAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);
  const [isSpiked, setIsSpiked] = useState<boolean>(false);
  const [isSuppressed, setIsSuppressed] = useState<boolean>(false);

  // Simulation handlers
  const handleSimulateSpike = () => {
    setIsSpiked(true);
    setIsSuppressed(false);
    setSensors((prev) =>
      prev.map((s) =>
        s.id === 'sensor-ind-01'
          ? { ...s, aqi: 245, pm25: 195.4, pm10: 280.0, status: 'ALERT' as const }
          : s
      )
    );
  };

  const handleSimulateMistSuppression = () => {
    setIsSuppressed(true);
    setSensors((prev) =>
      prev.map((s) =>
        s.id === 'sensor-ind-01'
          ? { ...s, aqi: 98, pm25: 38.5, pm10: 62.0, status: 'ONLINE' as const }
          : s
      )
    );
  };

  const handleResetBaseline = () => {
    setIsSpiked(false);
    setIsSuppressed(false);
    loadData();
  };

  // Inspector Drawer Selected Item
  const [selectedSensor, setSelectedSensor] = useState<EnvironmentalSensor | null>(null);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<PollutionHotspot | null>(null);

  // Load all foundational data
  const loadData = useCallback(async () => {
    try {
      const [dists, sens, hots, reps, acts, alts] = await Promise.all([
        fetchDistricts(),
        fetchSensors(selectedDistrict),
        fetchHotspots(selectedDistrict),
        fetchReports(selectedDistrict),
        fetchActions(),
        fetchAlerts(),
      ]);

      setDistricts(dists);
      setSensors(sens);
      setHotspots(hots);
      setReports(reps);
      setActions(acts);
      setAlerts(alts);
    } catch (err) {
      console.error('Error fetching environmental dataset:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers for selecting map items
  const handleSelectSensor = (sensor: EnvironmentalSensor) => {
    setSelectedSensor(sensor);
    setSelectedReport(null);
    setSelectedHotspot(null);
  };

  const handleSelectReport = (report: CitizenReport) => {
    setSelectedReport(report);
    setSelectedSensor(null);
    setSelectedHotspot(null);
  };

  const handleSelectHotspot = (hotspot: PollutionHotspot) => {
    setSelectedHotspot(hotspot);
    setSelectedSensor(null);
    setSelectedReport(null);
  };

  const handleCloseDrawer = () => {
    setSelectedSensor(null);
    setSelectedReport(null);
    setSelectedHotspot(null);
  };

  const handleReportSubmitted = (newReport: CitizenReport) => {
    setReports((prev) => [newReport, ...prev]);
    // Immediately open drawer to display Gemini reasoning
    setSelectedReport(newReport);
    setSelectedHotspot(null);
    setSelectedSensor(null);
    // Reload data to reflect new hotspot correlations
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        districts={districts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenTransparencyModal={() => setIsTransparencyModalOpen(true)}
        onOpenGuidedTour={() => setIsTourOpen(true)}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
        isSimulatorOpen={isSimulatorOpen}
        liveSensorsCount={sensors.length}
        activeHotspotsCount={hotspots.filter(h => h.status === 'ACTIVE').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {loading ? (
          <div className="py-24 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Synchronizing Ground IoT Telemetry & Satellite Layers...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: Spatial Intel Map & Multi-Source Dashboard */}
            {currentTab === 'map' && (
              <div className="space-y-6">
                <MetricCards
                  sensors={sensors}
                  selectedDistrict={selectedDistrict}
                  districts={districts}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>Interactive Basin Pollution Intelligence Map</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      Click any sensor station, citizen photo pin, or plume contour to inspect evidence
                    </span>
                  </div>

                  <EnvironmentalMap
                    sensors={sensors}
                    reports={reports}
                    hotspots={hotspots}
                    onSelectSensor={handleSelectSensor}
                    onSelectReport={handleSelectReport}
                    onSelectHotspot={handleSelectHotspot}
                    selectedDistrict={selectedDistrict}
                  />
                </div>

                {/* Co-located Multi-Source Summary Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Active Hotspot Quick Card */}
                  {hotspots[0] && (
                    <div 
                      onClick={() => handleSelectHotspot(hotspots[0])}
                      className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 hover:border-rose-500/60 shadow-lg cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-rose-400 font-bold uppercase tracking-wider">Top Critical Hotspot</span>
                        <span className="text-[10px] bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded font-mono">
                          {hotspots[0].riskLevel}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-rose-300 transition">
                        {hotspots[0].name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {hotspots[0].aiSummary}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
                        <span>Peak PM2.5: <strong className="text-rose-400">{hotspots[0].pm25Peak} µg/m³</strong></span>
                        <span className="text-cyan-400 group-hover:underline">Inspect Evidence &rarr;</span>
                      </div>
                    </div>
                  )}

                  {/* Latest Citizen Report Quick Card */}
                  {reports[0] && (
                    <div 
                      onClick={() => handleSelectReport(reports[0])}
                      className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-cyan-400 font-bold uppercase tracking-wider">Latest Citizen Evidence</span>
                        <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded font-mono">
                          {reports[0].severity}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition line-clamp-1">
                        {reports[0].title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {reports[0].description}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
                        <span>Corroboration: <strong>{reports[0].upvotes} citizens</strong></span>
                        <span className="text-cyan-400 group-hover:underline">View AI Diagnostic &rarr;</span>
                      </div>
                    </div>
                  )}

                  {/* Immediate Authority Action Status */}
                  {actions[0] && (
                    <div 
                      onClick={() => setCurrentTab('authority')}
                      className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 shadow-lg cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-amber-400 font-bold uppercase tracking-wider">Active Municipal Response</span>
                        <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded font-mono">
                          {actions[0].status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-1">
                        {actions[0].title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {actions[0].notes}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
                        <span>Unit: <strong>{actions[0].dispatchedTo.slice(0, 24)}...</strong></span>
                        <span className="text-amber-400 group-hover:underline">Authority Command &rarr;</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Air Telemetry Deep Dive */}
            {currentTab === 'telemetry' && (
              <div className="space-y-6">
                <MetricCards
                  sensors={sensors}
                  selectedDistrict={selectedDistrict}
                  districts={districts}
                />

                {/* Sensor Nodes Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        Calibrated Ground Sensor Station Network ({sensors.length} Stations)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Continuous continuous telemetry with optical PM2.5, chemiluminescent NO2, and meteorological sensors
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 pr-3">Station Name</th>
                          <th className="py-2.5 px-3">District</th>
                          <th className="py-2.5 px-3">AQI</th>
                          <th className="py-2.5 px-3">PM2.5 (µg/m³)</th>
                          <th className="py-2.5 px-3">PM10 (µg/m³)</th>
                          <th className="py-2.5 px-3">NO2 (ppb)</th>
                          <th className="py-2.5 px-3">Wind</th>
                          <th className="py-2.5 pl-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        {sensors.map((s) => (
                          <tr 
                            key={s.id} 
                            onClick={() => handleSelectSensor(s)}
                            className="hover:bg-slate-850/60 cursor-pointer transition"
                          >
                            <td className="py-3 pr-3 font-semibold text-slate-100">
                              {s.stationName}
                            </td>
                            <td className="py-3 px-3 text-slate-400">{s.location.district}</td>
                            <td className="py-3 px-3 font-bold text-rose-400">{s.aqi}</td>
                            <td className="py-3 px-3 font-mono">{s.pm25}</td>
                            <td className="py-3 px-3 font-mono">{s.pm10}</td>
                            <td className="py-3 px-3 font-mono">{s.no2}</td>
                            <td className="py-3 px-3 text-slate-400">{s.windSpeed} km/h {s.windDirectionCardinal}</td>
                            <td className="py-3 pl-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.status === 'ALERT'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Citizen Reports */}
            {currentTab === 'reports' && (
              <CitizenReportsView
                reports={reports}
                onSelectReport={handleSelectReport}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onRefreshReports={loadData}
              />
            )}

            {/* TAB 4: 4-Horizon Forecast */}
            {currentTab === 'forecast' && (
              <ForecastView
                selectedDistrict={selectedDistrict}
                districts={districts}
                onSelectDistrict={setSelectedDistrict}
              />
            )}

            {/* TAB 5: Authority Command */}
            {currentTab === 'authority' && (
              <AuthorityCenter
                actions={actions}
                hotspots={hotspots}
                reports={reports}
                onRefreshActions={loadData}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            )}

            {/* TAB 6: Community Alerts */}
            {currentTab === 'alerts' && (
              <AlertsView alerts={alerts} />
            )}

            {/* TAB 7: Federated Mesh & Impact */}
            {currentTab === 'federated' && (
              <FederatedView />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">AirGuard AI</span>
            <span>•</span>
            <span>Track 2: Clean Air & Climate Resilience</span>
            <span>•</span>
            <span className="text-emerald-400">Build with AI Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTransparencyModalOpen(true)}
              className="text-slate-400 hover:text-emerald-400 transition underline underline-offset-4"
            >
              Scientific Provenance & Zero-Hallucination Charter
            </button>
            <span>•</span>
            <span>Gemini 3.8 Flash Multimodal Reasoning</span>
          </div>
        </div>
      </footer>

      {/* Citizen Report Modal */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={handleReportSubmitted}
        districts={districts}
        defaultDistrict={selectedDistrict}
      />

      {/* Transparency Charter Modal */}
      <TransparencyModal
        isOpen={isTransparencyModalOpen}
        onClose={() => setIsTransparencyModalOpen(false)}
      />

      {/* Incident / Hotspot / Sensor Evidence Inspector Drawer */}
      <IncidentDrawer
        selectedReport={selectedReport}
        selectedHotspot={selectedHotspot}
        selectedSensor={selectedSensor}
        onClose={handleCloseDrawer}
        onActionCreated={loadData}
        onOpenBriefing={() => setIsBriefingOpen(true)}
      />

      {/* Guided 12-Step Hackathon Tour */}
      <GuidedDemoTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onTriggerPlumeSpike={handleSimulateSpike}
        onTriggerMistSuppression={handleSimulateMistSuppression}
      />

      {/* Live Plume Simulator Controller */}
      <LiveSimulationController
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSimulateSpike={handleSimulateSpike}
        onSimulateMistSuppression={handleSimulateMistSuppression}
        onResetBaseline={handleResetBaseline}
        isSpiked={isSpiked}
        isSuppressed={isSuppressed}
      />

      {/* Regulatory Briefing Modal */}
      <RegulatoryBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        report={selectedReport}
        hotspot={selectedHotspot}
        sensor={selectedSensor}
      />
    </div>
  );
}
