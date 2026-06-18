"use client";

import { useState } from "react";
import type { FleetLocation } from "@/lib/types";

interface AddLocationModalProps {
  onAdd: (location: Omit<FleetLocation, "id" | "addedAt">) => void;
  onClose: () => void;
}

const QUICK_LOCATIONS = [
  { name: "Nairobi, Kenya", lat: -1.2921, lon: 36.8219 },
  { name: "Mombasa, Kenya", lat: -4.0435, lon: 39.6682 },
  { name: "Kisumu, Kenya", lat: -0.0917, lon: 34.7679 },
  { name: "Lagos, Nigeria", lat: 6.5244, lon: 3.3792 },
  { name: "Accra, Ghana", lat: 5.6037, lon: -0.1870 },
  { name: "Dar es Salaam, Tanzania", lat: -6.7924, lon: 39.2083 },
  { name: "Cape Town, South Africa", lat: -33.9249, lon: 18.4241 },
  { name: "Addis Ababa, Ethiopia", lat: 9.0054, lon: 38.7636 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278 },
  { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
  { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
];

export default function AddLocationModal({ onAdd, onClose }: AddLocationModalProps) {
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"manual" | "quick">("quick");

  function handleQuickSelect(loc: typeof QUICK_LOCATIONS[0]) {
    onAdd({ name: loc.name, lat: loc.lat, lon: loc.lon });
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    if (!name.trim()) { setError("Location name is required."); return; }
    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) { setError("Latitude must be between -90 and 90."); return; }
    if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) { setError("Longitude must be between -180 and 180."); return; }
    onAdd({ name: name.trim(), lat: parsedLat, lon: parsedLon });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Add Fleet Location
            </h2>
            <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
              Monitor weather at a new stop
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "18px", borderBottom: "1px solid var(--color-glass-border)" }}>
          {(["quick", "manual"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t ? "var(--color-blue-vivid)" : "transparent"}`,
                color: tab === t ? "var(--color-blue-vivid)" : "var(--color-text-muted)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-sans)",
                marginBottom: "-1px",
              }}
            >
              {t === "quick" ? "🌍 Quick Select" : "📍 Custom Coords"}
            </button>
          ))}
        </div>

        {tab === "quick" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
            {QUICK_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                onClick={() => handleQuickSelect(loc)}
                className="glass-card"
                style={{ padding: "10px 12px", textAlign: "left", border: "1px solid var(--color-glass-border)", cursor: "pointer", background: "var(--color-glass)", borderRadius: "10px", transition: "all 0.15s ease" }}
              >
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-primary)" }}>{loc.name}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                  {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
                Location Name
              </label>
              <input
                id="location-name"
                type="text"
                className="input-field"
                placeholder="e.g. Nairobi Depot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
                  Latitude
                </label>
                <input
                  id="location-lat"
                  type="number"
                  step="any"
                  className="input-field"
                  placeholder="-1.2921"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
                  Longitude
                </label>
                <input
                  id="location-lon"
                  type="number"
                  step="any"
                  className="input-field"
                  placeholder="36.8219"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                />
              </div>
            </div>
            {error && <p style={{ fontSize: "0.78rem", color: "#f87171" }}>⚠️ {error}</p>}
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                + Add Location
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
