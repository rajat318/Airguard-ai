# AirGuard AI — Project Audit & Architecture Assessment
**Track:** Track 2 — Clean Air & Climate Resilience  
**Hackathon:** Build with AI: Code for Communities — Second Edition  
**Audit Timestamp:** 2026-09-28  

---

## 1. Current Architecture

- **Frontend Runtime:** React 19 SPA running on Vite 8 with Tailwind CSS v4.
- **Backend Runtime:** Express 4 and tsx present in dependencies, but currently Vite dev server runs as a standalone static bundler (`"dev": "vite --port=3000 --host=0.0.0.0"`). No `server.ts` entry point is wired yet.
- **AI SDK:** `@google/genai` (v2.4.0) is installed. No server-side API endpoints or prompt orchestrations exist yet.
- **Styling:** `@tailwindcss/vite` (v4.3.3) configured in `vite.config.ts`, standard `@import "tailwindcss";` in `src/index.css`.
- **Icons & Motion:** `lucide-react` (v0.546.0) and `motion` (v12.23.24) available.
- **Environment:** `.env.example` defines `GEMINI_API_KEY` and `APP_URL`.

---

## 2. Existing Functionality

- Clean baseline React 19 + TypeScript + Vite project.
- Basic placeholder component in `src/App.tsx` (`<div></div>`).
- Metadata configured with `AirGuard AI` and `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`.
- HTML entry point synchronized with project identity and meta descriptions.

---

## 3. Missing Functionality

1. **Full-Stack Express Integration (`server.ts`):**
   - Need Express server serving `/api/*` endpoints with Vite middleware in development to securely handle backend Gemini multimodal reasoning, data ingestion, and simulation engines without leaking `GEMINI_API_KEY`.
2. **Data Model & In-Memory / Flexible Storage Store:**
   - Citizen incident reports (text, images, GPS coords, category, severity, timestamp, status).
   - Sensor network nodes (PM2.5, PM10, AQI, CO2, NO2, O3, temperature, humidity, wind).
   - Satellite & geospatial observation layers (Sentinel-5P NO2 tropospheric column simulation/adapter, aerosol optical depth).
   - Hotspot clustering and correlation records.
   - Authority actions and interventions ledger.
   - Community alert broadcasting queue.
3. **Data Fusion & Hotspot Detection Engine:**
   - Deterministic clustering logic combining spatial proximity (< 2.5 km), temporal window (< 3 hours), sensor threshold exceedance (e.g. PM2.5 > 55 µg/m³), and citizen incident clustering.
   - Distinct classification of data provenance: `Observed (Sensor)`, `Citizen Reported`, `Satellite Observation`, `Calculated Risk`, `Forecast (Trend Model)`, `Simulated/Demo`.
4. **Multimodal Gemini AI Engine:**
   - Server-side analysis using `@google/genai` (`gemini-3.8-flash`) with structured schema output (`responseMimeType: "application/json"`, strict type schemas).
   - Analyzes citizen report text + base64 photos + co-located sensor data + weather conditions.
   - Explicitly instructed never to hallucinate measurements; distinguishes evidence from hypothesis.
5. **Interactive Environmental Map & Spatial UI:**
   - Interactive visual map with sensor pins, citizen incident markers, hotspot polygons/heat zones, wind vectors, and satellite raster overlays.
   - Click-to-inspect detail drawer for any node showing raw data, sensor confidence, Gemini multimodal diagnostic, and authority dispatch controls.
6. **Citizen Reporting Module:**
   - Geo-tagged reporting form with image upload (camera/file with preview & EXIF/location fallback), category picker, severity, and instant AI pre-validation preview.
7. **Predictive Forecasting & Risk Module:**
   - Multi-horizon trend prediction (Now, +3h, +6h, +12h) based on meteorological dispersion (wind speed/direction, atmospheric pressure) and historical regression.
   - Gemini natural-language explanatory narrative grounded purely on the deterministic numerical model.
8. **Authority Action Center & Response Command:**
   - Triage priority queue for environmental protection officers, municipal inspectors, and emergency responders.
   - Direct action triggers ("Dispatch Field Inspection", "Issue Containment Order", "Broadcast Local Clean Air Advisory", "Mobilize Mobile Air Cleaner / Mist Cannon").
