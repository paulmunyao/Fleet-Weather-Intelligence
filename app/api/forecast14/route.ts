import { NextRequest } from "next/server";
import { fetchForecast14 } from "@/lib/weather-api";
import type { Units } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");
  const units = (searchParams.get("units") ?? "metric") as Units;

  if (isNaN(lat) || isNaN(lon)) {
    return Response.json({ error: "lat and lon are required" }, { status: 400 });
  }

  try {
    const data = await fetchForecast14(lat, lon, units);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("403") ? 403
      : message.includes("not configured") ? 503
      : 500;
    return Response.json({ error: message }, { status });
  }
}
