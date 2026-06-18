import FleetDashboard from "./components/FleetDashboard";
import type { UsageResponse } from "@/lib/types";

async function getUsage(): Promise<UsageResponse | null> {
  try {
    // Use the absolute URL for server-side Route Handler calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/usage`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const usage = await getUsage();

  return <FleetDashboard initialUsage={usage} />;
}
