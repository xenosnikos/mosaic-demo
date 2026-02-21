import { initializeMosaic, getSystemStats } from "@/lib/mosaic-server";

export async function GET() {
  try {
    await initializeMosaic();
    const stats = getSystemStats();
    return Response.json(stats);
  } catch (error) {
    console.error("System stats error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
