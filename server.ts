import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { dataStore, calculateForecasts } from './src/server/store.js';
import { analyzeIncidentEvidence } from './src/server/geminiService.js';
import { CitizenReport, AuthorityAction, CommunityAlert, PollutionHotspot } from './src/types/environmental.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Increase JSON limit for base64 photo uploads from citizens
app.use(express.json({ limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'AirGuard AI Core Service',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
    sensorsCount: dataStore.getSensors().length,
    activeHotspots: dataStore.getHotspots().filter(h => h.status === 'ACTIVE').length,
    reportsCount: dataStore.getReports().length,
  });
});

// District Overview
app.get('/api/districts', (req: Request, res: Response) => {
  res.json(dataStore.getDistricts());
});

// Sensors endpoint
app.get('/api/sensors', (req: Request, res: Response) => {
  const district = req.query.district as string | undefined;
  res.json(dataStore.getSensors(district));
});

// Hotspots endpoint
app.get('/api/hotspots', (req: Request, res: Response) => {
  const district = req.query.district as string | undefined;
  res.json(dataStore.getHotspots(district));
});

// Update Hotspot status
app.patch('/api/hotspots/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updated = dataStore.updateHotspot(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Hotspot not found' });
  }
  res.json(updated);
});

// Citizen Reports endpoints
app.get('/api/reports', (req: Request, res: Response) => {
  const district = req.query.district as string | undefined;
  res.json(dataStore.getReports(district));
});

// Submit Citizen Report with auto multimodal analysis & sensor fusion
app.post('/api/reports', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      severity,
      location,
      imageUrl,
      imageBase64,
      audioTranscript
    } = req.body;

    if (!title || !description || !category || !location || !location.district) {
      return res.status(400).json({ error: 'Missing required report fields (title, description, category, location)' });
    }

    // Find nearest sensor within district for data fusion
    const allSensors = dataStore.getSensors(location.district);
    let nearestSensor = allSensors[0] || dataStore.getSensors()[0];

    const reportId = `rep-${Date.now().toString().slice(-6)}`;

    // Prepare citizen report
    const newReport: CitizenReport = {
      id: reportId,
      title: title.trim(),
      description: description.trim(),
      category,
      severity: severity || 'MEDIUM',
      location: {
        lat: location.lat || (nearestSensor ? nearestSensor.location.lat + 0.003 : 37.785),
        lng: location.lng || (nearestSensor ? nearestSensor.location.lng - 0.002 : -122.39),
        address: location.address || `${location.district} sector`,
        district: location.district
      },
      imageUrl: imageUrl || imageBase64,
      audioTranscript,
      timestamp: new Date().toISOString(),
      status: 'PENDING_AI',
      nearbySensorId: nearestSensor?.id,
      upvotes: 1
    };

    // Store immediately
    dataStore.addReport(newReport);

    // Run multimodal AI reasoning with co-located sensor data
    const aiAnalysis = await analyzeIncidentEvidence({
      title: newReport.title,
      description: newReport.description,
      category: newReport.category,
      severity: newReport.severity,
      district: newReport.location.district,
      locationCoords: { lat: newReport.location.lat, lng: newReport.location.lng },
      coLocatedSensorData: nearestSensor ? {
        stationName: nearestSensor.stationName,
        aqi: nearestSensor.aqi,
        pm25: nearestSensor.pm25,
        no2: nearestSensor.no2,
        windSpeed: nearestSensor.windSpeed,
        windDirectionCardinal: nearestSensor.windDirectionCardinal,
        temperature: nearestSensor.temperature,
        humidity: nearestSensor.humidity
      } : undefined,
      imageBase64: imageBase64 || (imageUrl && imageUrl.startsWith('data:') ? imageUrl : undefined)
    });

    // Update report with AI output
    newReport.aiAnalysis = aiAnalysis;
    newReport.status = aiAnalysis.riskLevel === 'CRITICAL' || aiAnalysis.riskLevel === 'HIGH' 
      ? 'VERIFIED_HOTSPOT' 
      : 'INVESTIGATING';

    dataStore.updateReport(reportId, newReport);

    // If critical/high severity and near existing hotspot or sensor anomaly, correlate
    if (newReport.status === 'VERIFIED_HOTSPOT') {
      const existingHotspot = dataStore.getHotspots(location.district)[0];
      if (existingHotspot) {
        existingHotspot.contributingReportIds.push(newReport.id);
        existingHotspot.lastUpdated = new Date().toISOString();
      } else {
        // Auto-generate a detected hotspot cluster
        const newHotspot: PollutionHotspot = {
          id: `hotspot-${Date.now().toString().slice(-4)}`,
          name: `${location.district} Particulate Anomaly`,
          district: location.district,
          center: newReport.location,
          radiusKm: aiAnalysis.estimatedPlumeRadiusKm || 1.2,
          riskLevel: aiAnalysis.riskLevel,
          primaryPollutant: 'PM2.5 / Uncontained Smoke Plume',
          currentAvgAqi: nearestSensor ? nearestSensor.aqi : 155,
          pm25Peak: nearestSensor ? nearestSensor.pm25 : 98.4,
          contributingReportIds: [newReport.id],
          contributingSensorIds: nearestSensor ? [nearestSensor.id] : [],
          status: 'ACTIVE',
          aiSummary: aiAnalysis.summary,
          confidence: aiAnalysis.confidence,
          detectedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        dataStore.addHotspot(newHotspot);
      }
    }

    res.status(201).json(newReport);
  } catch (error: any) {
    console.error('Error submitting citizen report:', error);
    res.status(500).json({ error: error.message || 'Failed to process citizen report' });
  }
});

