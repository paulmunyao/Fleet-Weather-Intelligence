"use client";

import { useState, useEffect, useCallback } from "react";
import type { FleetLocation, WeatherResponse, HourlyResponse, InsightsResponse, Units } from "@/lib/types";
import WeatherIcon from "./WeatherIcon";
import HourlyTimeline from "./HourlyTimeline";
import ForecastStrip from "./ForecastStrip";
import InsightsPanel from "./InsightsPanel";

interface LocationCardProps {
  location: FleetLocation;
  units: Units;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

type Tab = "forecast" | "hourly" | "insights";

export default function LocationCard({ location, units, isSelected, onSelect, onRemove }: LocationCardProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [hourly, setHourly] = useState<HourlyResponse | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("forecast");
  const [loadingHourly, setLoadingHourly] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}&units=${units}&days=7`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch weather");
      setWeather(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error fetching weather");
    } finally {
      setLoading(false);
    }
  }, [location.lat, location.lon, units]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  const loadHourly = useCallback(async () => {
    if (hourly) return;
    setLoadingHourly(true);
    try {
      const res = await fetch(`/api/hourly?lat=${location.lat}&lon=${location.lon}&units=${units}`);
      const data = await res.json();
      if (res.ok) setHourly(data);
    } finally {
      setLoadingHourly(false);
    }
  }, [hourly, location.lat, location.lon, units]);

  const loadInsights = useCallback(async () => {
    if (insights) return;
    setLoadingInsights(true);
    try {
      const res = await fetch(`/api/insights?lat=${location.lat}&lon=${location.lon}&units=${units}`);
      const data = await res.json();
      if (res.ok) setInsights(data);
    } finally {
      setLoadingInsights(false);
    }
  }, [insights, location.lat, location.lon, units]);

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    if (tab === "hourly") loadHourly();
    if (tab === "insights") loadInsights();
  }

  const unit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "km/h" : "mph";

  return (
    <div
      className={`glass-card animate-card-enter${isSelected ? " glass-card-active" : ""}`}
      style={{ borderRadius: "20px", overflow: "hidden", cursor: "pointer" }}
      onClick={onSelect}
    >
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "2px" }}>
            {location.name}
          </h3>
          <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
            {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
          </p>
        </div>
        <button
          className="btn-danger"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          title="Remove location"
          style={{ padding: "5px 10px", fontSize: "0.7rem" }}
        >
          ✕
        </button>
      </div>

      {/* Current Weather */}
      <div style={{ padding: "16px 20px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="skeleton" style={{ height: "48px", width: "80px" }} />
            <div className="skeleton" style={{ height: "16px", width: "120px" }} />
            <div className="skeleton" style={{ height: "14px", width: "180px" }} />
          </div>
        ) : error ? (
          <div style={{ padding: "16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px" }}>
            <p style={{ fontSize: "0.8rem", color: "#f87171" }}>
              {error.includes("not configured") ? "⚙️ API key not configured — add WAI_API_KEY to .env.local" : `⚠️ ${error}`}
            </p>
            <button className="btn-ghost" onClick={(e) => { e.stopPropagation(); fetchWeather(); }} style={{ marginTop: "8px", fontSize: "0.75rem", padding: "5px 12px" }}>
              Retry
            </button>
          </div>
        ) : weather ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <WeatherIcon condition={weather.current.condition} size={52} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 800, color: "var(--color-text-primary)", lineHeight: 1 }}>
                  {Math.round(weather.current.temp)}{unit}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                  {weather.current.condition}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                  Feels like {Math.round(weather.current.feels_like)}{unit}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "16px", marginTop: "14px", flexWrap: "wrap" }}>
              {[
                { label: "Humidity", value: `${weather.current.humidity}%`, icon: "💧" },
                { label: "Wind", value: `${weather.current.wind_speed} ${windUnit}`, icon: "💨" },
                weather.current.uv_index !== undefined ? { label: "UV", value: `${weather.current.uv_index}`, icon: "☀️" } : null,
                weather.current.pressure !== undefined ? { label: "Pressure", value: `${weather.current.pressure} hPa`, icon: "🌡️" } : null,
              ].filter(Boolean).map((stat, i) => stat && (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "0.8rem" }}>{stat.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.6rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI summary snippet */}
            {weather.ai_summary && (
              <div style={{ marginTop: "12px", padding: "10px 12px", background: "rgba(61,142,248,0.06)", borderRadius: "8px", border: "1px solid rgba(61,142,248,0.12)" }}>
                <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", lineHeight: 1.5, fontStyle: "italic" }}>
                  🤖 {weather.ai_summary.length > 160 ? weather.ai_summary.slice(0, 157) + "…" : weather.ai_summary}
                </p>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Tabs (only when selected and weather loaded) */}
      {isSelected && weather && (
        <div onClick={(e) => e.stopPropagation()}>
          <hr className="divider" />
          {/* Tab bar */}
          <div style={{ display: "flex", gap: "0", padding: "0 4px" }}>
            {(["forecast", "hourly", "insights"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === tab ? "var(--color-blue-vivid)" : "transparent"}`,
                  color: activeTab === tab ? "var(--color-blue-vivid)" : "var(--color-text-muted)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {tab === "forecast" ? "📅 Forecast" : tab === "hourly" ? "⏱ Hourly" : "🤖 AI Insights"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: "16px 16px 20px" }}>
            {activeTab === "forecast" && weather.forecast?.length > 0 && (
              <ForecastStrip forecast={weather.forecast} units={units} />
            )}
            {activeTab === "hourly" && (
              loadingHourly
                ? <div style={{ display: "flex", gap: "6px" }}>{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton" style={{height:"100px",width:"70px",borderRadius:"12px"}}/>)}</div>
                : hourly
                  ? <HourlyTimeline hourly={hourly} units={units} />
                  : <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", padding: "20px 0", textAlign: "center" }}>Hourly data unavailable (PRO+).</p>
            )}
            {activeTab === "insights" && (
              loadingInsights
                ? <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{Array.from({length:3}).map((_,i)=><div key={i} className="skeleton" style={{height:"50px",borderRadius:"10px"}}/>)}</div>
                : insights
                  ? <InsightsPanel insights={insights} />
                  : <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", padding: "20px 0", textAlign: "center" }}>AI Insights unavailable (PRO+ plan required).</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
