export interface BDISnapshot {
  beliefs: Record<string, unknown>;
  desires: string[];
  intentions: string[];
}

export interface AgentInfo {
  id: string;
  type: string;
  providerId: string;
  model?: string;
  bdi: BDISnapshot;
  phase: "perceive" | "decide" | "act" | "idle";
}

export interface EventEnvelope {
  id: string;
  type: string;
  payload: unknown;
  from?: string;
  to?: string;
  timestamp: number;
  sessionId?: string;
  meta?: Record<string, unknown>;
}

export interface BusStats {
  messagesPublished: number;
  subscriberCount: number;
  channelCount: number;
}

export interface SystemStats {
  agents: AgentInfo[];
  bdiSnapshots: Record<string, BDISnapshot>;
  busStats: BusStats;
  sessionStats: {
    activeSessions: number;
    sessions: Array<{
      id: string;
      agentCount: number;
      createdAt: number;
      lastActivity: number;
    }>;
  };
  schedulerStatus: {
    mode: string;
    isRunning: boolean;
    agentCount: number;
  };
  middlewareCount: number;
  monitorStats: {
    eventCount: number;
    eventsPerSecond: number;
    uptime: number;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentId?: string;
  timestamp: number;
}

export interface ScaffoldStep {
  step: number;
  type: "requirements" | "topology" | "bdi" | "profile" | "code" | "running";
  data: unknown;
}
