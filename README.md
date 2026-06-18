# ⛈ Fleet Weather Intelligence Dashboard

A real-time weather monitoring dashboard for fleet operations — built with **Next.js 16**, **React 19**, and the **WeatherAI API**. Monitor live conditions, hourly timelines, AI-generated risk insights, and severe-weather webhook alerts across any number of locations simultaneously.

![Fleet Weather Intelligence](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)

---

## Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Multi-Location Fleet View** | Add unlimited depot, route, or stop locations — persisted to `localStorage` |
| 🌡️ **Live Weather Cards** | Current temperature, condition, humidity, wind, UV index per location |
| 📅 **5–14 Day Forecast** | Daily forecast strip with high/low temperature bars and precipitation probability |
| ⏱️ **Hourly Timeline** | Scrollable 24-hour breakdown with animated temperature bars |
| 🤖 **AI Insights** | Gemini-powered risk flags (frost, extreme wind, rain, drought) and actionable recommendations |
| 🔔 **Webhook Alerts** | Subscribe locations to severe weather events — WeatherAI POSTs to your callback URL |
| 📊 **API Quota Monitor** | Live monthly usage progress bar and plan badge |
| 🔒 **Secure API Key Proxy** | API key never reaches the browser — all calls proxied through Next.js Route Handlers |
| 🌍 **Quick-Select Cities** | Pre-loaded list of 12 global cities for fast setup |
| °C / °F **Unit Toggle** | Global metric/imperial switch |

---

## Tech Stack

- **Framework:** [Next.js 16.2](https://nextjs.org) — App Router, Server Components, Route Handlers
- **UI:** [React 19](https://react.dev), TypeScript 5
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with custom design tokens, glassmorphism, CSS animations
- **API:** [WeatherAI REST API](https://weather-ai.co/docs) (`https://api.weather-ai.co/v1/`)
- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) + [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)

---

## Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9
- A **WeatherAI API key** — get one at [weather-ai.co](https://weather-ai.co)

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/fleet-weather-intelligence.git
cd fleet-weather-intelligence
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your API key

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and add your key:

```env
WAI_API_KEY=wai_your_api_key_here
```

> **Security note:** `.env.local` is listed in `.gitignore` and is never committed. The `WAI_API_KEY` variable has no `NEXT_PUBLIC_` prefix, so it is only accessible server-side inside Route Handlers — it never reaches the browser.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WAI_API_KEY` | ✅ | Your WeatherAI API key (prefixed `wai_`) |
| `NEXT_PUBLIC_BASE_URL` | Optional | Base URL for server-side self-calls (defaults to `http://localhost:3000`) |

---

## Deployment (Vercel — Recommended)

[Vercel](https://vercel.com) is the recommended host for this project — it is built by the Next.js team and requires zero configuration for App Router projects.

### Steps

1. Push your repository to GitHub (make sure `.env.local` is in `.gitignore` — it already is).

2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.

3. In the **Environment Variables** section, add:
   ```
   WAI_API_KEY = wai_your_api_key_here
   NEXT_PUBLIC_BASE_URL = https://your-project-name.vercel.app
   ```

4. Click **Deploy**. Vercel detects Next.js automatically — no build config needed.

5. Your live URL will be `https://your-project-name.vercel.app`.

> Future pushes to the `main` branch automatically trigger a new deployment.

### Alternative platforms

| Platform | Notes |
|----------|-------|
| [Railway](https://railway.app) | Docker-friendly; set env vars in the Railway dashboard |
| [Render](https://render.com) | Use **Web Service** → Node; set `npm run build && npm run start` as the start command |
| [Netlify](https://netlify.com) | Requires the `@netlify/plugin-nextjs` adapter for App Router support |

---

## Project Structure

```
fleet-weather-intelligence/
├── app/
│   ├── layout.tsx              # Root layout with SEO metadata
│   ├── page.tsx                # Server Component root (pre-fetches usage quota)
│   ├── globals.css             # Tailwind v4 design system + animations
│   │
│   ├── api/                    # Route Handlers — API key proxy layer
│   │   ├── weather/route.ts         GET /v1/weather
│   │   ├── hourly/route.ts          GET /v1/hourly
│   │   ├── forecast14/route.ts      GET /v1/forecast14  (PRO+)
│   │   ├── insights/route.ts        GET /v1/insights    (PRO+)
│   │   ├── usage/route.ts           GET /v1/usage
│   │   ├── weather-geo/route.ts     GET /v1/ip-lookup   (PRO+)
│   │   ├── webhooks/route.ts        GET + POST /v1/webhooks (PRO+)
│   │   └── webhooks/[id]/route.ts   DELETE /v1/webhooks/:id (PRO+)
│   │
│   └── components/
│       ├── FleetDashboard.tsx   # Main orchestrator (state, layout, sidebar)
│       ├── LocationCard.tsx     # Per-location card with tabbed detail panels
│       ├── HourlyTimeline.tsx   # 24-hour scrollable timeline
│       ├── ForecastStrip.tsx    # 5–14 day forecast strip
│       ├── InsightsPanel.tsx    # AI risk flags + recommendations
│       ├── WeatherAlerts.tsx    # Webhook subscriptions panel
│       ├── QuotaBar.tsx         # API usage progress bar
│       ├── WeatherIcon.tsx      # Animated SVG weather icons
│       └── AddLocationModal.tsx # Quick-select + manual coordinate modal
│
├── lib/
│   ├── types.ts                # TypeScript interfaces for all API responses
│   └── weather-api.ts          # Server-side WeatherAI fetch helpers
│
├── .env.local                  # 🔒 API key (gitignored — never committed)
├── .env.local.example          # Template for new contributors
└── next.config.ts
```

---

## API Plan Tiers

| Feature | Free | Pro | Scale |
|---------|------|-----|-------|
| Live weather + 5-day forecast | ✅ | ✅ | ✅ |
| AI summary | ✅ | ✅ | ✅ |
| Hourly breakdown | ✅ | ✅ | ✅ |
| 14-day forecast | ❌ | ✅ | ✅ |
| AI Insights (risk flags) | ❌ | ✅ | ✅ |
| Webhook alerts | ❌ | ✅ | ✅ |
| SMS delivery | ❌ | ❌ | ✅ |

PRO+ features degrade gracefully — they show an "upgrade required" message instead of crashing.

---
