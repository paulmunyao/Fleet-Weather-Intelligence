"use client";

import { useState, useEffect, useCallback } from "react";
import type { FleetLocation, Units, UsageResponse } from "@/lib/types";
import LocationCard from "./LocationCard";
import QuotaBar from "./QuotaBar";
import AddLocationModal from "./AddLocationModal";
import WeatherAlerts from "./WeatherAlerts";

const STORAGE_KEY = "fleet_locations_v1";

const DEFAULT_LOCATIONS: FleetLocation[] = [
  { id: "loc_nairobi", name: "Nairobi, Kenya", lat: -1.2921, lon: 36.8219, addedAt: new Date().toISOString() },
  { id: "loc_mombasa", name: "Mombasa, Kenya", lat: -4.0435, lon: 39.6682, addedAt: new Date().toISOString() },
  { id: "loc_kisumu", name: "Kisumu, Kenya", lat: -0.0917, lon: 34.7679, addedAt: new Date().toISOString() },
];

function loadLocations(): FleetLocation[] {
  if (typeof window === "undefined") return DEFAULT_LOCATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FleetLocation[];
  } catch {}
  return DEFAULT_LOCATIONS;
}

function saveLocations(locs: FleetLocation[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(locs)); } catch {}
}

type Panel = "locations" | "alerts";

interface FleetDashboardProps {
  initialUsage: UsageResponse | null;
}

export default function FleetDashboard({ initialUsage }: FleetDashboardProps) {
  const [locations, setLocations] = useState<FleetLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [units, setUnits] = useState<Units>("metric");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidePanel, setSidePanel] = useState<Panel>("locations");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const locs = loadLocations();
    setLocations(locs);
    if (locs.length > 0) setSelectedId(locs[0].id);
  }, []);

  useEffect(() => { saveLocations(locations); }, [locations]);

  const addLocation = useCallback((loc: Omit<FleetLocation, "id" | "addedAt">) => {
    const newLoc: FleetLocation = {
      ...loc,
      id: `loc_${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    setLocations((prev) => [...prev, newLoc]);
    setSelectedId(newLoc.id);
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      if (selectedId === id) setSelectedId(updated[0]?.id ?? null);
      return updated;
    });
  }, [selectedId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* ── Top Header ────────────────────────────────────────────────── */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "60px",
        borderBottom: "1px solid var(--color-glass-border)",
        background: "rgba(10,14,26,0.9)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="btn-ghost"
            style={{ padding: "6px 9px", fontSize: "1rem" }}
            title="Toggle sidebar"
          >
            ☰
          </button>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ⛈ Fleet Weather
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 400, color: "var(--color-text-secondary)", marginLeft: "4px" }}>
              Intelligence
            </span>
          </div>
        </div>

        {/* Header controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <QuotaBar initialUsage={initialUsage} />

          {/* Units toggle */}
          <div style={{ display: "flex", background: "var(--color-glass-light)", border: "1px solid var(--color-glass-border)", borderRadius: "8px", padding: "2px", gap: "2px" }}>
            {(["metric", "imperial"] as Units[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: units === u ? "var(--color-blue-vivid)" : "transparent",
                  color: units === u ? "white" : "var(--color-text-muted)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {u === "metric" ? "°C" : "°F"}
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
            id="add-location-btn"
            style={{ padding: "7px 14px", fontSize: "0.82rem" }}
          >
            + Add Location
          </button>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        {sidebarOpen && (
          <aside style={{
            width: "240px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid var(--color-glass-border)",
            background: "rgba(10,14,26,0.6)",
            overflowY: "auto",
          }}>
            {/* Sidebar nav tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--color-glass-border)" }}>
              {([["locations", "📍 Locations"], ["alerts", "🔔 Alerts"]] as [Panel, string][]).map(([p, label]) => (
                <button
                  key={p}
                  onClick={() => setSidePanel(p)}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${sidePanel === p ? "var(--color-blue-vivid)" : "transparent"}`,
                    color: sidePanel === p ? "var(--color-blue-vivid)" : "var(--color-text-muted)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
              {sidePanel === "locations" ? (
                <>
                  {locations.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 12px" }}>
                      <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "12px" }}>No locations yet</p>
                      <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ fontSize: "0.78rem", padding: "7px 14px" }}>
                        + Add First Location
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {locations.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => setSelectedId(loc.id)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: `1px solid ${selectedId === loc.id ? "var(--color-blue-vivid)" : "var(--color-glass-border)"}`,
                            background: selectedId === loc.id ? "rgba(61,142,248,0.1)" : "var(--color-glass-light)",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: selectedId === loc.id ? "var(--color-blue-vivid)" : "var(--color-text-primary)" }}>
                            {loc.name}
                          </div>
                          <div style={{ fontSize: "0.62rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                            {loc.lat.toFixed(3)}°, {loc.lon.toFixed(3)}°
                          </div>
                        </button>
                      ))}
                      <button className="btn-ghost" onClick={() => setShowAddModal(true)} style={{ marginTop: "4px", width: "100%", justifyContent: "center", fontSize: "0.78rem" }}>
                        + Add Location
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <WeatherAlerts locations={locations} />
              )}
            </div>
          </aside>
        )}

        {/* ── Main content ────────────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {locations.length === 0 ? (
            /* Empty state */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "4rem" }}>🗺️</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
                Your fleet is ready for weather intel
              </h2>
              <p style={{ color: "var(--color-text-muted)", maxWidth: "360px", lineHeight: 1.6 }}>
                Add your fleet&apos;s stops, depots, or routes to start monitoring real-time weather conditions and AI-powered alerts.
              </p>
              <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ marginTop: "8px" }}>
                + Add Your First Location
              </button>
            </div>
          ) : (
            /* Location cards grid */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", alignContent: "start" }}>
              {locations.map((loc, i) => (
                <div key={loc.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <LocationCard
                    location={loc}
                    units={units}
                    isSelected={selectedId === loc.id}
                    onSelect={() => setSelectedId(loc.id)}
                    onRemove={() => removeLocation(loc.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {showAddModal && (
        <AddLocationModal
          onAdd={addLocation}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
