import { LLMAgent } from "@dofinity/mosaic-core";
import type { BeliefSet } from "@dofinity/mosaic-core";

export class DemoCoordinatorAgent extends LLMAgent {
  constructor(id: string, providerId = "openai", sessionId?: string) {
    super(id, providerId, sessionId);
  }

  protected template(beliefs: BeliefSet): { system: string; prompt: string } {
    const message = beliefs.get<string>("pending_message");
    const responses = beliefs.get<Array<{ agentId: string; response: string }> | null>(
      "specialist_responses"
    );

    if (responses && responses.length > 0) {
      return {
        system: `You are a coordinator agent in the Mosaic multi-agent framework. Your job is to synthesize responses from specialist agents into a single coherent answer. Keep the formatting of code blocks. Be concise but thorough.`,
        prompt: `Synthesize these specialist responses into a single coherent answer:\n\n${responses
          .map((r) => `--- ${r.agentId} ---\n${r.response}`)
          .join("\n\n")}`,
      };
    }

    return {
      system: `You are a coordinator agent in the Mosaic multi-agent framework. Your job is to classify the user's question and decide which specialist agent(s) should handle it.

Available specialists:
- knowledge-agent: Handles questions about Mosaic architecture, concepts, BDI model, event bus, scheduling, sessions, and general framework knowledge.
- code-agent: Handles requests for code examples, implementation patterns, API usage, and technical how-to questions.

Respond with ONLY one of these routing decisions (no other text):
- "knowledge" - route to knowledge agent only
- "code" - route to code agent only
- "knowledge,code" - route to both agents`,
      prompt: `Classify and route: "${message}"`,
    };
  }

  clone(newId: string, newSessionId?: string): DemoCoordinatorAgent {
    return new DemoCoordinatorAgent(newId, this.getProviderId(), newSessionId ?? this.sessionId);
  }
}
