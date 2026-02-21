"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoStore } from "@/stores/demo-store";

export function AgentList() {
  const { systemStats } = useDemoStore();
  const agents = systemStats?.agents || [];

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">Agent Registry</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Provider</th>
                <th className="text-center py-2 font-medium">Beliefs</th>
                <th className="text-center py-2 font-medium">Desires</th>
                <th className="text-center py-2 font-medium">Intentions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-border/50">
                  <td className="py-2 font-mono">{agent.id}</td>
                  <td className="py-2">
                    <Badge variant="outline" className="text-[10px]">{agent.type}</Badge>
                  </td>
                  <td className="py-2">
                    <Badge variant="secondary" className="text-[10px]">{agent.providerId}</Badge>
                  </td>
                  <td className="py-2 text-center text-blue-400">
                    {Object.keys(agent.bdi.beliefs).length}
                  </td>
                  <td className="py-2 text-center text-amber-400">
                    {agent.bdi.desires.length}
                  </td>
                  <td className="py-2 text-center text-green-400">
                    {agent.bdi.intentions.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
