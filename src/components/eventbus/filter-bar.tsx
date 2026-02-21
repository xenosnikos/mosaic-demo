"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/stores/demo-store";
import { Pause, Play, Trash2 } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "bdi:", label: "BDI" },
  { value: "llm:", label: "LLM" },
  { value: "QUERY", label: "Queries" },
  { value: "CHAT", label: "Chat" },
];

export function FilterBar() {
  const { eventFilter, setEventFilter, paused, setPaused, clearEvents } = useDemoStore();

  return (
    <div className="flex items-center gap-2 p-3 border-b">
      <div className="flex items-center gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              eventFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => setEventFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPaused(!paused)}>
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearEvents}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
