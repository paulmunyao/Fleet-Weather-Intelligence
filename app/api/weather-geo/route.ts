import { NextRequest } from "next/server";
import { fetchIpLookup } from "@/lib/weather-api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ip = searchParams.get("ip") ?? "auto";

  try {
    const data = await fetchIpLookup(ip);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not configured") ? 503 : 500;
    return Response.json({ error: message }, { status });
  }
}
