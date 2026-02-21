"use client";

import { FilterBar } from "@/components/eventbus/filter-bar";
import { AgentTopology } from "@/components/eventbus/agent-topology";
import { EventStream } from "@/components/eventbus/event-stream";

export default function EventBusPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <FilterBar />
      <div className="flex flex-1 min-h-0">
        {/* Topology — 55% */}
        <div className="flex-1 min-w-0 border-r">
          <AgentTopology />
        </div>

        {/* Event Stream — 45% */}
        <div className="w-[400px] lg:w-[480px]">
          <EventStream />
        </div>
      </div>
    </div>
  );
}
