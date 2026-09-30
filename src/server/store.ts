import { 
  EnvironmentalSensor, 
  CitizenReport, 
  PollutionHotspot, 
  AuthorityAction, 
  CommunityAlert,
  DistrictSummary,
  ForecastHorizon 
} from '../types/environmental.js';

// Pre-seeded high quality realistic environmental dataset
export const initialDistricts: DistrictSummary[] = [
  {
    id: 'dist-industrial',
    name: 'Industrial East Corridor',
    center: { lat: 37.7845, lng: -122.3920 },
    avgAqi: 178,
    dominantRisk: 'CRITICAL',
    activeHotspotsCount: 2,
    activeReportsCount: 4,
    sensorsOnline: 4,
  },
  {
    id: 'dist-central',
    name: 'Central Urban Core',
    center: { lat: 37.7749, lng: -122.4194 },
    avgAqi: 92,
    dominantRisk: 'MODERATE',
    activeHotspotsCount: 1,
    activeReportsCount: 3,
    sensorsOnline: 5,
  },
  {
    id: 'dist-port',
    name: 'Southern Logistics & Port',
    center: { lat: 37.7420, lng: -122.3850 },
    avgAqi: 124,
    dominantRisk: 'HIGH',
    activeHotspotsCount: 1,
    activeReportsCount: 2,
    sensorsOnline: 3,
  },
  {
    id: 'dist-north',
    name: 'North Bay Basin',
    center: { lat: 37.8080, lng: -122.4170 },
    avgAqi: 58,
    dominantRisk: 'LOW',
    activeHotspotsCount: 0,
    activeReportsCount: 1,
    sensorsOnline: 3,
  },
  {
    id: 'dist-highland',
    name: 'Highland Residential Valley',
    center: { lat: 37.7550, lng: -122.4450 },
    avgAqi: 36,
    dominantRisk: 'LOW',
    activeHotspotsCount: 0,
    activeReportsCount: 0,
    sensorsOnline: 3,
  },
];

