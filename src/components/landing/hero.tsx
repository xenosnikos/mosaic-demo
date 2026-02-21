import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground border border-border rounded-full px-4 py-1.5">
        <Cpu className="h-4 w-4" />
        <span>Event-Driven Multi-Agent Framework</span>
      </div>

      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight max-w-4xl leading-[1.1]">
        Mosaic
      </h1>
      <p className="mt-2 text-2xl sm:text-3xl font-semibold text-muted-foreground max-w-2xl">
        Multi-Agent Orchestration with BDI Cognitive Architecture
      </p>

      <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Build intelligent agent systems with formal Belief-Desire-Intention reasoning,
        pluggable LLM providers, and a production-grade event bus. TypeScript-native,
        session-aware, and endlessly extensible.
      </p>

      <div className="flex gap-4 mt-10">
        <Link href="/demo/chatbot">
          <Button size="lg" className="gap-2">
            Try the Live Demo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/demo/console">
          <Button size="lg" variant="outline">
            View Dashboard
          </Button>
        </Link>
      </div>
    </section>
  );
}
