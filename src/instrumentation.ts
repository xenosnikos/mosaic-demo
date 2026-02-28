export async function register() {
  // Only run on the server (not edge runtime)
  if (typeof window !== "undefined") return;

  // Initialize Mosaic agents in background (don't block Next.js startup)
  import("./lib/mosaic-server")
    .then(async ({ initializeMosaic }) => {
      await initializeMosaic();
      console.log("  Mosaic agents initialized");
    })
    .catch((err) => {
      console.error("  Failed to initialize Mosaic:", err);
    });
}
