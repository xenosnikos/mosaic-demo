"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoStore } from "@/stores/demo-store";
import { Users, Layers, Radio, Activity } from "lucide-react";

export function StatsCards() {
  const { systemStats, totalEvents, eventTimestamps } = useDemoStore();

  // Calculate events per second from recent timestamps
  const now = Date.now();
  const recent = eventTimestamps.filter((t) => now - t < 10000);
  const eps = recent.length > 0 ? (recent.length / 10).toFixed(1) : "0";

  const cards = [
    {
      label: "Active Agents",
      value: systemStats?.schedulerStatus.agentCount || 0,
      icon: Users,
    },
    {
      label: "Active Sessions",
      value: systemStats?.sessionStats.activeSessions ?? 0,
      icon: Layers,
    },
    {
      label: "Total Events",
      value: totalEvents,
      icon: Radio,
    },
    {
      label: "Events/sec",
      value: eps,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
            <c.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
