"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromptInput } from "@/components/scaffold/prompt-input";
import { WalkthroughStepper } from "@/components/scaffold/walkthrough-stepper";
import { AgentTopologyPreview } from "@/components/scaffold/agent-topology-preview";
import { ConfigPreview } from "@/components/scaffold/config-preview";
import { CodePreview } from "@/components/scaffold/code-preview";
import { CheckCircle2 } from "lucide-react";

interface ScaffoldData {
  requirements?: {
    purpose: string;
    agentRoles: string[];
    dataSources: string[];
    orchestration: string;
  };
  agents?: Array<{
    id: string;
    name: string;
    type: string;
    beliefs: string[];
    desires: string[];
    intentions: string[];
    description: string;
  }>;
  connections?: Array<{
    from: string;
    to: string;
    messageType: string;
  }>;
  profileJson?: string;
  bootstrapCode?: string;
}

export default function ScaffoldPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ScaffoldData | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setCurrentStep(1);
    setData(null);

    try {
      // Simulate stepping through phases
      await delay(800);
      setCurrentStep(2);

      const res = await fetch("/api/scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) throw new Error("Scaffold request failed");

      const result = await res.json();
      const scaffold = result.scaffold;
      setData(scaffold);

      // Animate through remaining steps
      setCurrentStep(3);
      await delay(600);
      setCurrentStep(4);
      await delay(600);
      setCurrentStep(5);
      await delay(600);
      setCurrentStep(6);
    } catch (err) {
      console.error("Scaffold error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-57px)]">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {currentStep > 0 && (
          <div className="flex justify-center">
            <WalkthroughStepper currentStep={currentStep} loading={loading} />
          </div>
        )}

        {/* Step 2: Requirements */}
        {data?.requirements && currentStep >= 2 && (
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Step 2 — Requirements Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-sm">
              <div>
                <span className="font-medium">Purpose:</span>{" "}
                <span className="text-muted-foreground">{data.requirements.purpose}</span>
              </div>
              <div>
                <span className="font-medium">Agent Roles:</span>{" "}
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.requirements.agentRoles.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Orchestration:</span>{" "}
                <Badge variant="outline" className="text-xs">{data.requirements.orchestration}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Topology */}
        {data?.agents && data?.connections && currentStep >= 3 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Step 3 — Agent Architecture</h4>
            <AgentTopologyPreview agents={data.agents} connections={data.connections} />
          </div>
        )}

        {/* Step 4: BDI Config */}
        {data?.agents && currentStep >= 4 && (
          <ConfigPreview agents={data.agents} />
        )}

        {/* Step 5: Profile & Bootstrap */}
        {currentStep >= 5 && data?.profileJson && (
          <CodePreview title="Step 5 — profile.json" code={data.profileJson} />
        )}
        {currentStep >= 5 && data?.bootstrapCode && (
          <CodePreview title="Step 5 — main.ts (Bootstrap)" code={data.bootstrapCode} />
        )}

        {/* Step 6: Ready */}
        {currentStep >= 6 && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-green-400" />
              <h3 className="font-semibold mb-1">Your System is Ready</h3>
              <p className="text-sm text-muted-foreground">
                Copy the generated code above to start building your multi-agent system with Mosaic.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
