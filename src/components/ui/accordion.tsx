"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function AccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("border-b", className)}>
      <button
        className="flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && <div className="pb-4 pt-0">{children}</div>}
    </div>
  );
}

export { AccordionItem };
