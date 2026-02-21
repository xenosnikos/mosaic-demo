"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div
            className="fixed right-0 top-0 h-full w-[480px] max-w-[90vw] bg-background border-l shadow-lg overflow-auto animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

function SheetContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export { Sheet, SheetContent };
