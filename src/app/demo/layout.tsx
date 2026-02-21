"use client";

import Link from "next/link";
import { TabNav } from "@/components/demo/tab-nav";
import { BackgroundPanel } from "@/components/demo/background-panel";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/lib/ws-client";
import { useDemoStore } from "@/stores/demo-store";
import { useEffect } from "react";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  useWebSocket();

  const { isConnected, setSystemStats } = useDemoStore();

  // Poll system stats every 3s
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/system");
        if (res.ok) {
          const data = await res.json();
          setSystemStats(data);
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [setSystemStats]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg">
            Mosaic
          </Link>
          <TabNav />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
      <BackgroundPanel />
    </div>
  );
}
