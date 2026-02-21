import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Box, MessageSquare, Shield, Monitor, Code2, Palette,
  Brain, Mountain, Rocket, Globe
} from "lucide-react";

const modules = [
  { name: "mosaic-core", desc: "Agents, BDI, event bus, schedulers, providers", icon: Box },
  { name: "mosaic-chatbot", desc: "Conversational agents with streaming & approvals", icon: MessageSquare },
  { name: "mosaic-auth", desc: "JWT, API keys, token validation", icon: Shield },
  { name: "mosaic-console", desc: "Admin dashboard & monitoring", icon: Monitor },
  { name: "mosaic-sdk", desc: "Client SDK for browser & Node.js", icon: Code2 },
  { name: "mosaic-ui", desc: "React UI component library", icon: Palette },
  { name: "mosaic-intent", desc: "Intent classification & routing", icon: Brain },
  { name: "mosaic-sierra", desc: "Sierra AI platform integration", icon: Mountain },
  { name: "mosaic-starter", desc: "Project template & scaffolding", icon: Rocket },
  { name: "mosaic-geo", desc: "Geographic features & location services", icon: Globe },
];

export function ModuleGrid() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">The Mosaic Ecosystem</h2>
        <p className="text-muted-foreground text-center mb-10">
          10+ packages covering the full stack of multi-agent development
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {modules.map((m) => (
            <Card key={m.name} className="hover:border-primary/50 transition-colors">
              <CardHeader className="p-4">
                <m.icon className="h-5 w-5 text-primary mb-2" />
                <CardTitle className="text-sm">{m.name}</CardTitle>
                <CardDescription className="text-xs">{m.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
