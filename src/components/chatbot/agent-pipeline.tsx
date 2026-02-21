"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/chat-store";
import { useDemoStore } from "@/stores/demo-store";
import { Eye, Brain, Zap } from "lucide-react";

const phases = [
  { id: "perceive" as const, label: "Perceive", icon: Eye, color: "text-blue-400" },
  { id: "decide" as const, label: "Decide", icon: Brain, color: "text-amber-400" },
  { id: "act" as const, label: "Act", icon: Zap, color: "text-green-400" },
];

const AGENTS = [
  { id: "coordinator", label: "Coordinator", color: "border-purple-500/50" },
  { id: "knowledge-agent", label: "Knowledge", color: "border-blue-500/50" },
  { id: "code-agent", label: "Code", color: "border-green-500/50" },
];

export function AgentPipeline() {
  const { activeAgentPhase } = useChatStore();
  const { events } = useDemoStore();
  const recentEvents = events.slice(-5);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Agent Pipeline</h3>
        <p className="text-xs text-muted-foreground">Perceive &rarr; Decide &rarr; Act</p>
      </div>

      <ScrollArea className="flex-1 p-3 space-y-4">
        {AGENTS.map((agent) => {
          const currentPhase = activeAgentPhase[agent.id] || "idle";
          return (
            <div key={agent.id} className={`p-3 rounded-lg border ${agent.color} bg-muted/50 mb-3`}>
              <div className="text-xs font-semibold mb-2">{agent.label}</div>
              <div className="flex items-center gap-1">
                {phases.map((phase, i) => {
                  const active = currentPhase === phase.id;
                  return (
                    <div key={phase.id} className="flex items-center">
                      <div
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
                          active
                            ? `bg-primary/20 ${phase.color} ring-1 ring-primary/30`
                            : "text-muted-foreground/40"
                        )}
                      >
                        <phase.icon className="h-3 w-3" />
                        {phase.label}
                      </div>
                      {i < phases.length - 1 && (
                        <span className="mx-0.5 text-muted-foreground/30">&rarr;</span>
                      )}
                    </div>
                  );
                })}
                {currentPhase === "idle" && (
                  <Badge variant="outline" className="text-[10px] ml-auto">idle</Badge>
                )}
              </div>
            </div>
          );
        })}

        {/* Recent bus events */}
        <div className="mt-4">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Recent Bus Events</h4>
          <div className="space-y-1">
            {recentEvents.map((e, i) => (
              <div key={i} className="text-[10px] font-mono p-1.5 rounded bg-muted flex items-center gap-2">
                <span className="text-primary">{e.type}</span>
                {e.from && (
                  <span className="text-muted-foreground">
                    {e.from} &rarr; {e.to || "broadcast"}
                  </span>
                )}
              </div>
            ))}
            {recentEvents.length === 0 && (
              <div className="text-[10px] text-muted-foreground/50 italic">No events yet</div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
