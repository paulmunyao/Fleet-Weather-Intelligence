// ─── WeatherAI API — Shared TypeScript Interfaces ───────────────────────────

export interface GeoLocation {
  lat: number;
  lon: number;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
}

// A user-defined fleet stop (persisted in localStorage)
export interface FleetLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  addedAt: string; // ISO string
}

// ─── /v1/weather ─────────────────────────────────────────────────────────────

export interface CurrentConditions {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg?: number;
  pressure?: number;
  visibility?: number;
  uv_index?: number;
  condition: string;
  icon?: string;
  description?: string;
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon?: string;
  description?: string;
  precipitation_mm?: number;
  precipitation_prob?: number;
  wind_speed?: number;
  humidity?: number;
}

export interface WeatherResponse {
  location: GeoLocation & { name?: string };
  current: CurrentConditions;
  forecast: DailyForecast[];
  ai_summary?: string;
  units: "metric" | "imperial";
}

// ─── /v1/hourly ──────────────────────────────────────────────────────────────

export interface HourlyEntry {
  time: string; // ISO string
  temp: number;
  feels_like?: number;
  condition: string;
  icon?: string;
  precipitation_mm?: number;
  precipitation_prob?: number;
  wind_speed?: number;
  humidity?: number;
}

export interface HourlyResponse {
  location: GeoLocation;
  hourly: HourlyEntry[];
  units: "metric" | "imperial";
}

// ─── /v1/insights (PRO+) ─────────────────────────────────────────────────────

export interface InsightsResponse {
  location: GeoLocation;
  risk_flags: string[]; // e.g. ["extreme_wind", "frost_risk"]
  recommendations: string[];
  agronomic_context?: string;
  ai_summary?: string;
  current: CurrentConditions;
  forecast: DailyForecast[];
  units: "metric" | "imperial";
}

// ─── /v1/usage ───────────────────────────────────────────────────────────────

export interface UsageResponse {
  requests: number;
  ai_requests: number;
  limit: number;
  remaining: number;
  period_start: string;
  period_end: string;
  plan?: string;
}

// ─── /v1/ip-lookup ───────────────────────────────────────────────────────────

export interface IpLookupResponse {
  ip: string;
  ip_hash?: string;
  ip_version?: string;
  geo: GeoLocation;
}

// ─── /v1/webhooks ────────────────────────────────────────────────────────────

export type WebhookTrigger = "rain" | "extreme_wind" | "frost" | "drought";

export interface Webhook {
  id: string;
  url: string;
  lat: number;
  lon: number;
  triggers: WebhookTrigger[];
  timezone?: string;
  active: boolean;
  createdAt: string;
}

export interface WebhooksListResponse {
  webhooks: Webhook[];
}

export interface CreateWebhookPayload {
  url: string;
  lat: number;
  lon: number;
  triggers: WebhookTrigger[];
  timezone?: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type Units = "metric" | "imperial";

export type LoadState = "idle" | "loading" | "success" | "error";

export interface WeatherCardState {
  weather: WeatherResponse | null;
  hourly: HourlyResponse | null;
  insights: InsightsResponse | null;
  loadState: LoadState;
  error?: string;
}
