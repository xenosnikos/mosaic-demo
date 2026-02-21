import {
  bus,
  HybridScheduler,
  SessionManager,
  ProviderRegistry,
  createLogger,
  type Envelope,
  type MessageMiddleware,
} from "@dofinity/mosaic-core";

import { DemoCoordinatorAgent } from "@/lib/agents/coordinator";
import { MosaicKnowledgeAgent } from "@/lib/agents/knowledge";
import { MosaicCodeAgent } from "@/lib/agents/code";

const log = createLogger("mosaic-demo");

const DEMO_SESSION = "demo-session";

// ─── Global Singleton State ───
// Next.js dev mode creates separate module instances per route.
// We store all state on globalThis so every instance shares the same agents.
interface MosaicDemoGlobal {
  initPromise: Promise<void> | null;
  scheduler: HybridScheduler;
  sessionMgr: SessionManager;
  coordinator: DemoCoordinatorAgent;
  knowledgeAgent: MosaicKnowledgeAgent;
  codeAgent: MosaicCodeAgent;
  monitorStats: { eventCount: number; eventsPerSecond: number; uptime: number };
  monitorStartTime: number;
  middlewareCount: number;
  messageCountByType: Record<string, number>;
  totalMessages: number;
}

const g = globalThis as typeof globalThis & { __mosaicDemo?: MosaicDemoGlobal };

function getState(): MosaicDemoGlobal {
  if (!g.__mosaicDemo) {
    g.__mosaicDemo = {
      initPromise: null,
      scheduler: undefined!,
      sessionMgr: undefined!,
      coordinator: undefined!,
      knowledgeAgent: undefined!,
      codeAgent: undefined!,
      monitorStats: { eventCount: 0, eventsPerSecond: 0, uptime: 0 },
      monitorStartTime: Date.now(),
      middlewareCount: 0,
      messageCountByType: {},
      totalMessages: 0,
    };
  }
  return g.__mosaicDemo;
}

export async function initializeMosaic() {
  const state = getState();

  // If already initializing or initialized, await the existing promise
  if (state.initPromise) {
    await state.initPromise;
    return;
  }

  // Claim the init slot with a promise
  state.initPromise = doInit(state);
  await state.initPromise;
}

async function doInit(state: MosaicDemoGlobal) {
  log.info("Initializing Mosaic demo system...");

  // ─── Register OpenAI Provider ───
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const defaultModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  try { ProviderRegistry.get("openai"); } catch {
    ProviderRegistry.register({
      id: "openai",
      async generate({ prompt = "", system = "", temperature = 0.7, model = defaultModel, stream = false }) {
        if (!stream) {
          const chat = await openai.chat.completions.create({
            model,
            messages: [
              { role: "system", content: system },
              { role: "user", content: prompt },
            ],
            temperature,
          });
          return chat.choices[0].message.content ?? "";
        }
        const streamResult = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          temperature,
          stream: true,
        });
        async function* gen() {
          for await (const chunk of streamResult) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) yield content;
          }
        }
        return gen();
      },
    });
  }

  // ─── Middleware (bus.use) — demonstrates extension point ───
  const demoMiddleware: MessageMiddleware = async (msg) => {
    state.totalMessages++;
    const t = (msg as Envelope).type || "unknown";
    state.messageCountByType[t] = (state.messageCountByType[t] || 0) + 1;

    // Forward all messages to WebSocket clients
    const broadcast = (globalThis as any).__wsBroadcast;
    if (broadcast) {
      try {
        broadcast({
          id: (msg as Envelope).id,
          type: (msg as Envelope).type,
          from: (msg as Envelope).from,
          to: (msg as Envelope).to,
          timestamp: (msg as Envelope).timestamp,
          sessionId: (msg as Envelope).sessionId,
          payload: safePayload((msg as Envelope).payload),
        });
      } catch {
        // Ignore serialization errors
      }
    }

    return msg; // pass through
  };
  bus.use(demoMiddleware);
  state.middlewareCount++;

  // ─── Monitor ───
  state.monitorStartTime = Date.now();
  bus.subscribe("traffic", () => {
    state.monitorStats.eventCount++;
  });

  // ─── Session Manager ───
  state.sessionMgr = new SessionManager(60000); // 60s tick

  // ─── Agents (session-scoped for BDI broadcasting) ───
  state.coordinator = new DemoCoordinatorAgent("coordinator", "openai", DEMO_SESSION);
  state.knowledgeAgent = new MosaicKnowledgeAgent("knowledge-agent", "openai", DEMO_SESSION);
  state.codeAgent = new MosaicCodeAgent("code-agent", "openai", DEMO_SESSION);

  // ─── Scheduler ───
  state.scheduler = new HybridScheduler(
    [state.coordinator, state.knowledgeAgent, state.codeAgent],
    { tickMs: 300000, sessionId: DEMO_SESSION }
  );
  state.scheduler.start();

  log.info("Mosaic demo initialized", {
    agents: state.scheduler.getAgents().map((a) => a.id),
    session: DEMO_SESSION,
  });
}

function safePayload(payload: unknown): unknown {
  if (payload === undefined || payload === null) return null;
  try {
    // Test serialization, truncate large values
    const str = JSON.stringify(payload);
    if (str.length > 2000) {
      return { _truncated: true, _preview: str.slice(0, 500) + "..." };
    }
    return payload;
  } catch {
    return { _error: "unserializable" };
  }
}

