import { create } from "zustand";
import type { EventEnvelope, BDISnapshot, AgentInfo, SystemStats } from "@/types/demo";

interface BdiUpdate {
  type: string;
  key?: string;
  value?: unknown;
  desire?: string;
  intention?: string;
  timestamp: number;
}

interface DemoState {
  // WebSocket
  isConnected: boolean;
  setConnected: (v: boolean) => void;

  // Events
  events: EventEnvelope[];
  addEvent: (e: EventEnvelope) => void;
  clearEvents: () => void;

  // BDI states per agent
  bdiStates: Record<string, BDISnapshot>;
  bdiUpdates: BdiUpdate[];
  updateBdiState: (agentId: string, type: string, data: Record<string, unknown>) => void;

  // Stats
  totalEvents: number;
  incrementStat: () => void;
  eventTimestamps: number[];

  // System stats (from REST polling)
  systemStats: SystemStats | null;
  setSystemStats: (s: SystemStats) => void;

  // Paused state for event stream
  paused: boolean;
  setPaused: (v: boolean) => void;

  // Filter
  eventFilter: string;
  setEventFilter: (f: string) => void;
  agentFilter: string[];
  setAgentFilter: (a: string[]) => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  isConnected: false,
  setConnected: (v) => set({ isConnected: v }),

  events: [],
  addEvent: (e) => {
    if (get().paused) return;
    set((s) => ({
      events: [...s.events.slice(-200), e], // Keep last 200
      eventTimestamps: [...s.eventTimestamps.slice(-60), Date.now()],
    }));
  },
  clearEvents: () => set({ events: [] }),

  bdiStates: {},
  bdiUpdates: [],
  updateBdiState: (agentId, type, data) => {
    set((s) => {
      const current = s.bdiStates[agentId] || {
        beliefs: {},
        desires: [],
        intentions: [],
      };

      const updated = { ...current };

      if (type === "bdi:belief-changed" && data.key) {
        updated.beliefs = {
          ...updated.beliefs,
          [data.key as string]: data.value,
        };
      } else if (type === "bdi:desire-added" && data.desire) {
        if (!updated.desires.includes(data.desire as string)) {
          updated.desires = [...updated.desires, data.desire as string];
        }
      } else if (type === "bdi:desire-removed" && data.desire) {
        updated.desires = updated.desires.filter((d) => d !== data.desire);
      } else if (type === "bdi:intention-adopted" && data.intention) {
        if (!updated.intentions.includes(data.intention as string)) {
          updated.intentions = [...updated.intentions, data.intention as string];
        }
      } else if (type === "bdi:intention-dropped" && data.intention) {
        updated.intentions = updated.intentions.filter((i) => i !== data.intention);
      }

      return {
        bdiStates: { ...s.bdiStates, [agentId]: updated },
        bdiUpdates: [
          ...s.bdiUpdates.slice(-50),
          { type, ...data, timestamp: Date.now() } as BdiUpdate,
        ],
      };
    });
  },

  totalEvents: 0,
  incrementStat: () => set((s) => ({ totalEvents: s.totalEvents + 1 })),
  eventTimestamps: [],

  systemStats: null,
  setSystemStats: (s) => set({ systemStats: s }),

  paused: false,
  setPaused: (v) => set({ paused: v }),

  eventFilter: "all",
  setEventFilter: (f) => set({ eventFilter: f }),
  agentFilter: [],
  setAgentFilter: (a) => set({ agentFilter: a }),
}));
