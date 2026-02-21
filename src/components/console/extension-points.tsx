"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccordionItem } from "@/components/ui/accordion";
import {
  Cpu, Wrench, Layers, Users, Timer, Network,
  Dna, Mail, Settings, Shield
} from "lucide-react";

const extensionPoints = [
  {
    icon: Cpu,
    title: "LLM Providers",
    desc: "Plug in any LLM backend",
    active: true,
    code: `import { ProviderRegistry, type LLMProvider } from "@dofinity/mosaic-core";

class MyProvider implements LLMProvider {
  id = "my-llm";
  async generate({ prompt, system, temperature, model, stream }) {
    // Call your LLM API
    return "response";
  }
}

ProviderRegistry.register(new MyProvider());`,
    interface: `interface LLMProvider {
  id: string;
  generate(opts: {
    prompt: string;
    system?: string;
    temperature?: number;
    model?: string;
    stream?: boolean;
  }): Promise<string | AsyncIterableIterator<string>>;
}`,
  },
  {
    icon: Wrench,
    title: "Tool Providers",
    desc: "Register callable tools for agents",
    active: false,
    code: `import { ToolRegistry, type ToolProvider } from "@dofinity/mosaic-core";

class SearchTool implements ToolProvider {
  id = "web-search";
  handles = ["search:web"];
  async call(intent: { query: string }) {
    return { results: ["..."] };
  }
}

ToolRegistry.register(new SearchTool());`,
    interface: `interface ToolProvider<Req = unknown, Res = unknown> {
  id: string;
  handles: string[];
  call(intent: Req): Promise<Res>;
}`,
  },
  {
    icon: Layers,
    title: "Middleware",
    desc: "Intercept & transform all bus messages",
    active: true,
    code: `import { bus } from "@dofinity/mosaic-core";

bus.use(async (msg) => {
  console.log(\`[\${msg.type}] \${msg.from} → \${msg.to}\`);
  return msg; // or return false to block
});`,
    interface: `type MessageMiddleware = (
  msg: Envelope
) => Promise<Envelope | false>;`,
  },
  {
    icon: Users,
    title: "Custom Agents",
    desc: "Extend Agent / BDIAgent / LLMAgent",
    active: true,
    code: `import { LLMAgent, type BeliefSet } from "@dofinity/mosaic-core";

class MyAgent extends LLMAgent {
  constructor(id: string) {
    super(id, "openai");
  }

  protected template(beliefs: BeliefSet) {
    return {
      system: "You are helpful.",
      prompt: beliefs.get<string>("query") || ""
    };
  }

  clone(newId: string) { return new MyAgent(newId); }
}`,
    interface: `abstract class LLMAgent extends BDIAgent {
  protected abstract template(
    beliefs: BeliefSet
  ): { system: string; prompt: string };
}`,
  },
  {
    icon: Timer,
    title: "Schedulers",
    desc: "Custom execution strategies",
    active: false,
    code: `import { BaseScheduler, Agent } from "@dofinity/mosaic-core";

class PriorityScheduler extends BaseScheduler {
  readonly mode = "priority" as const;
  start() { /* custom scheduling logic */ }
  stop() { /* cleanup */ }
  getStatus() { return { mode: this.mode, isRunning: this.isRunning, agentCount: this.agents.size }; }
}`,
    interface: `abstract class BaseScheduler {
  abstract start(): void;
  abstract stop(): void;
  abstract getStatus(): SchedulerStatus;
  spawn(agent: Agent): Promise<Agent>;
  tick(): Promise<void>;
}`,
  },
  {
    icon: Network,
    title: "Bridges",
    desc: "Cross-system messaging via traffic channel",
    active: false,
    code: `import { bus } from "@dofinity/mosaic-core";

// Subscribe to all traffic for external forwarding
bus.subscribe("traffic", (envelope) => {
  externalSystem.send(envelope);
});`,
    interface: `// Subscribe to "traffic" channel to see ALL messages
// Implement session scoping for multi-tenant bridges`,
  },
  {
    icon: Dna,
    title: "Algorithms",
    desc: "Optimization & genetic algorithms",
    active: false,
    code: `import { BaseAlgorithm } from "@dofinity/mosaic-core";

class MyOptimizer extends BaseAlgorithm {
  evaluate(solution: any) {
    return computeFitness(solution);
  }
}`,
    interface: `abstract class BaseAlgorithm {
  abstract evaluate(solution: unknown): number;
}`,
  },
  {
    icon: Mail,
    title: "Message Types",
    desc: "Custom envelope types on any channel",
    active: false,
    code: `import { bus } from "@dofinity/mosaic-core";

// Publish custom message type
bus.publish({
  id: crypto.randomUUID(),
  type: "custom:alert",
  payload: { severity: "high", message: "..." },
  from: "monitor",
  to: "broadcast",
  timestamp: Date.now()
});`,
    interface: `interface Envelope<T = unknown> {
  id: string;
  type: string;
  payload: T;
  from?: string;
  to?: string;
  timestamp: number;
  sessionId?: string;
}`,
  },
  {
    icon: Settings,
    title: "Config",
    desc: "Environment & runtime configuration",
    active: false,
    code: `import { get, requireEnv, numberEnv, boolEnv } from "@dofinity/mosaic-core";

const apiKey = requireEnv("API_KEY");
const port = numberEnv("PORT", 3000);
const debug = boolEnv("DEBUG", false);`,
    interface: `function get(key: string): string | undefined;
function requireEnv(key: string): string;
function numberEnv(key: string, d?: number): number;
function boolEnv(key: string, d?: boolean): boolean;`,
  },
  {
    icon: Shield,
    title: "Auth",
    desc: "Token validation, JWT, API keys",
    active: false,
    code: `import { TokenValidator, JWTGenerator } from "@dofinity/mosaic-core";

const validator = new TokenValidator(publicKey);
const isValid = await validator.validate(token);

const jwt = new JWTGenerator(privateKey);
const token = jwt.sign({ userId: "123" });`,
    interface: `class TokenValidator {
  validate(token: string): Promise<boolean>;
}
class JWTGenerator {
  sign(payload: object): string;
}`,
  },
];

export function ExtensionPoints() {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">Extension Points</CardTitle>
        <CardDescription className="text-xs">10 ways to extend Mosaic</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid md:grid-cols-2 gap-3">
          {extensionPoints.map((ep) => (
            <div key={ep.title} className="border rounded-lg">
              <AccordionItem
                title={
                  <div className="flex items-center gap-2">
                    <ep.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium">{ep.title}</span>
                    {ep.active && (
                      <Badge className="text-[9px] h-4 bg-green-500/20 text-green-400 border-green-500/30">
                        active
                      </Badge>
                    )}
                  </div>
                }
                className="border-0"
              >
                <div className="space-y-2 px-1">
                  <p className="text-xs text-muted-foreground">{ep.desc}</p>
                  <div className="text-[10px] font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre className="text-muted-foreground whitespace-pre">{ep.interface}</pre>
                  </div>
                  <div className="text-[10px] font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre className="whitespace-pre">{ep.code}</pre>
                  </div>
                </div>
              </AccordionItem>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
