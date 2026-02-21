import { LLMAgent } from "@dofinity/mosaic-core";
import type { BeliefSet } from "@dofinity/mosaic-core";

const MOSAIC_KNOWLEDGE = `
# Mosaic Framework Knowledge Base

## Overview
Mosaic is an event-driven multi-agent system (MAS) framework built in TypeScript/Node.js. It provides a formal BDI (Belief-Desire-Intention) cognitive architecture, a pluggable LLM provider system, and a production-grade in-process event bus.

## Core Architecture

### Agent Hierarchy
- **Agent** (base class): Provides the Perceive-Decide-Act (PDA) cycle, session-scoped messaging, serialization, and bus auto-subscription. Every agent has an \`id\` and optional \`sessionId\`.
- **BDIAgent** (extends Agent): Adds a BDIStore with BeliefSet (Map), DesireSet (Set), and IntentionSet (Set). In session mode, BDI changes automatically broadcast events (\`bdi:belief-changed\`, \`bdi:desire-added\`, \`bdi:intention-adopted\`).
- **LLMAgent** (extends BDIAgent): Adds an LLMReasoner that calls the pluggable provider system. Subclasses implement \`template(beliefs)\` to define the system/prompt pair. The \`decide()\` method automatically calls the LLM and stores the reply as a belief.
- **ConversationalLLMAgent** (extends LLMAgent): Adds conversation history management, multi-turn context, and session-aware conversation tracking.

### Event Bus
The EventBus is a singleton (\`bus\`) backed by LocalEventBus (an EventEmitter-based IMessageBus). Key features:
- **Publish/Subscribe**: \`bus.publish(envelope)\`, \`bus.subscribe(channel, handler, options)\`
- **Session Scoping**: Channels are prefixed with \`session:{sessionId}:\` for isolation
- **Middleware Pipeline**: \`bus.use(middleware)\` — each middleware can transform or block messages
- **Request-Response**: \`bus.request(to, type, payload, timeout)\` for synchronous-style calls
- **Traffic Channel**: All messages are mirrored to a "traffic" channel for monitoring
- **Statistics**: \`bus.getStatistics()\` returns subscriber counts and connection state

### Schedulers
- **TickScheduler**: Runs all agent PDA cycles at a fixed interval (default 1000ms)
- **EventScheduler**: Agents execute only when triggered by bus events
- **HybridScheduler**: Combines both tick and event-driven execution
- **BaseScheduler**: Abstract base with agent spawn/remove, parallel execution, and snapshot support

### Session Manager
SessionManager provides multi-user isolation:
- \`createSession(userId?)\` — creates an isolated session with its own scheduler
- \`getSession(id)\` / \`getDefaultSession()\` — session lookup
- Sessions auto-expire after configurable timeout
- Each session tracks its own agents and metadata

### Provider System
- **ProviderRegistry**: Singleton registry for LLM providers. \`ProviderRegistry.register(provider)\`, \`ProviderRegistry.get(id)\`
- **LLMProvider interface**: \`{ id: string; generate(opts): Promise<string | AsyncIterableIterator<string>> }\`
- Built-in providers: OpenAI, Anthropic, Google, Azure OpenAI, Together AI
- **ToolRegistry**: Similar pattern for tool providers. \`ToolRegistry.register(tool)\`, \`ToolRegistry.byIntent(type)\`
- **ToolProvider interface**: \`{ id: string; handles: string[]; call(intent): Promise<response> }\`

### BDI Model
The Belief-Desire-Intention model is a formal cognitive architecture:
- **Beliefs**: What the agent knows (key-value pairs in a BeliefSet/Map). Updated via \`addBelief(key, value)\`
- **Desires**: What the agent wants to achieve (string labels in a DesireSet/Set). Added via \`addDesire(desire)\`
- **Intentions**: What the agent is committed to doing (string labels in an IntentionSet/Set). Adopted via \`adoptIntention(intention)\`
- **Snapshot**: \`agent.bdi.snapshot()\` returns \`{ beliefs: {}, desires: [], intentions: [] }\`

### Configuration
- \`get(key)\`: Read environment variable
- \`requireEnv(key)\`: Read or throw
- \`numberEnv(key, default)\`, \`boolEnv(key, default)\`: Typed env readers
- Auto-loads \`.env\` from process.cwd()

### Logging & Monitoring
- \`createLogger(component)\`: Returns a Winston logger instance
- \`EnhancedMonitor\`: Subscribes to bus traffic, provides \`getStats()\` with event counts and rates

## Extension Points (10+)
1. **LLM Providers** — implement LLMProvider, register with ProviderRegistry
2. **Tool Providers** — implement ToolProvider, register with ToolRegistry
3. **Middleware** — bus.use(fn) to intercept/transform all messages
4. **Custom Agents** — extend Agent, BDIAgent, LLMAgent, or ConversationalLLMAgent
5. **Schedulers** — extend BaseScheduler for custom execution strategies
6. **Bridges** — subscribe to "traffic" channel, implement cross-system messaging
7. **Algorithms** — extend BaseAlgorithm for optimization (genetic algorithm, fitness evaluation)
8. **Message Types** — publish/subscribe custom envelope types on any channel
9. **Config** — get(), requireEnv(), Environment singleton for runtime state
10. **Auth** — TokenValidator, JWTGenerator, ApiKeyManager for securing agent communication

## Packages
- mosaic-core: Core framework (agents, bus, BDI, schedulers, providers)
- mosaic-chatbot: Chatbot service with streaming and approval workflows
- mosaic-auth: JWT/API key authentication
- mosaic-console: Admin console and monitoring
- mosaic-sdk: Client SDK for browser/Node
- mosaic-ui: React UI components
- mosaic-intent: Intent classification
- mosaic-sierra: Sierra AI integration
- mosaic-starter: Project template
- mosaic-geo: Geographic features
`;

export class MosaicKnowledgeAgent extends LLMAgent {
  constructor(id: string, providerId = "openai", sessionId?: string) {
    super(id, providerId, sessionId);
  }

  protected template(beliefs: BeliefSet): { system: string; prompt: string } {
    const query = beliefs.get<string>("query") || "";

    return {
      system: `You are a Mosaic framework expert. Answer questions about the framework's architecture, concepts, and capabilities using the knowledge base below. Be accurate, concise, and reference specific APIs and classes.

${MOSAIC_KNOWLEDGE}`,
      prompt: query,
    };
  }

  clone(newId: string, newSessionId?: string): MosaicKnowledgeAgent {
    return new MosaicKnowledgeAgent(newId, this.getProviderId(), newSessionId ?? this.sessionId);
  }
}