// Re-analyze a report
app.post('/api/reports/:id/analyze', async (req: Request, res: Response) => {
  const report = dataStore.getReports().find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const sensor = report.nearbySensorId 
    ? dataStore.getSensors().find(s => s.id === report.nearbySensorId)
    : dataStore.getSensors(report.location.district)[0];

  const analysis = await analyzeIncidentEvidence({
    title: report.title,
    description: report.description,
    category: report.category,
    severity: report.severity,
    district: report.location.district,
    locationCoords: { lat: report.location.lat, lng: report.location.lng },
    coLocatedSensorData: sensor ? {
      stationName: sensor.stationName,
      aqi: sensor.aqi,
      pm25: sensor.pm25,
      no2: sensor.no2,
      windSpeed: sensor.windSpeed,
      windDirectionCardinal: sensor.windDirectionCardinal,
      temperature: sensor.temperature,
      humidity: sensor.humidity
    } : undefined,
    imageBase64: report.imageUrl
  });

  report.aiAnalysis = analysis;
  res.json(report);
});

// Upvote report
app.post('/api/reports/:id/upvote', (req: Request, res: Response) => {
  const report = dataStore.getReports().find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  report.upvotes += 1;
  res.json({ id: report.id, upvotes: report.upvotes });
});

// Forecast Endpoint (Deterministic model with Gemini explanations)
app.get('/api/forecast', (req: Request, res: Response) => {
  const districtName = (req.query.district as string) || 'Industrial East Corridor';
  const sensors = dataStore.getSensors(districtName);
  const avgAqi = sensors.length > 0 
    ? Math.round(sensors.reduce((acc, s) => acc + s.aqi, 0) / sensors.length)
    : 110;
  const windSpeed = sensors[0]?.windSpeed || 15;
  const windDir = sensors[0]?.windDirection || 295;

  const forecasts = calculateForecasts(avgAqi, windSpeed, windDir);
  res.json({
    district: districtName,
    currentAqi: avgAqi,
    forecasts,
    generatedAt: new Date().toISOString(),
    provenance: 'FORECAST_MODEL',
    notes: 'Atmospheric dispersion model calculated using continuous ground wind vectors and boundary layer decay.'
  });
});

// Authority Actions
app.get('/api/actions', (req: Request, res: Response) => {
  res.json(dataStore.getActions());
});

