"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Requirements", desc: "Analyzing system needs" },
  { label: "Topology", desc: "Designing agent network" },
  { label: "BDI Config", desc: "Defining beliefs, desires, intentions" },
  { label: "Profile", desc: "Generating configuration" },
  { label: "Bootstrap", desc: "Creating startup code" },
  { label: "Preview", desc: "System ready" },
];

export function WalkthroughStepper({ currentStep, loading }: { currentStep: number; loading: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const completed = stepNum < currentStep;
        const active = stepNum === currentStep;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-all",
                  completed && "bg-primary text-primary-foreground border-primary",
                  active && "border-primary text-primary",
                  !completed && !active && "border-border text-muted-foreground"
                )}
              >
                {completed ? (
                  <Check className="h-3.5 w-3.5" />
                ) : active && loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  stepNum
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1",
                active ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "w-6 h-px mx-1",
                completed ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
