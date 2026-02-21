"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventEnvelope } from "@/types/demo";
import { ChevronDown } from "lucide-react";

function getEventColor(type: string) {
  if (type.startsWith("bdi:")) return "border-l-orange-500";
  if (type.startsWith("llm:")) return "border-l-purple-500";
  if (type.includes("QUERY") || type.includes("query")) return "border-l-blue-500";
  if (type.includes("CHAT") || type.includes("chat")) return "border-l-green-500";
  return "border-l-muted-foreground/30";
}

function getTypeBadgeVariant(type: string): "default" | "secondary" | "outline" {
  if (type.startsWith("bdi:")) return "default";
  if (type.startsWith("llm:")) return "secondary";
  return "outline";
}

export function EventCard({ event }: { event: EventEnvelope }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "border-l-2 bg-muted/30 rounded-r p-2 mb-1 cursor-pointer hover:bg-muted/50 transition-colors",
        getEventColor(event.type)
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground font-mono w-16 shrink-0">
          {new Date(event.timestamp).toLocaleTimeString()}
        </span>
        <Badge variant={getTypeBadgeVariant(event.type)} className="text-[10px] shrink-0">
          {event.type}
        </Badge>
        {event.from && (
          <span className="text-muted-foreground truncate">
            {event.from} &rarr; {event.to || "broadcast"}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 ml-auto shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </div>

      {/* BDI event special display */}
      {!expanded && event.type.startsWith("bdi:") && !!event.payload && (
        <div className="mt-1 text-[10px] font-mono text-muted-foreground pl-16">
          {event.type === "bdi:belief-changed" && (
            <span>
              {(event.payload as any).key} = {JSON.stringify((event.payload as any).value)?.slice(0, 50)}
            </span>
          )}
          {event.type === "bdi:desire-added" && (
            <Badge variant="secondary" className="text-[9px] bg-amber-500/10 text-amber-400">
              {(event.payload as any).desire}
            </Badge>
          )}
          {event.type === "bdi:intention-adopted" && (
            <Badge variant="secondary" className="text-[9px] bg-green-500/10 text-green-400">
              {(event.payload as any).intention}
            </Badge>
          )}
        </div>
      )}

      {expanded && (
        <div className="mt-2 text-[10px] font-mono bg-background rounded p-2 overflow-x-auto">
          <pre className="whitespace-pre-wrap">{JSON.stringify(event, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