9. **Citizen Warnings & Clean Air Guidance:**
   - Actionable precautions (vulnerable groups, schools, outdoor activity restrictions, N95 advice, ventilation guidance) strictly avoiding non-validated medical claims.
10. **Impact & Regional Interoperability / Federated Intelligence:**
    - High-level metrics: validated incidents, early hotspot interventions, estimated population protected, resolution cycle time.
    - Federated multi-jurisdiction architecture demo showing cross-district environmental data sharing without centralizing sensitive municipal raw databases.

---

## 4. Technical Risks & Mitigation

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **API Key Exposure in Browser** | High / Security violation | Keep all `@google/genai` logic strictly inside Express `/api/*` endpoints. Never import SDK or access `process.env.GEMINI_API_KEY` on client. |
| **Model Hallucination of Environmental Data** | High / Product Integrity | Enforce Rule 4 & 5: Hardcode strict system prompts. Gemini receives normalized sensor numbers and produces diagnostic explanations; it never generates ground truth sensor numbers. Clear badges (`[REAL SENSOR]`, `[SIMULATED SATELLITE]`, `[AI INFERENCE]`). |
| **Heavy GIS / Map Library Failures** | Medium | Implement an ultra-responsive, high-performance geospatial canvas/SVG map with interactive pan/zoom, layer toggling, clustering, and coordinates, with zero third-party map token lock-in or billing breaks. |
| **AI Latency During Citizen Submission** | Medium | Provide instant deterministic ingestion (< 50ms) with optimism, followed by asynchronous or progressive Gemini multimodal verification with live status indicator. |
| **Database Connectivity in Ephemeral Cloud Sandboxes** | Medium | Build a dual-layer store: a robust persistent MongoDB connector when `MONGODB_URI` is provided, paired with an intelligent in-memory transactional mock repository seeded with rich realistic urban data for seamless zero-config local/cloud sandbox execution. |

---

## 5. Recommended Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 REACT 19 FRONTEND UI                   │
                  │  - Interactive Environmental Map & Layer Switcher      │
                  │  - Real-time Air Quality & Weather Metrics             │
                  │  - Citizen Multimodal Report Form (Photo + GPS)        │
                  │  - Hotspot Explorer & Multimodal Evidence Inspector    │
                  │  - Authority Action & Dispatch Command Center          │
                  │  - Community Alerts & Public Health Advisory           │
                  │  - Impact Dashboard & Federated District Intelligence  │
                  └───────────────────────────┬────────────────────────────┘
                                              │ REST / JSON
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 EXPRESS FULL-STACK BACKEND             │
                  │                  (`server.ts` on port 3000)            │
                  ├────────────────────────────────────────────────────────┤
                  │ 1. Data Ingestion & Normalization Service              │
                  │    - Citizen Reports, IoT Sensor Feeds, Weather        │
                  │ 2. Deterministic Hotspot & Fusion Engine               │
                  │    - Proximity Clustering (DBSCAN / Radius filter)     │
                  │    - Anomaly & AQI Exceedance Calculations             │
                  │ 3. Gemini Multimodal Reasoning Agent                   │
                  │    - Structured JSON schemas via @google/genai         │
                  │    - Strict grounding against observed measurements    │
                  │ 4. Dispersion & Forecast Calculation Engine            │
                  │    - Atmospheric trend modeling (Now, +3h, +6h, +12h)   │
                  │ 5. Authority Action & Alert Dispatcher                 │
                  └───────────────────────────┬────────────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │     @google/genai       │                     │    Data Storage Engine  │
         │  (gemini-3.8-flash)     │                     │  - MongoDB / In-Memory  │
         │  Server-side API keys   │                     │  - GeoJSON spatial data │
         └─────────────────────────┘                     └─────────────────────────┘