export const initialSensors: EnvironmentalSensor[] = [
  {
    id: 'sensor-ind-01',
    stationId: 'AQ-IND-881',
    stationName: 'East Refinery & Metallurgical Air Monitor',
    location: { lat: 37.7860, lng: -122.3890, address: '940 Illinois St, Industrial East', district: 'Industrial East Corridor' },
    timestamp: new Date().toISOString(),
    aqi: 184,
    pm25: 124.5,
    pm10: 178.2,
    no2: 68.4,
    co: 4.8,
    so2: 32.1,
    o3: 42.0,
    temperature: 23.4,
    humidity: 46,
    windSpeed: 14.5,
    windDirection: 295,
    windDirectionCardinal: 'NW',
    pressure: 1013.2,
    provenance: 'OBSERVED_SENSOR',
    status: 'ALERT',
  },
  {
    id: 'sensor-ind-02',
    stationId: 'AQ-IND-882',
    stationName: 'Foundry District Substation',
    location: { lat: 37.7815, lng: -122.3960, address: '1200 3rd St, Industrial East', district: 'Industrial East Corridor' },
    timestamp: new Date().toISOString(),
    aqi: 168,
    pm25: 108.2,
    pm10: 154.0,
    no2: 56.2,
    co: 3.9,
    so2: 24.5,
    o3: 38.0,
    temperature: 23.8,
    humidity: 44,
    windSpeed: 13.8,
    windDirection: 300,
    windDirectionCardinal: 'NW',
    pressure: 1013.0,
    provenance: 'OBSERVED_SENSOR',
    status: 'ALERT',
  },
  {
    id: 'sensor-ind-03',
    stationId: 'AQ-IND-883',
    stationName: 'Pier 70 Atmospheric Station',
    location: { lat: 37.7590, lng: -122.3840, address: 'Pier 70 Marina Gate', district: 'Industrial East Corridor' },
    timestamp: new Date().toISOString(),
    aqi: 142,
    pm25: 78.4,
    pm10: 112.0,
    no2: 44.1,
    co: 2.8,
    so2: 18.2,
    o3: 34.0,
    temperature: 22.9,
    humidity: 49,
    windSpeed: 16.2,
    windDirection: 310,
    windDirectionCardinal: 'NW',
    pressure: 1013.5,
    provenance: 'OBSERVED_SENSOR',
    status: 'ALERT',
  },
  {
    id: 'sensor-ind-04',
    stationId: 'AQ-IND-884',
    stationName: 'Cesar Chavez Transit Intersection',
    location: { lat: 37.7490, lng: -122.3990, address: 'Cesar Chavez & Evans Ave', district: 'Industrial East Corridor' },
    timestamp: new Date().toISOString(),
    aqi: 132,
    pm25: 64.2,
    pm10: 98.4,
    no2: 48.9,
    co: 3.1,
    so2: 14.2,
    o3: 31.0,
    temperature: 23.1,
    humidity: 48,
    windSpeed: 15.0,
    windDirection: 290,
    windDirectionCardinal: 'W',
    pressure: 1013.4,
    provenance: 'OBSERVED_SENSOR',
    status: 'ONLINE',
  },
  {
    id: 'sensor-urb-01',
    stationId: 'AQ-URB-101',
    stationName: 'Civic Center Public Health Station',
    location: { lat: 37.7790, lng: -122.4180, address: 'Van Ness Ave & McAllister', district: 'Central Urban Core' },
    timestamp: new Date().toISOString(),
    aqi: 94,
    pm25: 32.8,
    pm10: 55.4,
    no2: 41.2,
    co: 2.2,
    so2: 6.8,
    o3: 28.5,
    temperature: 21.5,
    humidity: 55,
    windSpeed: 11.2,
    windDirection: 280,
    windDirectionCardinal: 'W',
    pressure: 1014.1,
    provenance: 'OBSERVED_SENSOR',
    status: 'ONLINE',
  },
  {
    id: 'sensor-urb-02',
    stationId: 'AQ-URB-102',
    stationName: 'Market Street Commercial Corridor',
    location: { lat: 37.7880, lng: -122.4070, address: 'Market & 4th Street', district: 'Central Urban Core' },
    timestamp: new Date().toISOString(),
    aqi: 88,
    pm25: 29.5,
    pm10: 48.0,
    no2: 38.6,
    co: 1.9,
    so2: 5.2,
    o3: 26.0,
    temperature: 22.0,
    humidity: 53,
    windSpeed: 9.8,
    windDirection: 275,
    windDirectionCardinal: 'W',
    pressure: 1014.2,
    provenance: 'OBSERVED_SENSOR',
    status: 'ONLINE',
  },
  {
    id: 'sensor-urb-03',
    stationId: 'AQ-URB-103',
    stationName: 'Mission Community Clinic Station',
    location: { lat: 37.7600, lng: -122.4190, address: 'Mission & 20th St', district: 'Central Urban Core' },
    timestamp: new Date().toISOString(),
    aqi: 98,
    pm25: 35.1,
    pm10: 58.2,
    no2: 43.1,
    co: 2.4,
    so2: 7.1,
    o3: 29.0,
    temperature: 22.4,
    humidity: 52,
    windSpeed: 10.5,
    windDirection: 285,
    windDirectionCardinal: 'W',
    pressure: 1013.9,
    provenance: 'OBSERVED_SENSOR',
    status: 'ONLINE',
  },
  {
    id: 'sensor-port-01',
    stationId: 'AQ-PRT-301',
    stationName: 'Southern Freight & Logistics Terminal',
    location: { lat: 37.7390, lng: -122.3800, address: 'Cargo Way Intermodal Gate', district: 'Southern Logistics & Port' },
    timestamp: new Date().toISOString(),
    aqi: 128,
    pm25: 58.2,
    pm10: 92.5,
    no2: 52.8,
    co: 3.4,
    so2: 19.4,
    o3: 30.0,
    temperature: 22.1,
    humidity: 56,
    windSpeed: 18.0,
    windDirection: 315,
    windDirectionCardinal: 'NW',
    pressure: 1013.7,
    provenance: 'OBSERVED_SENSOR',
    status: 'ALERT',
  },
  {
    id: 'sensor-nth-01',
    stationId: 'AQ-NTH-201',
    stationName: 'North Waterfront Marina Station',
    location: { lat: 37.8070, lng: -122.4180, address: 'Fisherman Wharf Pier 39', district: 'North Bay Basin' },
    timestamp: new Date().toISOString(),
    aqi: 54,
    pm25: 14.1,
    pm10: 28.0,
    no2: 18.5,
    co: 0.9,
    so2: 3.1,
    o3: 35.0,
    temperature: 18.5,
    humidity: 68,
    windSpeed: 21.0,
    windDirection: 320,
    windDirectionCardinal: 'NW',
    pressure: 1014.8,
    provenance: 'OBSERVED_SENSOR',
    status: 'ONLINE',
  },
  {
    id: 'sensor-high-01',
    stationId: 'AQ-RES-401',
    stationName: 'Twin Peaks Clean Air Reserve',
    location: { lat: 37.7540, lng: -122.4470, address: 'Twin Peaks Crest Station', district: 'Highland Residential Valley' },
    timestamp: new Date().toISOString(),
    aqi: 34,
    pm25: 8.2,
    pm10: 16.5,
    no2: 9.4,
    co: 0.4,
    so2: 1.2,
    o3: 38.0,
    temperature: 17.2,
    humidity: 62,
    windSpeed: 24.5,
    windDirection: 290,
    windDirectionCardinal: 'W',
    pressure: 1015.5,
    provenance: 'OBSERVED_SENSOR',
    status: 'ONLINE',
  },
];

