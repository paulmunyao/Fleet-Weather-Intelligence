"use client";

import type { ReactElement } from "react";

// Animated SVG weather icons mapped from condition strings
type IconProps = { size?: number; className?: string };

function SunIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="10" fill="#fbbf24" className="animate-pulse-glow" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line
          key={i}
          x1="24" y1="7" x2="24" y2="11"
          stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round"
          transform={`rotate(${deg} 24 24)`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </svg>
  );
}

function CloudIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <ellipse cx="20" cy="26" rx="12" ry="8" fill="#94a3b8" opacity="0.8" />
      <ellipse cx="28" cy="28" rx="10" ry="7" fill="#94a3b8" opacity="0.9" />
      <ellipse cx="22" cy="22" rx="8" ry="7" fill="#cbd5e1" />
    </svg>
  );
}

function RainIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <ellipse cx="20" cy="18" rx="12" ry="8" fill="#64748b" opacity="0.9" />
      <ellipse cx="28" cy="20" rx="10" ry="7" fill="#64748b" opacity="0.9" />
      <ellipse cx="22" cy="15" rx="8" ry="7" fill="#94a3b8" />
      {[[18,28],[24,32],[30,28],[21,36],[27,40]].map(([cx, cy], i) => (
        <line
          key={i}
          x1={cx} y1={cy} x2={cx - 2} y2={cy + 6}
          stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"
          className="animate-rain-drop"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </svg>
  );
}

function ThunderIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <ellipse cx="20" cy="16" rx="12" ry="8" fill="#475569" opacity="0.9" />
      <ellipse cx="28" cy="18" rx="10" ry="7" fill="#475569" opacity="0.9" />
      <ellipse cx="22" cy="13" rx="8" ry="7" fill="#64748b" />
      <polyline points="26,24 22,32 26,32 21,42" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SnowIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <ellipse cx="20" cy="18" rx="12" ry="8" fill="#94a3b8" opacity="0.8" />
      <ellipse cx="28" cy="20" rx="10" ry="7" fill="#94a3b8" opacity="0.9" />
      <ellipse cx="22" cy="15" rx="8" ry="7" fill="#cbd5e1" />
      {[[18,28],[24,32],[30,28]].map(([cx, cy], i) => (
        <g key={i} style={{ animationDelay: `${i * 0.2}s` }}>
          <circle cx={cx} cy={cy} r="2" fill="#bae6fd" className="animate-pulse-glow" />
          <circle cx={cx} cy={cy + 6} r="1.5" fill="#bae6fd" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

function WindIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {[18, 24, 30].map((y, i) => (
        <path
          key={i}
          d={`M8,${y} Q20,${y - 4} 36,${y} Q44,${y} 42,${y - 4}`}
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity={1 - i * 0.2}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </svg>
  );
}

function FogIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {[14, 20, 26, 32, 38].map((y, i) => (
        <line
          key={i}
          x1={i % 2 === 0 ? 8 : 12}
          y1={y} x2={i % 2 === 0 ? 40 : 36} y2={y}
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.5 + i * 0.1}
        />
      ))}
    </svg>
  );
}

function PartlyCloudyIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="18" cy="18" r="7" fill="#fbbf24" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <line
          key={i}
          x1="18" y1="7" x2="18" y2="9"
          stroke="#fcd34d" strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${deg} 18 18)`}
        />
      ))}
      <ellipse cx="28" cy="28" rx="12" ry="7.5" fill="#94a3b8" opacity="0.9" />
      <ellipse cx="20" cy="26" rx="9" ry="7" fill="#cbd5e1" />
    </svg>
  );
}

const conditionMap: Record<string, (props: IconProps) => ReactElement> = {
  clear: SunIcon,
  sunny: SunIcon,
  sun: SunIcon,
  "partly cloudy": PartlyCloudyIcon,
  "mostly cloudy": CloudIcon,
  overcast: CloudIcon,
  cloudy: CloudIcon,
  cloud: CloudIcon,
  rain: RainIcon,
  rainy: RainIcon,
  drizzle: RainIcon,
  shower: RainIcon,
  "heavy rain": RainIcon,
  thunder: ThunderIcon,
  thunderstorm: ThunderIcon,
  storm: ThunderIcon,
  snow: SnowIcon,
  snowy: SnowIcon,
  sleet: SnowIcon,
  hail: SnowIcon,
  wind: WindIcon,
  windy: WindIcon,
  fog: FogIcon,
  foggy: FogIcon,
  mist: FogIcon,
  haze: FogIcon,
};

export function getWeatherIcon(condition: string, props: IconProps = {}): ReactElement {
  const key = condition.toLowerCase().trim();
  for (const [pattern, Component] of Object.entries(conditionMap)) {
    if (key.includes(pattern)) return <Component {...props} />;
  }
  // Fallback to partly cloudy
  return <PartlyCloudyIcon {...props} />;
}

export default function WeatherIcon({
  condition,
  size = 40,
  className = "",
}: {
  condition: string;
  size?: number;
  className?: string;
}) {
  return getWeatherIcon(condition, { size, className });
}
