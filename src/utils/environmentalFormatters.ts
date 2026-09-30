import { DataProvenance } from '../types/environmental';

export function getAqiCategory(aqi: number) {
  if (aqi <= 50) {
    return {
      label: 'Good',
      color: 'text-emerald-500 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500',
      description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      color: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500',
      description: 'Air quality is acceptable; however, sensitive groups may experience minor respiratory effects.',
    };
  }
  if (aqi <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: 'text-orange-500 dark:text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
      badgeBg: 'bg-orange-500',
      description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Unhealthy',
      color: 'text-rose-500 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500',
      description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.',
    };
  }
  if (aqi <= 300) {
    return {
      label: 'Very Unhealthy',
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500',
      description: 'Health alert: The risk of health effects is increased for everyone.',
    };
  }
  return {
    label: 'Hazardous',
    color: 'text-red-700 dark:text-red-500',
    bgColor: 'bg-red-700/10 border-red-700/30 text-red-700 dark:text-red-400',
    badgeBg: 'bg-red-700',
    description: 'Health warning of emergency conditions: The entire population is more likely to be affected.',
  };
}

export function getProvenanceBadge(provenance: DataProvenance) {
  switch (provenance) {
    case 'OBSERVED_SENSOR':
      return {
        label: 'Observed (IoT Sensor)',
        tag: 'REAL SENSOR',
        className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
        hint: 'Calibrated continuous optical/electrochemical ground monitor',
      };
    case 'CITIZEN_REPORT':
      return {
        label: 'Citizen Evidence',
        tag: 'CITIZEN REPORT',
        className: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30',
        hint: 'Crowdsourced community observation and photo verification',
      };
    case 'SATELLITE_OBSERVATION':
      return {
        label: 'Satellite Observation',
        tag: 'SATELLITE (Sentinel-5P)',
        className: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30',
        hint: 'Tropospheric trace gas column density retrieval (Sentinel-5P TROPOMI)',
      };
    case 'CALCULATED_RISK':
      return {
        label: 'Calculated Risk',
        tag: 'DATA FUSION RISK',
        className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
        hint: 'Fused deterministic multi-sensor anomaly calculation',
      };
    case 'FORECAST_MODEL':
      return {
        label: 'Dispersion Forecast',
        tag: 'ATMOSPHERIC MODEL',
        className: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
        hint: 'Numerical meteorological dispersion & wind vector projection',
      };
    case 'SIMULATED_DEMO':
    default:
      return {
        label: 'Simulated Demo Data',
        tag: 'SIMULATED / DEMO',
        className: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30',
        hint: 'Clearly labeled synthetic validation data for hackathon testing',
      };
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return 'Recently';
  }
}
