import { NextRequest } from "next/server";
import { deleteWebhook } from "@/lib/weather-api";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteWebhook(id);
    return new Response(null, { status: 204 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("404") ? 404
      : message.includes("403") ? 403
      : message.includes("not configured") ? 503
      : 500;
    return Response.json({ error: message }, { status });
  }
}
