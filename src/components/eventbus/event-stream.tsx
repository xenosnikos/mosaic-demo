"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventCard } from "./event-card";
import { useDemoStore } from "@/stores/demo-store";

export function EventStream() {
  const { events, eventFilter } = useDemoStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredEvents = events.filter((e) => {
    if (eventFilter === "all") return true;
    return e.type?.includes(eventFilter);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredEvents.length]);

  return (
    <ScrollArea className="h-full p-2">
      {filteredEvents.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
          No events yet. Send a chat message to generate events.
        </div>
      ) : (
        filteredEvents.map((event, i) => <EventCard key={`${event.id}-${i}`} event={event} />)
      )}
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
