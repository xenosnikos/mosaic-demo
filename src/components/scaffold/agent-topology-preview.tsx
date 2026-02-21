"use client";

import { useMemo } from "react";
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

function ScaffoldNode({ data }: { data: any }) {
  return (
    <div className="bg-card border rounded-lg p-3 min-w-[140px] shadow-sm">
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2" />
      <div className="text-xs font-semibold">{data.label}</div>
      <Badge variant="outline" className="text-[9px] mt-1">{data.type}</Badge>
      {data.description && (
        <p className="text-[9px] text-muted-foreground mt-1">{data.description.slice(0, 40)}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { scaffold: ScaffoldNode };

interface TopologyAgent {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface TopologyConnection {
  from: string;
  to: string;
  messageType: string;
}

export function AgentTopologyPreview({
  agents,
  connections,
}: {
  agents: TopologyAgent[];
  connections: TopologyConnection[];
}) {
  const { nodes, edges } = useMemo(() => {
    const coordinator = agents.find((a) => a.type === "coordinator");
    const specialists = agents.filter((a) => a.type !== "coordinator");

    const n: Node[] = agents.map((agent, i) => {
      const isCoord = agent.type === "coordinator";
      const specIdx = specialists.indexOf(agent);

      return {
        id: agent.id,
        type: "scaffold",
        position: {
          x: isCoord ? 200 : specIdx * 180 + 40,
          y: isCoord ? 20 : 180,
        },
        data: {
          label: agent.name || agent.id,
          type: agent.type,
          description: agent.description,
        },
      };
    });

    const e: Edge[] = connections.map((conn, i) => ({
      id: `edge-${i}`,
      source: conn.from,
      target: conn.to,
      label: conn.messageType,
      animated: true,
      style: { stroke: "#3b82f6" },
      labelStyle: { fontSize: 9, fill: "#3b82f6" },
    }));

    return { nodes: n, edges: e };
  }, [agents, connections]);

  if (agents.length === 0) return null;

  return (
    <div className="h-[300px] border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        className="bg-background"
      >
        <Background gap={20} size={1} className="opacity-20" />
      </ReactFlow>
    </div>
  );
}
