"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDemoStore } from "@/stores/demo-store";
import { Terminal } from "lucide-react";

export function BackgroundPanel() {
  const [open, setOpen] = useState(false);
  const { events, isConnected, totalEvents, systemStats } = useDemoStore();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-40 h-10 w-10 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Terminal className="h-4 w-4" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1">System Status</h3>
            <div className="flex gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Badge variant="secondary">{totalEvents} events</Badge>
            </div>
          </div>

          {systemStats && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-2">Bus Statistics</h4>
                <div className="space-y-1 text-xs font-mono">
                  <div>Published: {systemStats.busStats.messagesPublished}</div>
                  <div>Subscribers: {systemStats.busStats.subscriberCount}</div>
                  <div>Middleware: {systemStats.middlewareCount}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Monitor Stats</h4>
                <div className="space-y-1 text-xs font-mono">
                  <div>Events: {systemStats.monitorStats.eventCount}</div>
                  <div>Rate: {systemStats.monitorStats.eventsPerSecond}/s</div>
                  <div>Uptime: {Math.round(systemStats.monitorStats.uptime)}s</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Agent BDI Snapshots</h4>
                {systemStats.agents.map((agent) => (
                  <div key={agent.id} className="mb-3 p-2 rounded bg-muted text-xs font-mono">
                    <div className="font-semibold mb-1">{agent.id}</div>
                    <div className="text-muted-foreground">
                      Beliefs: {Object.keys(agent.bdi.beliefs).length} |
                      Desires: {agent.bdi.desires.length} |
                      Intentions: {agent.bdi.intentions.length}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">Raw Event Stream</h4>
            <ScrollArea className="h-[300px] rounded border bg-muted/50 p-2">
              {events.slice(-30).reverse().map((e, i) => (
                <div key={i} className="text-xs font-mono mb-1 p-1 border-b border-border/50">
                  <span className="text-muted-foreground">{new Date(e.timestamp).toLocaleTimeString()}</span>
                  {" "}
                  <span className="text-primary">{e.type}</span>
                  {e.from && <span className="text-muted-foreground"> from:{e.from}</span>}
                </div>
              ))}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
