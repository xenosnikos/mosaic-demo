import { NextRequest } from "next/server";
import { ProviderRegistry } from "@dofinity/mosaic-core";
import { initializeMosaic } from "@/lib/mosaic-server";

export async function POST(req: NextRequest) {
  try {
    await initializeMosaic();
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 });
    }

    const provider = ProviderRegistry.get("openai");

    // Generate all steps using LLM
    const scaffoldPrompt = `You are a Mosaic multi-agent framework architect. Given the user's description, generate a complete multi-agent system design.

User request: "${prompt}"

Respond with a JSON object containing these fields:
{
  "requirements": {
    "purpose": "string - what the system does",
    "agentRoles": ["string - each agent role needed"],
    "dataSources": ["string - data sources"],
    "orchestration": "string - hub-and-spoke | mesh | chain"
  },
  "agents": [
    {
      "id": "string",
      "name": "string",
      "type": "coordinator | specialist",
      "beliefs": ["string - belief keys this agent manages"],
      "desires": ["string - desires"],
      "intentions": ["string - intentions"],
      "description": "string"
    }
  ],
  "connections": [
    { "from": "agent-id", "to": "agent-id", "messageType": "string" }
  ],
  "profileJson": "string - the generated profile.json content",
  "bootstrapCode": "string - the generated main.ts bootstrap code"
}

Generate realistic, working Mosaic code with proper imports from @dofinity/mosaic-core.`;

    const result = await provider.generate({
      prompt: scaffoldPrompt,
      system: "You are a Mosaic framework architect. Always respond with valid JSON.",
      temperature: 0.7,
      stream: false,
    });

    const text = result as string;

    // Try to parse as JSON, falling back to wrapping in a response
    let parsed;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      parsed = { raw: text };
    }

    return Response.json({
      scaffold: parsed,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Scaffold error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
