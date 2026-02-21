"use client";

import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

const EXAMPLES = [
  "A customer support system with a router, FAQ agent, and escalation agent",
  "A code review pipeline with analysis, security, and style agents",
  "A research assistant with search, summarization, and citation agents",
  "A trading system with market analysis, risk assessment, and execution agents",
];

interface PromptInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function PromptInput({ value, onChange, onSubmit, loading }: PromptInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Describe Your System</h3>
        <p className="text-sm text-muted-foreground">
          Describe the multi-agent system you want to build, and Mosaic will generate the architecture.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your multi-agent system..."
        className="w-full h-32 rounded-lg border bg-muted/50 p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        disabled={loading}
      />

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className="text-xs border rounded-full px-3 py-1.5 hover:bg-muted transition-colors"
            onClick={() => onChange(ex)}
            disabled={loading}
          >
            {ex.length > 50 ? ex.slice(0, 50) + "..." : ex}
          </button>
        ))}
      </div>

      <Button onClick={onSubmit} disabled={loading || !value.trim()} className="gap-2">
        <Wand2 className="h-4 w-4" />
        {loading ? "Generating..." : "Generate Architecture"}
      </Button>
    </div>
  );
}
