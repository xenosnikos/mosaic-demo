"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, LayoutDashboard, Radio, Wand2 } from "lucide-react";

const tabs = [
  { href: "/demo/chatbot", label: "Chatbot", icon: MessageSquare },
  { href: "/demo/console", label: "Console", icon: LayoutDashboard },
  { href: "/demo/eventbus", label: "Event Bus", icon: Radio },
  { href: "/demo/scaffold", label: "Scaffold", icon: Wand2 },
];

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
