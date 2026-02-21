export async function register() {
  // Only run on the server (not edge runtime)
  if (typeof window !== "undefined") return;

  const { WebSocketServer, WebSocket } = await import("ws");

  const WS_PORT = parseInt(process.env.WS_PORT || "3001", 10);

  // ─── WebSocket Server ───
  const wss = new WebSocketServer({ port: WS_PORT });
  const clients = new Set<InstanceType<typeof WebSocket>>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
    ws.on("error", () => clients.delete(ws));
    ws.send(JSON.stringify({ type: "ws:connected", timestamp: Date.now() }));
  });

  // Broadcast function exposed globally for mosaic-server middleware
  (globalThis as any).__wsBroadcast = (data: unknown) => {
    const msg = JSON.stringify(data);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  };

  console.log(`  WebSocket server → ws://localhost:${WS_PORT}`);

  // Initialize Mosaic agents in background (don't block Next.js startup)
  import("./lib/mosaic-server").then(async ({ initializeMosaic }) => {
    await initializeMosaic();
    console.log("  Mosaic agents initialized");
  }).catch((err) => {
    console.error("  Failed to initialize Mosaic:", err);
  });
}