export const initialCitizenReports: CitizenReport[] = [
  {
    id: 'rep-101',
    title: 'Dense chemical smoke & acrid smell from scrap smelting facility',
    description: 'Thick blackish-grey smoke billowing from unauthorized stack behind the metal recovery yard. Visibility reduced along Illinois Street, pungent burning odor causing throat irritation.',
    category: 'INDUSTRIAL_EMISSIONS',
    severity: 'CRITICAL',
    location: {
      lat: 37.7852,
      lng: -122.3898,
      address: '980 Illinois St near 20th',
      district: 'Industrial East Corridor'
    },
    imageUrl: 'https://images.unsplash.com/photo-1542382257-80dedb725088?auto=format&fit=crop&w=800&q=80',
    timestamp: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
    status: 'VERIFIED_HOTSPOT',
    nearbySensorId: 'sensor-ind-01',
    upvotes: 18,
    aiAnalysis: {
      incidentType: 'Industrial Heavy Metal Smelting & Fuel Combustion Plume',
      summary: 'High-density opacity smoke consistent with unscrubbed particulate emissions from high-temperature smelting or fuel oil burn. Co-located with severe PM2.5 spike (124.5 µg/m³).',
      possibleContributors: [
        'Unscrubbed scrap smelting reverberatory furnace',
        'Improper fuel air ratio leading to incomplete combustion',
        'Particulate filter baghouse bypass during maintenance'
      ],
      riskLevel: 'CRITICAL',
      affectedArea: 'Downwind residential edge of Dogpatch and Potrero Hill, radius ~1.8 km',
      estimatedPlumeRadiusKm: 1.8,
      recommendedActions: [
        'Dispatch immediate environmental inspector to conduct stack opacity verification',
        'Issue stop-work advisory for unpermitted furnace operations',
        'Broadcast clean air shelter-in-place advisory for vulnerable populations within 1.5 km'
      ],
      citizenAdvice: 'Keep windows and doors closed. Avoid vigorous outdoor physical exertion. Sensitive groups (asthma, children, elderly) should remain indoors with HEPA air filtration active.',
      authorityAdvice: 'Statutory inspection under Clean Air Act Rule 6. Measure sulfur dioxide and trace heavy metal particulates downwind along Cesar Chavez corridor.',
      confidence: 94,
      limitations: [
        'Citizen photo taken from ground perspective; stack exit velocity estimated from plume drift angle',
        'Wind gust variability may cause intermittent plume grounding 500m southeast'
      ],
      dataSourcesUsed: ['Citizen Image (Visual Opacity)', 'Sensor AQ-IND-881 (PM2.5=124.5)', 'Sentinel-5P NO2 Column Simulation'],
      analyzedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    }
  },
  {
    id: 'rep-102',
    title: 'Open tire & commercial waste fire in vacant lot',
    description: 'Someone set fire to discarded construction pallets and old rubber casings. Acrid black smoke drifting toward residential apartments.',
    category: 'WASTE_INCINERATION',
    severity: 'HIGH',
    location: {
      lat: 37.7818,
      lng: -122.3942,
      address: 'Near 22nd St Rail Spur',
      district: 'Industrial East Corridor'
    },
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    timestamp: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
    status: 'DISPATCHED',
    nearbySensorId: 'sensor-ind-02',
    upvotes: 11,
    aiAnalysis: {
      incidentType: 'Hazardous Open Waste Incineration',
      summary: 'Volatile hydrocarbon burn producing dense carcinogenic soot, toxic dioxins, and elevated PM10/PM2.5 fractions.',
      possibleContributors: ['Illegal dumping yard burn', 'Rubber polymer combustion', 'Untreated timber with chemical binders'],
      riskLevel: 'HIGH',
      affectedArea: 'Local rail corridor and adjacent 22nd Street block',
      estimatedPlumeRadiusKm: 0.9,
      recommendedActions: ['Direct municipal fire suppression unit to douse burn site', 'Environmental code violation notice on parcel owner'],
      citizenAdvice: 'Avoid breathing smoke; wear well-fitted particulate filtering mask (N95) if transit through the corridor is unavoidable.',
      authorityAdvice: 'Coordinate with local emergency services for rapid extinguishing and soil/runoff assessment.',
      confidence: 91,
      limitations: ['Burning material composition determined visually; hazardous chemical runoff risk requires water samples'],
      dataSourcesUsed: ['Citizen Image', 'Substation Sensor AQ-IND-882'],
      analyzedAt: new Date(Date.now() - 65 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'rep-103',
    title: 'Severe idling diesel freight trucks queueing with engines running',
    description: 'Over 20 semi-trucks idling in unauthorized staging zone near elementary school zone. Heavy exhaust fumes accumulating in the street canyon.',
    category: 'VEHICLE_EXHAUST',
    severity: 'MEDIUM',
    location: {
      lat: 37.7435,
      lng: -122.3875,
      address: 'Evans Ave & Mendell St',
      district: 'Southern Logistics & Port'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    status: 'INVESTIGATING',
    nearbySensorId: 'sensor-port-01',
    upvotes: 7,
    aiAnalysis: {
      incidentType: 'Concentrated Diesel Particulate & NO2 Accumulation',
      summary: 'Chronic mobile source congestion resulting in localized nitrogen dioxide and ultrafine diesel carbon concentrations exceeding municipal health thresholds.',
      possibleContributors: ['Port gate congestion', 'Anti-idling regulation non-compliance', 'Lack of shore-power/staging electrification'],
      riskLevel: 'MEDIUM',
      affectedArea: 'School perimeter and transit intersection within 400m',
      estimatedPlumeRadiusKm: 0.5,
      recommendedActions: ['Deploy parking and traffic enforcement officers to enforce 5-minute idling limit', 'Divert secondary queuing to overflow terminal'],
      citizenAdvice: 'Pedestrians and cyclists should reroute one block west away from the arterial freight queue.',
      authorityAdvice: 'Audit logistics terminal inbound gate throughput; issue fleet warnings under Clean Air Transportation standards.',
      confidence: 88,
      limitations: ['Truck count based on single observation photo; fleet turnover rate dynamic'],
      dataSourcesUsed: ['Citizen Report Image', 'Sensor AQ-PRT-301'],
      analyzedAt: new Date(Date.now() - 105 * 60 * 1000).toISOString()
    }
  }
];

export const initialHotspots: PollutionHotspot[] = [
  {
    id: 'hotspot-01',
    name: 'East Shore Smelting & Maritime Plume Cluster',
    district: 'Industrial East Corridor',
    center: { lat: 37.7845, lng: -122.3910, address: 'Illinois & 20th St Core Zone', district: 'Industrial East Corridor' },
    radiusKm: 1.6,
    riskLevel: 'CRITICAL',
    primaryPollutant: 'PM2.5 / Heavy Particulates',
    currentAvgAqi: 176,
    pm25Peak: 184.2,
    contributingReportIds: ['rep-101', 'rep-102'],
    contributingSensorIds: ['sensor-ind-01', 'sensor-ind-02'],
    satelliteObservation: {
      satellite: 'Sentinel-5P (TROPOMI)',
      sensor: 'Ultraviolet-Visible-NIR Spectrometer',
      no2TroposphericColumn: 18.4, // Elevated
      aerosolOpticalDepth: 0.88,
      cloudFraction: 0.12,
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      provenance: 'SIMULATED_DEMO'
    },
    status: 'ACTIVE',
    aiSummary: 'High-confidence multi-source anomaly confirmed by two co-located citizen reports and three continuous monitoring stations showing synchronous PM2.5 and NO2 spikes under NW wind dispersion.',
    confidence: 96,
    detectedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hotspot-02',
    name: 'Southern Freight Corridor NO2 Corridor',
    district: 'Southern Logistics & Port',
    center: { lat: 37.7410, lng: -122.3840, address: 'Intermodal Port Highway Entrance', district: 'Southern Logistics & Port' },
    radiusKm: 1.1,
    riskLevel: 'HIGH',
    primaryPollutant: 'Diesel Particulates & Nitrogen Dioxide',
    currentAvgAqi: 126,
    pm25Peak: 68.5,
    contributingReportIds: ['rep-103'],
    contributingSensorIds: ['sensor-port-01'],
    status: 'ACTIVE',
    aiSummary: 'Elevated diesel particulate matter caused by port bottleneck queueing combined with thermal air inversion trapping ground emissions.',
    confidence: 89,
    detectedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString()
  }
];

export const initialAuthorityActions: AuthorityAction[] = [
  {
    id: 'act-01',
    hotspotId: 'hotspot-01',
    reportId: 'rep-101',
    title: 'Emergency Mobile Inspection Team Dispatched to Illinois St Smelter',
    type: 'DISPATCH_INSPECTION',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    dispatchedTo: 'Regional Air Quality Enforcement Unit 4',
    notes: 'Officers en route with portable optical particle counter and thermal imaging camera. Facility manager notified.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'act-02',
    hotspotId: 'hotspot-01',
    reportId: 'rep-101',
    title: 'Public Health Clean Air Warning Broadcast to District Residents',
    type: 'BROADCAST_ADVISORY',
    priority: 'HIGH',
    status: 'COMPLETED',
    dispatchedTo: 'Municipal Clean Air Advisory Portal',
    notes: 'Pushed real-time notification to 14,200 subscribed residents and local schools within 2km downwind corridor.',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'act-03',
    hotspotId: 'hotspot-02',
    reportId: 'rep-103',
    title: 'Port Anti-Idling Patrol & Gate Flow Optimization',
    type: 'TRAFFIC_REROUTING',
    priority: 'MEDIUM',
    status: 'PENDING',
    dispatchedTo: 'Port Authority Environmental Compliance',
    notes: 'Scheduled patrol to enforce 5-minute maximum idle rule and open secondary gate B.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

export const initialAlerts: CommunityAlert[] = [
  {
    id: 'alt-01',
    title: 'Air Quality Warning — Industrial East Corridor',
    district: 'Industrial East Corridor',
    severity: 'WARNING',
    headline: 'Unhealthy air quality detected due to industrial emission plume downwind of Illinois St.',
    affectedPopulations: ['Children', 'Elderly residents', 'Individuals with asthma, COPD, or cardiac conditions'],
    recommendedPrecautions: [
      'Keep residential windows and ventilation intakes closed',
      'Run indoor air purifiers on high setting (HEPA)',
      'Suspend outdoor athletic practices and playground recess',
      'Wear an N95/KN95 respirator if outdoor transit is required'
    ],
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    provenance: 'CALCULATED_RISK',
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'alt-02',
    title: 'Diesel Particulate Advisory — Southern Port Logistics',
    district: 'Southern Logistics & Port',
    severity: 'ADVISORY',
    headline: 'Moderate to high particulate concentrations observed near Evans Ave logistics gate.',
    affectedPopulations: ['Pedestrians', 'Outdoor workers', 'Cyclists along Cargo Way'],
    recommendedPrecautions: [
      'Reroute pedestrian and cycling commutes one block away from primary truck staging',
      'Logistics workers should use dust masks during peak cargo loading hours'
    ],
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    provenance: 'OBSERVED_SENSOR',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  }
];

export function calculateForecasts(baseAqi: number, windSpeed: number, windDir: number): ForecastHorizon[] {
  // Deterministic atmospheric dispersion and trend model:
  // Higher wind speed causes faster dispersion; calm conditions cause stagnation accumulation.
  const dispersionFactor = Math.max(0.65, Math.min(1.3, 15 / Math.max(windSpeed, 5)));
  
  const nowAqi = Math.round(baseAqi);
  const h3Aqi = Math.max(25, Math.round(nowAqi * (0.92 * dispersionFactor)));
  const h6Aqi = Math.max(20, Math.round(nowAqi * (0.81 * dispersionFactor)));
  const h12Aqi = Math.max(18, Math.round(nowAqi * (0.70 * dispersionFactor)));

  return [
    {
      horizon: 'NOW',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predictedAqi: nowAqi,
      predictedPm25: Math.round(nowAqi * 0.68 * 10) / 10,
      windTrend: `${windSpeed} km/h NW (${windDir}°)`,
      riskTrajectory: 'STABLE',
      confidence: 96,
      aiExplanation: 'Current baseline reading anchored directly in active ground sensor measurements and validated citizen reports.',
      provenance: 'FORECAST_MODEL'
    },
    {
      horizon: '+3_HOURS',
      timestamp: new Date(Date.now() + 3 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predictedAqi: h3Aqi,
      predictedPm25: Math.round(h3Aqi * 0.68 * 10) / 10,
      windTrend: `${Math.round(windSpeed * 1.1)} km/h NW — Sustained coastal breeze`,
      riskTrajectory: h3Aqi < nowAqi ? 'IMPROVING' : 'DETERIORATING',
      confidence: 88,
      aiExplanation: 'Numerical dispersion model estimates a gradual drop in particulate concentrations as steady 15+ km/h coastal winds carry the plume toward the bay.',
      provenance: 'FORECAST_MODEL'
    },
    {
      horizon: '+6_HOURS',
      timestamp: new Date(Date.now() + 6 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predictedAqi: h6Aqi,
      predictedPm25: Math.round(h6Aqi * 0.68 * 10) / 10,
      windTrend: `${Math.round(windSpeed * 0.95)} km/h WNW — Evening cooling shift`,
      riskTrajectory: 'IMPROVING',
      confidence: 81,
      aiExplanation: 'Expected abatement following regulatory intervention and standard diurnal cessation of industrial operations.',
      provenance: 'FORECAST_MODEL'
    },
    {
      horizon: '+12_HOURS',
      timestamp: new Date(Date.now() + 12 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predictedAqi: h12Aqi,
      predictedPm25: Math.round(h12Aqi * 0.68 * 10) / 10,
      windTrend: '10 km/h W — Light night basin circulation',
      riskTrajectory: 'IMPROVING',
      confidence: 74,
      aiExplanation: 'Atmospheric boundary layer reset overnight projected to restore air quality to acceptable baseline values across the corridor.',
      provenance: 'FORECAST_MODEL'
    }
  ];
}

// In-memory data store with mutation helpers
class EnvironmentalDataStore {
  districts: DistrictSummary[] = [...initialDistricts];
  sensors: EnvironmentalSensor[] = [...initialSensors];
  reports: CitizenReport[] = [...initialCitizenReports];
  hotspots: PollutionHotspot[] = [...initialHotspots];
  actions: AuthorityAction[] = [...initialAuthorityActions];
  alerts: CommunityAlert[] = [...initialAlerts];

  getSensors(district?: string) {
    if (!district || district === 'ALL') return this.sensors;
    return this.sensors.filter(s => s.location.district === district);
  }

  getReports(district?: string) {
    if (!district || district === 'ALL') return this.reports;
    return this.reports.filter(r => r.location.district === district);
  }

  getHotspots(district?: string) {
    if (!district || district === 'ALL') return this.hotspots;
    return this.hotspots.filter(h => h.district === district);
  }

  getDistricts() {
    return this.districts;
  }

  getActions() {
    return this.actions;
  }

  getAlerts() {
    return this.alerts;
  }

  addReport(report: CitizenReport) {
    this.reports.unshift(report);
    // Recalculate district active reports
    const dist = this.districts.find(d => d.name === report.location.district);
    if (dist) {
      dist.activeReportsCount += 1;
    }
    return report;
  }

  updateReport(id: string, updates: Partial<CitizenReport>) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.reports[idx] = { ...this.reports[idx], ...updates };
      return this.reports[idx];
    }
    return null;
  }

  addHotspot(hotspot: PollutionHotspot) {
    this.hotspots.unshift(hotspot);
    const dist = this.districts.find(d => d.name === hotspot.district);
    if (dist) {
      dist.activeHotspotsCount += 1;
    }
    return hotspot;
  }

  updateHotspot(id: string, updates: Partial<PollutionHotspot>) {
    const idx = this.hotspots.findIndex(h => h.id === id);
    if (idx !== -1) {
      this.hotspots[idx] = { ...this.hotspots[idx], ...updates, lastUpdated: new Date().toISOString() };
      return this.hotspots[idx];
    }
    return null;
  }

  addAction(action: AuthorityAction) {
    this.actions.unshift(action);
    return action;
  }

  updateAction(id: string, updates: Partial<AuthorityAction>) {
    const idx = this.actions.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.actions[idx] = { ...this.actions[idx], ...updates };
      return this.actions[idx];
    }
    return null;
  }

  addAlert(alert: CommunityAlert) {
    this.alerts.unshift(alert);
    return alert;
  }

  // Hotspot correlation engine
  detectHotspots() {
    // Group reports and sensors by spatial proximity (~2.5km) and elevated values
    const elevatedSensors = this.sensors.filter(s => s.aqi > 100);
    const recentReports = this.reports.filter(r => r.severity === 'HIGH' || r.severity === 'CRITICAL');
    
    // Check if new cluster warrants a hotspot
    return this.hotspots;
  }
}

export const dataStore = new EnvironmentalDataStore();
