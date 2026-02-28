import { initializeMosaic } from "@/lib/mosaic-server";
import { sseBroadcast } from "@/lib/event-emitter";

export const dynamic = "force-dynamic";

export async function GET() {
  await initializeMosaic();

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let keepAlive: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "sse:connected", timestamp: Date.now() })}\n\n`)
      );

      // Subscribe to broadcast events from Mosaic middleware
      unsubscribe = sseBroadcast.subscribe((data) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream already closed
        }
      });

      // Keep-alive: send a comment every 30s so proxies don't drop the connection
      keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          // Stream already closed
        }
      }, 30_000);
    },
    cancel() {
      if (keepAlive) clearInterval(keepAlive);
      if (unsubscribe) unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
