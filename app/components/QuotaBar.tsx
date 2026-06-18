"use client";

import { useState, useEffect } from "react";
import type { UsageResponse } from "@/lib/types";

interface QuotaBarProps {
  initialUsage?: UsageResponse | null;
}

export default function QuotaBar({ initialUsage }: QuotaBarProps) {
  const [usage, setUsage] = useState<UsageResponse | null>(initialUsage ?? null);
  const [loading, setLoading] = useState(!initialUsage);

  useEffect(() => {
    if (initialUsage) return;
    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => setUsage(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialUsage]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="skeleton h-2 w-24 rounded-full" />
        <div className="skeleton h-3 w-16" />
      </div>
    );
  }

  if (!usage || "error" in (usage as object)) return null;

  const pct = usage.limit > 0 ? ((usage.requests / usage.limit) * 100) : 0;
  const isWarn = pct > 75;
  const isCrit = pct > 90;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col gap-0.5 min-w-[120px]">
        <div className="flex justify-between items-center">
          <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            API Quota
          </span>
          <span style={{ fontSize: "0.7rem", color: isCrit ? "var(--color-red-accent)" : isWarn ? "var(--color-amber-accent)" : "var(--color-text-secondary)", fontWeight: 600 }}>
            {usage.requests.toLocaleString()} / {usage.limit.toLocaleString()}
          </span>
        </div>
        <div className="progress-track" style={{ height: "5px" }}>
          <div
            className={`progress-fill ${isCrit || isWarn ? "progress-fill-warn" : ""}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
      {usage.plan && (
        <span className={`badge ${usage.plan === "scale" ? "badge-purple" : usage.plan === "pro" ? "badge-blue" : "badge-green"}`}>
          {usage.plan}
        </span>
      )}
    </div>
  );
}
