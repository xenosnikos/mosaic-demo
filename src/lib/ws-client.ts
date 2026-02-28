"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDemoStore } from "@/stores/demo-store";

/**
 * Connects to the /api/events SSE endpoint instead of a raw WebSocket.
 * The hook name is kept as useWebSocket() to avoid changing call-sites.
 */
export function useWebSocket() {
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout>(undefined);
  const { addEvent, setConnected, updateBdiState, incrementStat } = useDemoStore();

  const connect = useCallback(() => {
    if (esRef.current?.readyState === EventSource.OPEN) return;

    // Close any stale connection
    esRef.current?.close();

    try {
      const es = new EventSource("/api/events");
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = undefined;
        }
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "sse:connected") return;

          // Add to event stream
          addEvent(data);
          incrementStat();

          // Update BDI state if it's a BDI event
          if (data.type?.startsWith("bdi:") && data.payload) {
            const { agentId, ...rest } = data.payload;
            if (agentId) {
              updateBdiState(agentId, data.type, rest);
            }
          }
        } catch {
          // Ignore parse errors
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        esRef.current = null;
        // Reconnect after 2s
        reconnectTimer.current = setTimeout(connect, 2000);
      };
    } catch {
      reconnectTimer.current = setTimeout(connect, 2000);
    }
  }, [addEvent, setConnected, updateBdiState, incrementStat]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      esRef.current?.close();
    };
  }, [connect]);

  return { connected: esRef };
}