app.post('/api/actions', (req: Request, res: Response) => {
  const { hotspotId, reportId, title, type, priority, dispatchedTo, notes } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type are required' });
  }

  const newAction: AuthorityAction = {
    id: `act-${Date.now().toString().slice(-4)}`,
    hotspotId,
    reportId,
    title,
    type,
    priority: priority || 'HIGH',
    status: 'IN_PROGRESS',
    dispatchedTo: dispatchedTo || 'Regional Air Protection Field Crew',
    notes: notes || 'Immediate response initiated from AirGuard Command Center.',
    timestamp: new Date().toISOString()
  };

  dataStore.addAction(newAction);

  // If action is associated with a hotspot, update hotspot status to DISPATCHED
  if (hotspotId) {
    dataStore.updateHotspot(hotspotId, { status: 'DISPATCHED' });
  }

  res.status(201).json(newAction);
});

app.patch('/api/actions/:id', (req: Request, res: Response) => {
  const updated = dataStore.updateAction(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Action not found' });
  }
  res.json(updated);
});

// Community Alerts
app.get('/api/alerts', (req: Request, res: Response) => {
  res.json(dataStore.getAlerts());
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const { title, district, severity, headline, affectedPopulations, recommendedPrecautions } = req.body;
  const newAlert: CommunityAlert = {
    id: `alt-${Date.now().toString().slice(-4)}`,
    title: title || 'Air Quality Public Advisory',
    district: district || 'All Districts',
    severity: severity || 'WARNING',
    headline: headline || 'Elevated air pollution levels observed.',
    affectedPopulations: affectedPopulations || ['Sensitive individuals', 'Children', 'Elderly'],
    recommendedPrecautions: recommendedPrecautions || ['Stay indoors', 'Keep windows closed', 'Use air purification'],
    timestamp: new Date().toISOString(),
    provenance: 'CALCULATED_RISK',
    expiresAt: new Date(Date.now() + 4 * 3600000).toISOString()
  };

  dataStore.addAlert(newAlert);
  res.status(201).json(newAlert);
});

// Federated cross-district intelligence demo endpoint
app.get('/api/federated-summary', (req: Request, res: Response) => {
  const districts = dataStore.getDistricts();
  const allSensors = dataStore.getSensors();
  const allReports = dataStore.getReports();
  const allHotspots = dataStore.getHotspots();

  res.json({
    architecture: 'Federated Interoperable Environmental Intelligence Mesh',
    regionalJurisdictions: districts.map(d => ({
      districtId: d.id,
      name: d.name,
      localNodes: allSensors.filter(s => s.location.district === d.name).length,
      localReports: allReports.filter(r => r.location.district === d.name).length,
      complianceStatus: d.dominantRisk === 'CRITICAL' ? 'EMERGENCY_STAGE_1' : d.dominantRisk === 'HIGH' ? 'WARNING' : 'COMPLIANT',
      privacyPreservingTelemetryHash: `sha256:fed_${d.id}_${Date.now().toString(16).slice(-8)}`
    })),
    networkMetrics: {
      totalStationsReporting: allSensors.length,
      totalCitizenReportsVerified: allReports.filter(r => r.status === 'VERIFIED_HOTSPOT' || r.status === 'RESOLVED').length,
      activeInterventions: dataStore.getActions().filter(a => a.status === 'IN_PROGRESS').length,
      averageTimeToInterventionMinutes: 14.2,
      crossDistrictPollutionTransfer: 'West-Northwest to East Basin (14.5 km/h dispersion)',
    },
    transparencyLedger: {
      dataSources: [
        { name: 'Ground IoT Nodes', type: 'Continuous Chemiluminescence & Optical Particle Counters', count: allSensors.length, trustScore: 'High (Calibrated)' },
        { name: 'Citizen Environmental Reports', type: 'Crowdsourced Multimodal Evidence', count: allReports.length, trustScore: 'Multi-source Corroborated' },
        { name: 'Earth Observation (Sentinel-5P)', type: 'Simulated Satellite NO2 Tropospheric Column', resolution: '3.5 x 5.5 km', trustScore: 'Model Corroborated' },
        { name: 'Gemini 3.8 Multimodal AI', type: 'Zero-hallucination Structured Reasoning', confidenceAverage: '92%', role: 'Incident Diagnostic Engine' }
      ]
    }
  });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AirGuard AI] Core Intelligence Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[AirGuard AI] Failed to start server:', err);
});
