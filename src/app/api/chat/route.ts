import { NextRequest } from "next/server";
import { initializeMosaic, handleChat } from "@/lib/mosaic-server";

export async function POST(req: NextRequest) {
  try {
    await initializeMosaic();
    const { message, sessionId } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "message is required" }, { status: 400 });
    }

    const result = await handleChat(message, sessionId);

    return Response.json({
      response: result.response,
      agents: result.agents,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
