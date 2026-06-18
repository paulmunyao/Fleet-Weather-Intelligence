"use client";

import { useState, useEffect, useCallback } from "react";
import type { Webhook, WebhookTrigger, FleetLocation } from "@/lib/types";

interface WeatherAlertsProps {
  locations: FleetLocation[];
}

const TRIGGER_LABELS: Record<WebhookTrigger, string> = {
  rain: "🌧️ Rain",
  extreme_wind: "💨 Extreme Wind",
  frost: "❄️ Frost",
  drought: "🏜️ Drought",
};

const TRIGGER_BADGE: Record<WebhookTrigger, string> = {
  rain: "badge-blue",
  extreme_wind: "badge-amber",
  frost: "badge-blue",
  drought: "badge-amber",
};

interface AlertModalProps {
  locations: FleetLocation[];
  onClose: () => void;
  onCreated: () => void;
}

function AlertSubscribeModal({ locations, onClose, onCreated }: AlertModalProps) {
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [triggers, setTriggers] = useState<WebhookTrigger[]>(["rain"]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleTrigger(t: WebhookTrigger) {
    setTriggers((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const loc = locations.find((l) => l.id === locationId);
    if (!loc) { setError("Select a location."); return; }
    if (!callbackUrl.startsWith("https://")) { setError("Callback URL must start with https://"); return; }
    if (!triggers.length) { setError("Select at least one trigger."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: callbackUrl, lat: loc.lat, lon: loc.lon, triggers }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to create webhook");
      }
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Create Weather Alert
            </h2>
            <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
              Get notified when severe weather hits a location
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Fleet Location
            </label>
            <select
              className="input-field"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              style={{ appearance: "none" }}
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id} style={{ background: "#0f1629" }}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
              Callback URL (HTTPS)
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://your-app.com/weather-hook"
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "10px" }}>
              Trigger Events
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(Object.keys(TRIGGER_LABELS) as WebhookTrigger[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTrigger(t)}
                  className={`badge ${triggers.includes(t) ? TRIGGER_BADGE[t] : ""}`}
                  style={{
                    cursor: "pointer",
                    opacity: triggers.includes(t) ? 1 : 0.4,
                    border: `1px solid ${triggers.includes(t) ? "currentColor" : "var(--color-glass-border)"}`,
                    background: triggers.includes(t) ? undefined : "transparent",
                    transition: "all 0.15s ease",
                    padding: "6px 12px",
                    fontSize: "0.75rem",
                  }}
                >
                  {TRIGGER_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          {error && <p style={{ fontSize: "0.78rem", color: "#f87171" }}>⚠️ {error}</p>}
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 2 }}>
              {submitting ? "Creating…" : "🔔 Create Alert"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WeatherAlerts({ locations }: WeatherAlertsProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadWebhooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/webhooks");
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) { setError("PRO+ plan required for webhook alerts."); }
        else if (res.status === 503) { setError("API key not configured."); }
        else { setError(data.error ?? "Failed to load webhooks"); }
        return;
      }
      setWebhooks(data.webhooks ?? []);
    } catch {
      setError("Failed to load webhook alerts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadWebhooks(); }, [loadWebhooks]);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setWebhooks((prev) => prev.filter((w) => w.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
            🔔 Weather Alerts
          </h3>
          <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
            Webhook subscriptions for severe weather
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          disabled={locations.length === 0}
          style={{ padding: "7px 14px", fontSize: "0.78rem" }}
        >
          + Subscribe
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "10px" }} />)}
        </div>
      ) : error ? (
        <div style={{ padding: "12px 14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "10px" }}>
          <p style={{ fontSize: "0.8rem", color: "#f87171" }}>⚠️ {error}</p>
        </div>
      ) : webhooks.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", border: "1px dashed var(--color-glass-border)", borderRadius: "12px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>No active alerts</p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Subscribe to get notified when severe weather hits your locations</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {webhooks.map((wh) => (
            <div key={wh.id} className="glass-card" style={{ padding: "12px 14px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {wh.url}
                </p>
                <p style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                  {wh.lat.toFixed(3)}°, {wh.lon.toFixed(3)}° · {new Date(wh.createdAt).toLocaleDateString()}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
                  {wh.triggers.map((t) => (
                    <span key={t} className={`badge ${TRIGGER_BADGE[t]}`} style={{ fontSize: "0.6rem", padding: "2px 7px" }}>
                      {TRIGGER_LABELS[t]}
                    </span>
                  ))}
                  <span className={`badge ${wh.active ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.6rem", padding: "2px 7px" }}>
                    {wh.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <button
                className="btn-danger"
                onClick={() => handleDelete(wh.id)}
                disabled={deleting === wh.id}
                style={{ flexShrink: 0, padding: "5px 10px", fontSize: "0.7rem" }}
              >
                {deleting === wh.id ? "…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AlertSubscribeModal
          locations={locations}
          onClose={() => setShowModal(false)}
          onCreated={loadWebhooks}
        />
      )}
    </div>
  );
}
