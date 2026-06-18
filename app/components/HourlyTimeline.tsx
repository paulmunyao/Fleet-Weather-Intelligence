"use client";

import type { HourlyResponse } from "@/lib/types";
import WeatherIcon from "./WeatherIcon";

interface HourlyTimelineProps {
  hourly: HourlyResponse;
  units: "metric" | "imperial";
}

function formatHour(isoStr: string) {
  try {
    const d = new Date(isoStr);
    const h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}${ampm}`;
  } catch {
    return isoStr;
  }
}

function precipBar(prob?: number) {
  if (!prob || prob < 0.05) return null;
  return (
    <div style={{ width: "100%", height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.05)", overflow: "hidden", marginTop: "4px" }}>
      <div style={{ height: "100%", width: `${Math.round(prob * 100)}%`, background: "linear-gradient(90deg,#60a5fa,#22d3ee)", borderRadius: "2px" }} />
    </div>
  );
}

export default function HourlyTimeline({ hourly, units }: HourlyTimelineProps) {
  const entries = hourly.hourly?.slice(0, 24) ?? [];
  const unit = units === "metric" ? "°C" : "°F";

  if (!entries.length) {
    return (
      <div style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "24px 0" }}>
        No hourly data available.
      </div>
    );
  }

  const temps = entries.map((e) => e.temp);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  return (
    <div className="scroll-x" style={{ paddingBottom: "8px" }}>
      <div style={{ display: "flex", gap: "6px", minWidth: "max-content", padding: "4px 2px" }}>
        {entries.map((entry, i) => {
          const heightPct = ((entry.temp - minT) / range) * 40 + 16; // 16–56px
          return (
            <div
              key={i}
              className="glass-card animate-card-enter"
              style={{
                minWidth: "70px",
                padding: "10px 8px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                borderRadius: "12px",
                cursor: "default",
                animationDelay: `${i * 0.03}s`,
              }}
            >
              {/* Time */}
              <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.02em" }}>
                {formatHour(entry.time)}
              </span>

              {/* Icon */}
              <WeatherIcon condition={entry.condition} size={28} />

              {/* Temp bar */}
              <div style={{ width: "3px", height: `${heightPct}px`, background: `hsl(${200 + (entry.temp / 40) * 60}, 80%, 55%)`, borderRadius: "2px", transition: "height 0.5s ease" }} />

              {/* Temp */}
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
                {Math.round(entry.temp)}{unit}
              </span>

              {/* Precip prob */}
              {entry.precipitation_prob !== undefined && entry.precipitation_prob > 0.05 && (
                <span style={{ fontSize: "0.62rem", color: "#60a5fa", fontWeight: 600 }}>
                  {Math.round(entry.precipitation_prob * 100)}%
                </span>
              )}

              {precipBar(entry.precipitation_prob)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
