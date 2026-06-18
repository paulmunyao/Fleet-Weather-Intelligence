"use client";

import type { InsightsResponse } from "@/lib/types";

interface InsightsPanelProps {
  insights: InsightsResponse;
}

const riskColors: Record<string, string> = {
  rain: "badge-blue",
  frost: "badge-blue",
  frost_risk: "badge-blue",
  extreme_wind: "badge-amber",
  drought: "badge-amber",
  storm: "badge-red",
  flooding: "badge-red",
  hail: "badge-red",
  default: "badge-purple",
};

const riskIcons: Record<string, string> = {
  rain: "🌧️",
  frost: "🌨️",
  frost_risk: "❄️",
  extreme_wind: "💨",
  drought: "🏜️",
  storm: "⛈️",
  flooding: "🌊",
  hail: "🧊",
};

function formatFlag(flag: string) {
  return flag.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const hasRisks = insights.risk_flags?.length > 0;
  const hasRecs = insights.recommendations?.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* AI Summary */}
      {insights.ai_summary && (
        <div style={{ padding: "14px 16px", background: "rgba(61,142,248,0.06)", border: "1px solid rgba(61,142,248,0.15)", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "1rem" }}>🤖</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-blue-vivid)", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Summary</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            {insights.ai_summary}
          </p>
        </div>
      )}

      {/* Risk Flags */}
      {hasRisks && (
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            ⚠️ Risk Flags
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {insights.risk_flags.map((flag, i) => (
              <span key={i} className={`badge ${riskColors[flag] ?? riskColors.default}`}>
                {riskIcons[flag] ?? "⚠️"} {formatFlag(flag)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {hasRecs && (
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            ✅ Recommendations
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
            {insights.recommendations.map((rec, i) => (
              <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                <span style={{ color: "var(--color-green-accent)", fontWeight: 700, flexShrink: 0 }}>→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Agronomic Context */}
      {insights.agronomic_context && (
        <div style={{ padding: "12px 14px", background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.15)", borderRadius: "10px" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-teal-accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
            🌿 Context
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            {insights.agronomic_context}
          </p>
        </div>
      )}

      {!hasRisks && !hasRecs && !insights.ai_summary && (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textAlign: "center", padding: "16px 0" }}>
          No significant risks identified for this location.
        </p>
      )}
    </div>
  );
}
