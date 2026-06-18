import { fetchUsage } from "@/lib/weather-api";

export async function GET() {
  try {
    const data = await fetchUsage();
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not configured") ? 503 : 500;
    return Response.json({ error: message }, { status });
  }
}
