"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoStore } from "@/stores/demo-store";

export function EventRateChart() {
  const { eventTimestamps } = useDemoStore();

  const bars = useMemo(() => {
    const now = Date.now();
    const buckets = new Array(30).fill(0);

    for (const ts of eventTimestamps) {
      const age = now - ts;
      const bucket = Math.floor(age / 2000); // 2s buckets
      if (bucket >= 0 && bucket < 30) {
        buckets[29 - bucket]++;
      }
    }

    const max = Math.max(...buckets, 1);
    return buckets.map((count) => ({
      count,
      height: (count / max) * 100,
    }));
  }, [eventTimestamps]);

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">Event Rate (last 60s)</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-end gap-[2px] h-16">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/40 rounded-t-sm transition-all duration-300 min-h-[2px]"
              style={{ height: `${Math.max(bar.height, 3)}%` }}
              title={`${bar.count} events`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
