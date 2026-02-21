"use client";

import { AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDemoStore } from "@/stores/demo-store";
import { Brain, Target, Zap } from "lucide-react";

const AGENT_LABELS: Record<string, { label: string; color: string }> = {
  coordinator: { label: "Coordinator", color: "text-purple-400" },
  "knowledge-agent": { label: "Knowledge Agent", color: "text-blue-400" },
  "code-agent": { label: "Code Agent", color: "text-green-400" },
};

export function BDIInspector() {
  const { bdiStates, systemStats } = useDemoStore();

  // Merge websocket BDI updates with system stats
  const agents = systemStats?.agents || [];
  const allAgentIds = [...new Set([...agents.map((a) => a.id), ...Object.keys(bdiStates)])];

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">BDI Inspector</h3>
        <p className="text-xs text-muted-foreground">Live belief/desire/intention state</p>
      </div>

      <ScrollArea className="flex-1 p-3">
        {allAgentIds.map((agentId) => {
          const wsState = bdiStates[agentId];
          const restState = systemStats?.bdiSnapshots?.[agentId];
          const bdi = wsState || restState || { beliefs: {}, desires: [], intentions: [] };
          const meta = AGENT_LABELS[agentId] || { label: agentId, color: "text-foreground" };

          const beliefEntries = Object.entries(bdi.beliefs).filter(
            ([k]) => !k.startsWith("_")
          );

          return (
            <AccordionItem
              key={agentId}
              defaultOpen
              title={
                <span className={`${meta.color} font-mono text-xs`}>
                  {meta.label}
                  <span className="text-muted-foreground ml-2">
                    B:{beliefEntries.length} D:{bdi.desires.length} I:{bdi.intentions.length}
                  </span>
                </span>
              }
            >
              <div className="space-y-3 text-xs">
                {/* Beliefs */}
                <div>
                  <div className="flex items-center gap-1 mb-1 text-muted-foreground">
                    <Brain className="h-3 w-3" />
                    <span className="font-medium">Beliefs</span>
                  </div>
                  {beliefEntries.length === 0 ? (
                    <div className="text-muted-foreground/50 italic">No beliefs</div>
                  ) : (
                    <div className="space-y-0.5">
                      {beliefEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start gap-2 p-1 rounded bg-blue-500/5 border border-blue-500/10"
                        >
                          <span className="font-mono text-blue-400 shrink-0">{key}</span>
                          <span className="text-muted-foreground truncate">
                            {typeof value === "string"
                              ? value.length > 60
                                ? value.slice(0, 60) + "..."
                                : value
                              : JSON.stringify(value)?.slice(0, 60)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desires */}
                <div>
                  <div className="flex items-center gap-1 mb-1 text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span className="font-medium">Desires</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bdi.desires.length === 0 ? (
                      <span className="text-muted-foreground/50 italic">No desires</span>
                    ) : (
                      bdi.desires.map((d) => (
                        <Badge key={d} variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20">
                          {d}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Intentions */}
                <div>
                  <div className="flex items-center gap-1 mb-1 text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    <span className="font-medium">Intentions</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bdi.intentions.length === 0 ? (
                      <span className="text-muted-foreground/50 italic">No intentions</span>
                    ) : (
                      bdi.intentions.map((i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                          {i}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </AccordionItem>
          );
        })}
      </ScrollArea>
    </div>
  );
}
