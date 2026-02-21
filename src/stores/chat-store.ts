import { create } from "zustand";
import type { ChatMessage } from "@/types/demo";

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  activeAgentPhase: Record<string, "perceive" | "decide" | "act" | "idle">;

  addMessage: (msg: ChatMessage) => void;
  setTyping: (v: boolean) => void;
  setAgentPhase: (agentId: string, phase: "perceive" | "decide" | "act" | "idle") => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  activeAgentPhase: {},

  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),

  setTyping: (v) => set({ isTyping: v }),

  setAgentPhase: (agentId, phase) =>
    set((s) => ({
      activeAgentPhase: { ...s.activeAgentPhase, [agentId]: phase },
    })),

  clearMessages: () => set({ messages: [] }),
}));
