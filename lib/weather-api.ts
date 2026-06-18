// ─── WeatherAI API — Server-Side Fetch Helpers ───────────────────────────────
// Used exclusively inside Route Handlers. Never imported by client components.

import type {
  WeatherResponse,
  HourlyResponse,
  InsightsResponse,
  UsageResponse,
  IpLookupResponse,
  WebhooksListResponse,
  CreateWebhookPayload,
  Webhook,
  Units,
} from "./types";

const BASE_URL = "https://api.weather-ai.co/v1";

function getKey(): string {
  const key = process.env.WAI_API_KEY;
  if (!key || key === "wai_your_key_here") {
    throw new Error("WAI_API_KEY is not configured. Add it to .env.local.");
  }
  return key;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getKey()}`,
    "Content-Type": "application/json",
  };
}

// Shared fetch wrapper with error surfacing
async function waiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    cache: "no-store", // weather data is always fresh
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WeatherAI ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ─── Endpoint helpers ─────────────────────────────────────────────────────────

export async function fetchWeather(
  lat: number,
  lon: number,
  opts: { units?: Units; days?: number; ai?: boolean } = {}
): Promise<WeatherResponse> {
  return waiGet<WeatherResponse>("/weather", {
    lat: String(lat),
    lon: String(lon),
    units: opts.units ?? "metric",
    days: String(opts.days ?? 7),
    ai: String(opts.ai ?? true),
  });
}

export async function fetchHourly(
  lat: number,
  lon: number,
  units: Units = "metric"
): Promise<HourlyResponse> {
  return waiGet<HourlyResponse>("/hourly", {
    lat: String(lat),
    lon: String(lon),
    units,
  });
}

export async function fetchForecast14(
  lat: number,
  lon: number,
  units: Units = "metric"
): Promise<WeatherResponse> {
  return waiGet<WeatherResponse>("/forecast14", {
    lat: String(lat),
    lon: String(lon),
    units,
    days: "14",
  });
}

export async function fetchInsights(
  lat: number,
  lon: number,
  units: Units = "metric"
): Promise<InsightsResponse> {
  return waiGet<InsightsResponse>("/insights", {
    lat: String(lat),
    lon: String(lon),
    units,
  });
}

export async function fetchUsage(): Promise<UsageResponse> {
  return waiGet<UsageResponse>("/usage");
}

export async function fetchIpLookup(ip = "auto"): Promise<IpLookupResponse> {
  return waiGet<IpLookupResponse>("/ip-lookup", { ip });
}

export async function fetchWebhooks(): Promise<WebhooksListResponse> {
  return waiGet<WebhooksListResponse>("/webhooks");
}

export async function createWebhook(payload: CreateWebhookPayload): Promise<Webhook> {
  const res = await fetch(`${BASE_URL}/webhooks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WeatherAI ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<Webhook>;
}

export async function deleteWebhook(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/webhooks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WeatherAI ${res.status}: ${body || res.statusText}`);
  }
}
