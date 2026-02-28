/**
 * Global SSE event emitter — replaces the WebSocket broadcast mechanism.
 *
 * Mosaic middleware pushes events here; the /api/events SSE endpoint
 * subscribes and streams them to connected browsers.
 */

type Listener = (data: unknown) => void;

class SSEBroadcast {
  private listeners = new Set<Listener>();

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  emit(data: unknown) {
    for (const fn of this.listeners) {
      try {
        fn(data);
      } catch {
        // Ignore listener errors
      }
    }
  }
}

// Singleton on globalThis so every Next.js module instance shares it
const g = globalThis as typeof globalThis & { __sseBroadcast?: SSEBroadcast };
if (!g.__sseBroadcast) {
  g.__sseBroadcast = new SSEBroadcast();
}

export const sseBroadcast = g.__sseBroadcast;
