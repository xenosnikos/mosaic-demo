import { LLMAgent } from "@dofinity/mosaic-core";
import type { BeliefSet } from "@dofinity/mosaic-core";

const MOSAIC_API_REFERENCE = `
# Mosaic Core API Reference

## Agent Creation
\`\`\`typescript
import { LLMAgent, BDIAgent, bus, ProviderRegistry } from "@dofinity/mosaic-core";

// Extend LLMAgent for LLM-powered agents
class MyAgent extends LLMAgent {
  constructor(id: string, providerId = "openai", sessionId?: string) {
    super(id, providerId, sessionId);
  }

  protected template(beliefs: BeliefSet) {
    return {
      system: "You are a helpful assistant.",
      prompt: beliefs.get<string>("user_query") || ""
    };
  }

  async perceive(event?: unknown) {
    // Read from bus, sensors, etc.
  }

  async act() {
    const reply = this.belief<string>("llm_reply");
    this.send("target-agent", "response", { text: reply });
  }

  clone(newId: string, newSessionId?: string) {
    return new MyAgent(newId, this.getProviderId(), newSessionId);
  }
}
\`\`\`

## Event Bus
\`\`\`typescript
import { bus, type Envelope } from "@dofinity/mosaic-core";

// Publish
bus.publish({
  id: crypto.randomUUID(),
  type: "my-event",
  payload: { data: "hello" },
  from: "agent-a",
  to: "agent-b",
  timestamp: Date.now(),
  sessionId: "optional-session"
});

// Subscribe
const subId = bus.subscribe("channel", (envelope: Envelope) => {
  console.log(envelope.type, envelope.payload);
}, { sessionId: "optional" });

// Middleware
bus.use(async (msg) => {
  console.log("intercepted:", msg.type);
  return msg; // or return false to block
});

// Request-Response
const result = await bus.request("target", "query", { q: "hello" }, 5000);
\`\`\`

## BDI Agent
\`\`\`typescript
// Beliefs
agent.addBelief("key", value);
agent.belief<string>("key");
agent.hasBelief("key");
agent.removeBelief("key");

// Desires
agent.addDesire("goal-name");
agent.hasDesire("goal-name");
agent.removeDesire("goal-name");

// Intentions
agent.adoptIntention("plan-name");
agent.hasIntention("plan-name");
agent.dropIntention("plan-name");

// Snapshot
const snapshot = agent.bdi.snapshot();
// { beliefs: { key: value }, desires: ["goal"], intentions: ["plan"] }
\`\`\`

## Scheduler
\`\`\`typescript
import { HybridScheduler } from "@dofinity/mosaic-core";

const scheduler = new HybridScheduler([agent1, agent2], {
  tickMs: 1000,
  sessionId: "my-session"
});
scheduler.start();
scheduler.spawn(new MyAgent("agent-3"));
scheduler.trigger("agent-1", eventData);
scheduler.getStatus(); // { mode, isRunning, agentCount, ... }
scheduler.stop();
\`\`\`

## Provider System
\`\`\`typescript
import { ProviderRegistry, type LLMProvider } from "@dofinity/mosaic-core";

class MyProvider implements LLMProvider {
  id = "my-llm";
  async generate({ prompt, system, temperature, model, stream }) {
    // Call your LLM API
    return "response text";
  }
}

ProviderRegistry.register(new MyProvider());
const provider = ProviderRegistry.get("my-llm");
\`\`\`

## Tool Registry
\`\`\`typescript
import { ToolRegistry, type ToolProvider } from "@dofinity/mosaic-core";

class SearchTool implements ToolProvider {
  id = "web-search";
  handles = ["search:web", "search:query"];
  async call(intent: { query: string }) {
    return { results: [...] };
  }
}

ToolRegistry.register(new SearchTool());
const tool = ToolRegistry.byIntent("search:web");
\`\`\`

## Session Manager
\`\`\`typescript
import { SessionManager } from "@dofinity/mosaic-core";

const mgr = new SessionManager(1000);
const session = mgr.createSession("user-id");
session.scheduler.spawn(myAgent);
mgr.getStats(); // { totalSessions, activeSessions, sessions: [...] }
\`\`\`

## Configuration
\`\`\`typescript
import { get, requireEnv, numberEnv, boolEnv } from "@dofinity/mosaic-core";

const apiKey = requireEnv("API_KEY"); // throws if missing
const port = numberEnv("PORT", 3000);
const debug = boolEnv("DEBUG", false);
\`\`\`

## Monitoring
\`\`\`typescript
import { EnhancedMonitor } from "@dofinity/mosaic-core";

const monitor = new EnhancedMonitor({ level: "info", service: "my-app" });
monitor.getStats(); // { eventCount, eventsPerSecond, uptime }
\`\`\`
`;

export class MosaicCodeAgent extends LLMAgent {
  constructor(id: string, providerId = "openai", sessionId?: string) {
    super(id, providerId, sessionId);
  }

  protected template(beliefs: BeliefSet): { system: string; prompt: string } {
    const query = beliefs.get<string>("query") || "";

    return {
      system: `You are a Mosaic framework code expert. Generate working TypeScript code examples using the Mosaic API. Always include proper imports from "@dofinity/mosaic-core". Use the API reference below for accuracy.

${MOSAIC_API_REFERENCE}

Guidelines:
- Always show imports
- Use TypeScript with proper types
- Include comments explaining key patterns
- Demonstrate BDI patterns where relevant
- Show real, working code that follows the actual API`,
      prompt: query,
    };
  }

  clone(newId: string, newSessionId?: string): MosaicCodeAgent {
    return new MosaicCodeAgent(newId, this.getProviderId(), newSessionId ?? this.sessionId);
  }
}
