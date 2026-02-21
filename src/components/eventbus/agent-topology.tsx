"use client";

import { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/stores/demo-store";

// Custom node component for agents
function AgentNode({ data }: { data: any }) {
  return (
    <div className="bg-card border rounded-lg p-3 min-w-[160px] shadow-sm">
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2" />

      <div className="text-xs font-semibold mb-1">{data.label}</div>
      <Badge variant="outline" className="text-[9px] mb-2">{data.type}</Badge>

      <div className="space-y-1 text-[10px]">
        <div className="flex items-center gap-1">
          <span className="text-blue-400">B:</span>
          <span className="text-muted-foreground">{data.beliefCount}</span>
          <span className="text-amber-400 ml-1">D:</span>
          <span className="text-muted-foreground">{data.desireCount}</span>
          <span className="text-green-400 ml-1">I:</span>
          <span className="text-muted-foreground">{data.intentionCount}</span>
        </div>
        {data.desires?.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {data.desires.slice(0, 2).map((d: string) => (
              <span key={d} className="bg-amber-500/10 text-amber-400 rounded px-1 text-[9px]">
                {d}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-1">
        <Badge variant="secondary" className="text-[9px]">{data.provider}</Badge>
        {data.phase && data.phase !== "idle" && (
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { agent: AgentNode };

export function AgentTopology() {
  const { systemStats, bdiStates, events } = useDemoStore();
  const agents = systemStats?.agents || [];

  const { nodes, edges } = useMemo(() => {
    const n: Node[] = agents.map((agent, i) => {
      const wsState = bdiStates[agent.id];
      const bdi = wsState || agent.bdi;

      return {
        id: agent.id,
        type: "agent",
        position: {
          x: agent.id === "coordinator" ? 250 : i === 1 ? 80 : 420,
          y: agent.id === "coordinator" ? 20 : 180,
        },
        data: {
          label: agent.id,
          type: agent.type,
          provider: agent.providerId,
          beliefCount: Object.keys(bdi.beliefs).length,
          desireCount: bdi.desires.length,
          intentionCount: bdi.intentions.length,
          desires: bdi.desires,
          phase: "idle",
        },
      };
    });

    // Build edges from recent events
    const recentEvents = events.slice(-20);
    const edgeMap = new Map<string, { count: number; type: string }>();

    for (const event of recentEvents) {
      if (event.from && event.to && event.from !== event.to && event.to !== "broadcast") {
        const key = `${event.from}-${event.to}`;
        const existing = edgeMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          edgeMap.set(key, { count: 1, type: event.type });
        }
      }
    }

    const e: Edge[] = [
      // Default edges showing the hub-spoke pattern
      {
        id: "coord-knowledge",
        source: "coordinator",
        target: "knowledge-agent",
        label: "QUERY_REQUEST",
        animated: true,
        style: { stroke: "#3b82f6" },
        labelStyle: { fontSize: 9, fill: "#3b82f6" },
      },
      {
        id: "coord-code",
        source: "coordinator",
        target: "code-agent",
        label: "QUERY_REQUEST",
        animated: true,
        style: { stroke: "#3b82f6" },
        labelStyle: { fontSize: 9, fill: "#3b82f6" },
      },
      {
        id: "knowledge-coord",
        source: "knowledge-agent",
        target: "coordinator",
        label: "QUERY_RESPONSE",
        animated: true,
        style: { stroke: "#22c55e" },
        labelStyle: { fontSize: 9, fill: "#22c55e" },
      },
      {
        id: "code-coord",
        source: "code-agent",
        target: "coordinator",
        label: "QUERY_RESPONSE",
        animated: true,
        style: { stroke: "#22c55e" },
        labelStyle: { fontSize: 9, fill: "#22c55e" },
      },
    ];

    return { nodes: n, edges: e };
  }, [agents, bdiStates, events]);

  if (agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Waiting for agent data...
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        className="bg-background"
      >
        <Background gap={20} size={1} className="opacity-20" />
      </ReactFlow>
    </div>
  );
}
