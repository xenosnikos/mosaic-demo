"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDemoStore } from "@/stores/demo-store";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout>(undefined);
  const { addEvent, setConnected, updateBdiState, incrementStat } = useDemoStore();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = undefined;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "ws:connected") return;

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

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        // Reconnect after 2s
        reconnectTimer.current = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      reconnectTimer.current = setTimeout(connect, 2000);
    }
  }, [addEvent, setConnected, updateBdiState, incrementStat]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { ws: wsRef };
}
