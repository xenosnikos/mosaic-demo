"use client";

import { StatsCards } from "@/components/console/stats-cards";
import { AgentList } from "@/components/console/agent-list";
import { SessionTable } from "@/components/console/session-table";
import { EventRateChart } from "@/components/console/event-rate-chart";
import { ExtensionPoints } from "@/components/console/extension-points";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConsolePage() {
  return (
    <ScrollArea className="h-[calc(100vh-57px)]">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <StatsCards />

        <div className="grid lg:grid-cols-2 gap-6">
          <AgentList />
          <SessionTable />
        </div>

        <EventRateChart />

        <ExtensionPoints />
      </div>
    </ScrollArea>
  );
}
