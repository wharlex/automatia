export async function GET() {
  try {
    // Basic health checks - you can expand these to actually ping services
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      services: {
        llm: "ok",
        db: "ok", 
        whatsapp: "ok",
        webhook: "ok",
        redis: "ok"
      },
      version: process.env.npm_package_version || "1.0.0"
    };

    return Response.json(health);
  } catch (error) {
    return Response.json({
      ok: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
