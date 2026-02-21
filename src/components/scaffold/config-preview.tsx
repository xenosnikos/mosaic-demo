"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  type: string;
  beliefs: string[];
  desires: string[];
  intentions: string[];
  description: string;
}

export function ConfigPreview({ agents }: { agents: Agent[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">BDI Configuration per Agent</h4>
      <div className="grid md:grid-cols-2 gap-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="text-xs">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs font-mono flex items-center gap-2">
                {agent.name}
                <Badge variant="outline" className="text-[9px]">{agent.type}</Badge>
              </CardTitle>
              <p className="text-[10px] text-muted-foreground">{agent.description}</p>
            </CardHeader>
            <CardContent className="p-3 pt-1 space-y-2">
              <div>
                <span className="text-blue-400 font-medium">Beliefs:</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {agent.beliefs.map((b) => (
                    <span key={b} className="bg-blue-500/10 text-blue-400 rounded px-1.5 py-0.5 text-[9px] font-mono">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-amber-400 font-medium">Desires:</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {agent.desires.map((d) => (
                    <span key={d} className="bg-amber-500/10 text-amber-400 rounded px-1.5 py-0.5 text-[9px]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-green-400 font-medium">Intentions:</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {agent.intentions.map((i) => (
                    <span key={i} className="bg-green-500/10 text-green-400 rounded px-1.5 py-0.5 text-[9px]">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
