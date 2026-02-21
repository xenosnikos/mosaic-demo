"use client";

import { ChatInterface } from "@/components/chatbot/chat-interface";
import { BDIInspector } from "@/components/chatbot/bdi-inspector";
import { AgentPipeline } from "@/components/chatbot/agent-pipeline";

export default function ChatbotPage() {
  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Chat — 50% */}
      <div className="flex-1 min-w-0 border-r">
        <ChatInterface />
      </div>

      {/* BDI Inspector — 25% */}
      <div className="w-[300px] border-r hidden lg:block">
        <BDIInspector />
      </div>

      {/* Agent Pipeline — 25% */}
      <div className="w-[280px] hidden xl:block">
        <AgentPipeline />
      </div>
    </div>
  );
}
