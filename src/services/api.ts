import { 
  EnvironmentalSensor, 
  CitizenReport, 
  PollutionHotspot, 
  AuthorityAction, 
  CommunityAlert, 
  DistrictSummary,
  ForecastHorizon 
} from '../types/environmental';

export async function fetchHealth() {
  const res = await fetch('/api/health');
  return res.json();
}

export async function fetchDistricts(): Promise<DistrictSummary[]> {
  const res = await fetch('/api/districts');
  return res.json();
}

export async function fetchSensors(district?: string): Promise<EnvironmentalSensor[]> {
  const url = district && district !== 'ALL' 
    ? `/api/sensors?district=${encodeURIComponent(district)}`
    : '/api/sensors';
  const res = await fetch(url);
  return res.json();
}

export async function fetchHotspots(district?: string): Promise<PollutionHotspot[]> {
  const url = district && district !== 'ALL'
    ? `/api/hotspots?district=${encodeURIComponent(district)}`
    : '/api/hotspots';
  const res = await fetch(url);
  return res.json();
}

export async function fetchReports(district?: string): Promise<CitizenReport[]> {
  const url = district && district !== 'ALL'
    ? `/api/reports?district=${encodeURIComponent(district)}`
    : '/api/reports';
  const res = await fetch(url);
  return res.json();
}

export async function submitCitizenReport(data: {
  title: string;
  description: string;
  category: string;
  severity: string;
  location: { lat?: number; lng?: number; address?: string; district: string };
  imageUrl?: string;
  imageBase64?: string;
  audioTranscript?: string;
}): Promise<CitizenReport> {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit report');
  }
  return res.json();
}

export async function upvoteReport(id: string): Promise<{ id: string; upvotes: number }> {
  const res = await fetch(`/api/reports/${id}/upvote`, { method: 'POST' });
  return res.json();
}

export async function fetchForecast(district?: string): Promise<{
  district: string;
  currentAqi: number;
  forecasts: ForecastHorizon[];
  provenance: string;
  notes: string;
}> {
  const url = district && district !== 'ALL'
    ? `/api/forecast?district=${encodeURIComponent(district)}`
    : '/api/forecast';
  const res = await fetch(url);
  return res.json();
}

export async function fetchActions(): Promise<AuthorityAction[]> {
  const res = await fetch('/api/actions');
  return res.json();
}

export async function createAuthorityAction(data: {
  hotspotId?: string;
  reportId?: string;
  title: string;
  type: string;
  priority: string;
  dispatchedTo: string;
  notes: string;
}): Promise<AuthorityAction> {
  const res = await fetch('/api/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateAuthorityAction(id: string, updates: Partial<AuthorityAction>): Promise<AuthorityAction> {
  const res = await fetch(`/api/actions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function fetchAlerts(): Promise<CommunityAlert[]> {
  const res = await fetch('/api/alerts');
  return res.json();
}

export async function fetchFederatedSummary(): Promise<any> {
  const res = await fetch('/api/federated-summary');
  return res.json();
}
