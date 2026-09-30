export type DataProvenance = 
  | 'OBSERVED_SENSOR'
  | 'CITIZEN_REPORT'
  | 'SATELLITE_OBSERVATION'
  | 'CALCULATED_RISK'
  | 'FORECAST_MODEL'
  | 'SIMULATED_DEMO';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'CRITICAL';

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  district: string;
}

export interface EnvironmentalSensor {
  id: string;
  stationId: string;
  stationName: string;
  location: GeoLocation;
  timestamp: string;
  aqi: number; // 0 - 500
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number; // ppb
  co: number; // ppm
  so2: number; // ppb
  o3: number; // ppb
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // 0 - 360 degrees
  windDirectionCardinal: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  pressure: number; // hPa
  provenance: DataProvenance;
  status: 'ONLINE' | 'CALIBRATING' | 'ALERT';
}

export type CitizenReportCategory = 
  | 'INDUSTRIAL_EMISSIONS'
  | 'VEHICLE_EXHAUST'
  | 'AGRICULTURAL_BURNING'
  | 'CONSTRUCTION_DUST'
  | 'WASTE_INCINERATION'
  | 'ODOR_CHEMICAL'
  | 'OTHER';

export interface AIIncidentAnalysis {
  incidentType: string;
  summary: string;
  possibleContributors: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedArea: string;
  estimatedPlumeRadiusKm: number;
  recommendedActions: string[];
  citizenAdvice: string;
  authorityAdvice: string;
  confidence: number; // 0 - 100
  limitations: string[];
  dataSourcesUsed: string[];
  analyzedAt: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  description: string;
  category: CitizenReportCategory;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: GeoLocation;
  imageUrl?: string;
  audioTranscript?: string;
  timestamp: string;
  status: 'PENDING_AI' | 'VERIFIED_HOTSPOT' | 'INVESTIGATING' | 'DISPATCHED' | 'RESOLVED' | 'DISMISSED';
  aiAnalysis?: AIIncidentAnalysis;
  nearbySensorId?: string;
  upvotes: number;
}

export interface SatelliteObservation {
  satellite: string; // e.g. Sentinel-5P TROPOMI
  sensor: string;
  no2TroposphericColumn: number; // 10^15 molec/cm2
  aerosolOpticalDepth: number; // 0 - 1.5
  cloudFraction: number;
  timestamp: string;
  provenance: 'SIMULATED_DEMO' | 'SATELLITE_OBSERVATION';
  tileUrl?: string;
}

export interface PollutionHotspot {
  id: string;
  name: string;
  district: string;
  center: GeoLocation;
  radiusKm: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primaryPollutant: string;
  currentAvgAqi: number;
  pm25Peak: number;
  contributingReportIds: string[];
  contributingSensorIds: string[];
  satelliteObservation?: SatelliteObservation;
  status: 'ACTIVE' | 'DISPATCHED' | 'CONTAINING' | 'RESOLVED';
  aiSummary: string;
  confidence: number;
  detectedAt: string;
  lastUpdated: string;
}

export interface ForecastHorizon {
  horizon: 'NOW' | '+3_HOURS' | '+6_HOURS' | '+12_HOURS';
  timestamp: string;
  predictedAqi: number;
  predictedPm25: number;
  windTrend: string;
  riskTrajectory: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
  confidence: number;
  aiExplanation: string;
  provenance: 'FORECAST_MODEL';
}

export interface AuthorityAction {
  id: string;
  hotspotId?: string;
  reportId?: string;
  title: string;
  type: 'DISPATCH_INSPECTION' | 'ISSUE_CITATION' | 'BROADCAST_ADVISORY' | 'MIST_CANNON_DEPLOYMENT' | 'TRAFFIC_REROUTING' | 'FACTORY_CURTAILMENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dispatchedTo: string;
  notes: string;
  timestamp: string;
  resolvedAt?: string;
}

export interface CommunityAlert {
  id: string;
  title: string;
  district: string;
  severity: 'ADVISORY' | 'WARNING' | 'EMERGENCY';
  headline: string;
  affectedPopulations: string[];
  recommendedPrecautions: string[];
  timestamp: string;
  provenance: DataProvenance;
  expiresAt: string;
}

export interface DistrictSummary {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  avgAqi: number;
  dominantRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  activeHotspotsCount: number;
  activeReportsCount: number;
  sensorsOnline: number;
}
