import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fleet Weather Intelligence | Real-Time Weather Dashboard",
  description:
    "Monitor real-time weather conditions across your entire fleet with AI-powered insights, 14-day forecasts, risk alerts, and webhook notifications — powered by WeatherAI.",
  keywords: "fleet weather, weather intelligence, weather dashboard, weather monitoring, fleet management",
  openGraph: {
    title: "Fleet Weather Intelligence Dashboard",
    description: "AI-powered weather monitoring for your entire fleet",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
