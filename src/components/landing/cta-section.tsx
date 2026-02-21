import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Brain, Puzzle } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Event-Driven Architecture",
    desc: "Publish/subscribe event bus with middleware pipeline, session scoping, and real-time traffic monitoring.",
  },
  {
    icon: Brain,
    title: "BDI Cognitive Agents",
    desc: "Formal Belief-Desire-Intention model with automatic state broadcasting and LLM-powered reasoning.",
  },
  {
    icon: Puzzle,
    title: "Pluggable Extensibility",
    desc: "10+ extension points: LLM providers, tools, middleware, schedulers, agents, bridges, algorithms, and more.",
  },
];

export function CTASection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <CardContent className="pt-6">
                <f.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/demo/chatbot">
            <Button size="lg" className="gap-2">
              Try the Live Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
