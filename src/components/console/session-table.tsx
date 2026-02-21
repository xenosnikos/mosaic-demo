"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/stores/demo-store";

export function SessionTable() {
  const { systemStats } = useDemoStore();
  const sessions = systemStats?.sessionStats.sessions || [];

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">Sessions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-center py-2 font-medium">Agents</th>
                <th className="text-right py-2 font-medium">Age</th>
                <th className="text-right py-2 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s: any) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-2 font-mono truncate max-w-[150px]">{s.id}</td>
                  <td className="py-2 text-center">
                    <Badge variant="secondary" className="text-[10px]">{s.agentCount}</Badge>
                  </td>
                  <td className="py-2 text-right text-muted-foreground">
                    {Math.round(s.age / 1000)}s
                  </td>
                  <td className="py-2 text-right text-muted-foreground">
                    {Math.round(s.lastActivity / 1000)}s ago
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted-foreground">
                    No sessions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
