"use client";

import type { DailyForecast } from "@/lib/types";
import WeatherIcon from "./WeatherIcon";

interface ForecastStripProps {
  forecast: DailyForecast[];
  units: "metric" | "imperial";
}

function formatDay(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short" });
  } catch {
    return dateStr;
  }
}

function formatShortDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().slice(0, 10);
}

export default function ForecastStrip({ forecast, units }: ForecastStripProps) {
  const unit = units === "metric" ? "°C" : "°F";
  const highs = forecast.map((d) => d.high);
  const lows = forecast.map((d) => d.low);
  const absMax = Math.max(...highs);
  const absMin = Math.min(...lows);
  const absRange = absMax - absMin || 1;

  return (
    <div className="scroll-x">
      <div style={{ display: "flex", gap: "8px", minWidth: "max-content", padding: "2px" }}>
        {forecast.map((day, i) => {
          const today = isToday(day.date);
          const highBarH = Math.round(((day.high - absMin) / absRange) * 32) + 12;
          const lowBarH = Math.round(((day.low - absMin) / absRange) * 32) + 4;
          return (
            <div
              key={i}
              className={`glass-card animate-card-enter${today ? " glass-card-active" : ""}`}
              style={{ minWidth: "86px", padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", borderRadius: "14px", animationDelay: `${i * 0.05}s` }}
            >
              <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: today ? "var(--color-blue-vivid)" : "var(--color-text-muted)" }}>
                {today ? "Today" : formatDay(day.date)}
              </span>
              <span style={{ fontSize: "0.6rem", color: "var(--color-text-muted)" }}>
                {formatShortDate(day.date)}
              </span>
              <WeatherIcon condition={day.condition} size={30} />
              <span style={{ fontSize: "0.6rem", color: "var(--color-text-secondary)", textAlign: "center", lineHeight: 1.3, maxWidth: "68px" }}>
                {day.condition}
              </span>
              <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "46px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <span style={{ fontSize: "0.58rem", color: "#94a3b8" }}>L</span>
                  <div style={{ width: "5px", height: `${lowBarH}px`, background: "#60a5fa", borderRadius: "3px", opacity: 0.7 }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#60a5fa" }}>{Math.round(day.low)}{unit}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <span style={{ fontSize: "0.58rem", color: "#94a3b8" }}>H</span>
                  <div style={{ width: "5px", height: `${highBarH}px`, background: "#f97316", borderRadius: "3px", opacity: 0.8 }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#f97316" }}>{Math.round(day.high)}{unit}</span>
                </div>
              </div>
              {day.precipitation_prob !== undefined && day.precipitation_prob > 0.05 && (
                <span style={{ fontSize: "0.6rem", color: "#60a5fa", fontWeight: 600 }}>
                  💧 {Math.round(day.precipitation_prob * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
