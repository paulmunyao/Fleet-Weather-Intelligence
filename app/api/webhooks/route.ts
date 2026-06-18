import { NextRequest } from "next/server";
import { fetchWebhooks, createWebhook } from "@/lib/weather-api";
import type { CreateWebhookPayload } from "@/lib/types";

export async function GET() {
  try {
    const data = await fetchWebhooks();
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("403") ? 403
      : message.includes("not configured") ? 503
      : 500;
    return Response.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CreateWebhookPayload;
    if (!payload.url || payload.lat === undefined || payload.lon === undefined) {
      return Response.json({ error: "url, lat, and lon are required" }, { status: 400 });
    }
    const data = await createWebhook(payload);
    return Response.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("403") ? 403
      : message.includes("not configured") ? 503
      : 500;
    return Response.json({ error: message }, { status });
  }
}