```

---

## 6. Development Phases

- **Phase 1: Project Foundation & Full-Stack Server**
  - Setup Express `server.ts` with Vite middlewares.
  - Implement API structure (`/api/health`, `/api/sensors`, `/api/reports`, `/api/hotspots`, `/api/analyze`, `/api/forecast`, `/api/actions`).
  - Create robust shared TypeScript types for all environmental entities.
- **Phase 2: Air Quality Dashboard & Metric Cards**
  - Implement AQI, PM2.5, PM10, NO2, Weather cards with clear provenance badges.
  - Quick region switch (Urban Core, Industrial Corridor, Residential Basin, Port District).
- **Phase 3: Interactive Environmental Map**
  - Layer-toggleable spatial map with sensor stations, citizen reports, hotspot contours, and simulated satellite smoke/plume rasters.
  - Click-to-inspect evidence drawer.
- **Phase 4: Citizen Reporting Module**
  - Multimodal form: text, photo upload with client compression, location selection, category, severity.
- **Phase 5: Gemini Multimodal Reasoning Engine**
  - Express endpoint `/api/reports/analyze` using `@google/genai` `gemini-3.8-flash` with strict structured JSON schema.
- **Phase 6: Deterministic Hotspot Detection & Sensor Fusion**
  - Correlation logic: multi-report clustering + sensor threshold spikes + wind trajectory.
- **Phase 7: Weather & Atmospheric Dispersion Modeling**
  - Wind speed/direction correlation with plume drift.
- **Phase 8: Satellite & Earth Engine Observation Layer**
  - Simulated Sentinel-5P NO2 / Tropospheric Aerosol adapter with clear labeling.
- **Phase 9: Pollution Risk Forecasting**
  - Deterministic +3h, +6h, +12h forecasting with Gemini scientific narrative.
- **Phase 10: Authority Action Center**
  - Triage management: inspection dispatch, emission notices, mist cannons, containment.
- **Phase 11: Community Alert & Protection Center**
  - Citizen warnings, sensitive group guidance, downloadable or copyable community bulletins.
- **Phase 12: Community Impact Dashboard**
  - Key performance indicators, resolution velocity, pollution mitigation impact.
- **Phase 13: Federated Cross-District Intelligence**
  - Architectural demo showing federated learning / aggregated cross-region analytics without exposing private local data.
- **Phase 14 & 15: Security Audit, Mobile Responsiveness & Hackathon Polish**
  - Input sanitation, payload limits, empty states, zero console warnings, end-to-end demo flow.

---

## 7. Dependencies Required

- `@google/genai` (Installed: `^2.4.0`)
- `express` (Installed: `^4.21.2`)
- `@types/express` (Installed: `^4.17.21`)
- `tsx` (Installed: `^4.21.0`)
- `lucide-react` (Installed: `^0.546.0`)
- `motion` (Installed: `^12.23.24`)
- All required core dependencies are already present in `package.json`. No unneeded bloat required.

---

## 8. Security Concerns

- **API Secret Isolation:** `process.env.GEMINI_API_KEY` must never be referenced in client bundle.
- **Input Validation:** Citizen report payloads, images, and coordinates must be sanitized and bounded (image payload capped at 5MB, coords within valid lat/lng).
- **CORS / Proxy:** Dev server runs both frontend and backend on port 3000 via Vite middleware.

---

## 9. Testing Strategy

1. TypeScript build validation via `compile_applet`.
2. API endpoint verification using internal test fetches (`/api/health`, `/api/sensors`, `/api/hotspots`, `/api/reports`).
3. Multimodal analysis test with sample citizen report and photo.
4. Edge-case testing: invalid inputs, empty states, offline/missing API key fallback.

---

## 10. Hackathon Demo Strategy

- **Step 1:** Platform overview displaying real-time sensor network, satellite overlay, and AQI status.
- **Step 2:** Citizen encounters an illegal midnight trash burn or factory plume and submits a photo report with GPS.
- **Step 3:** System fuses citizen report with co-located IoT sensor spike (PM2.5 surged to 184 µg/m³).
- **Step 4:** Deterministic hotspot detection fires and triggers Gemini Multimodal Reasoning.
- **Step 5:** Gemini analyzes the image, identifies particulate smoke characteristics, assesses risk level, and generates structured advice.
- **Step 6:** Forecast engine models plume dispersion over next 6 hours based on NW winds.
- **Step 7:** Authority Action Center receives actionable alert; officer dispatches mobile rapid response unit.
- **Step 8:** Community Alert automatically published for nearby schools and elderly residents.
- **Step 9:** Impact dashboard shows closed-loop resolution and district-wide clean air gains.