// ─── Public API used by route handlers ───

export function getCoordinator() {
  return getState().coordinator;
}

export function getKnowledgeAgent() {
  return getState().knowledgeAgent;
}

export function getCodeAgent() {
  return getState().codeAgent;
}

export function getAllAgents() {
  const s = getState();
  return [s.coordinator, s.knowledgeAgent, s.codeAgent];
}

export function getSystemStats() {
  const state = getState();
  const allAgents = getAllAgents();

  const agents = allAgents.map((agent) => ({
    id: agent.id,
    type: agent.constructor.name,
    providerId: agent.getProviderId(),
    model: agent.getModel(),
    bdi: agent.bdi.snapshot(),
    phase: "idle" as const,
  }));

  const bdiSnapshots: Record<string, any> = {};
  for (const agent of allAgents) {
    bdiSnapshots[agent.id] = agent.bdi.snapshot();
  }

  const busStats = bus.getStatistics?.() || {
    messagesPublished: state.totalMessages,
    subscriberCount: 0,
    channelCount: 0,
  };

  return {
    agents,
    bdiSnapshots,
    busStats: {
      messagesPublished: state.totalMessages,
      subscriberCount: busStats.subscriberCount || 0,
      channelCount: 0,
    },
    sessionStats: state.sessionMgr?.getStats() || { activeSessions: 0, sessions: [] },
    schedulerStatus: state.scheduler?.getStatus() || { mode: "hybrid", isRunning: false, agentCount: 0 },
    middlewareCount: state.middlewareCount,
    monitorStats: {
      eventCount: state.monitorStats.eventCount,
      eventsPerSecond: Math.round(state.monitorStats.eventCount / Math.max(1, (Date.now() - state.monitorStartTime) / 1000)),
      uptime: (Date.now() - state.monitorStartTime) / 1000,
    },
    messageCountByType: state.messageCountByType,
  };
}

export async function handleChat(message: string, _sessionId?: string) {
  const state = getState();
  const { coordinator, knowledgeAgent, codeAgent } = state;

  // 1. Coordinator perceives
  coordinator.addBelief("pending_message", message);
  coordinator.addBelief("specialist_responses", null);
  coordinator.addBelief("response_ready", false);
  coordinator.addDesire("route_to_specialist");
  coordinator.adoptIntention("routing_query");

  await coordinator.perceive();

  // 2. Coordinator decides (LLM routing)
  await coordinator.decide();

  const routingDecision = coordinator.belief<string>("llm_reply") || "";
  coordinator.addBelief("routing_decision", routingDecision);
  coordinator.dropIntention("routing_query");

  // 3. Determine which specialists to call
  const useKnowledge = routingDecision.toLowerCase().includes("knowledge");
  const useCode = routingDecision.toLowerCase().includes("code");
  const responses: Array<{ agentId: string; response: string }> = [];

  // 4. Knowledge agent cycle
  if (useKnowledge || (!useCode && !useKnowledge)) {
    knowledgeAgent.addBelief("query", message);
    knowledgeAgent.addDesire("provide_knowledge");
    knowledgeAgent.adoptIntention("researching");

    await knowledgeAgent.perceive();
    await knowledgeAgent.decide();

    const reply = knowledgeAgent.belief<string>("llm_reply") || "";
    knowledgeAgent.addBelief("llm_reply", reply);
    knowledgeAgent.dropIntention("researching");
    knowledgeAgent.adoptIntention("formulating_answer");

    responses.push({ agentId: "knowledge-agent", response: reply });

    knowledgeAgent.dropIntention("formulating_answer");
    knowledgeAgent.removeDesire("provide_knowledge");
  }

  // 5. Code agent cycle
  if (useCode) {
    codeAgent.addBelief("query", message);
    codeAgent.addDesire("generate_code_example");
    codeAgent.adoptIntention("analyzing_request");

    await codeAgent.perceive();
    await codeAgent.decide();

    const reply = codeAgent.belief<string>("llm_reply") || "";
    codeAgent.addBelief("llm_reply", reply);
    codeAgent.dropIntention("analyzing_request");
    codeAgent.adoptIntention("writing_code");

    responses.push({ agentId: "code-agent", response: reply });

    codeAgent.dropIntention("writing_code");
    codeAgent.removeDesire("generate_code_example");
  }

  // 6. Coordinator synthesizes
  coordinator.addBelief("specialist_responses", responses);
  coordinator.removeDesire("route_to_specialist");
  coordinator.addDesire("synthesize_response");
  coordinator.adoptIntention("synthesizing");

  if (responses.length > 1) {
    await coordinator.decide();
  }

  const finalReply =
    responses.length > 1
      ? coordinator.belief<string>("llm_reply") || responses.map((r) => r.response).join("\n\n")
      : responses[0]?.response || "I could not generate a response. Please try again.";

  coordinator.addBelief("response_ready", true);
  coordinator.dropIntention("synthesizing");
  coordinator.removeDesire("synthesize_response");
  coordinator.addDesire("answer_user");

  // Broadcast the final reply event
  coordinator.addBelief("final_reply", finalReply);
  coordinator.removeDesire("answer_user");

  return {
    response: finalReply,
    agents: responses.map((r) => r.agentId),
  };
}

export { DEMO_SESSION };

