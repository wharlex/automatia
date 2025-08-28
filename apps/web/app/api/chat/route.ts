import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/options";
import { z } from "zod";
import { db } from "@packages/db";
import { guardAccess } from "@packages/core/flow/guards";
import { FlowRunner } from "@packages/core/FlowEngine/FlowRunner";
import { GuardService } from "@packages/core/services/GuardService";
import { DatasourceService } from "@packages/core/services/DatasourceService";
import { LLMService } from "@packages/core/services/LLMService";
import { WhatsAppService } from "@packages/core/services/WhatsAppService";
import type { ChatRequest, ChatSSEvent, ChatMeta } from "@packages/core/types/chat";
import { rateLimit } from "@/app/lib/ratelimit";

const Body = z.object({
  botId: z.string().min(1),
  sessionId: z.string().min(1),
  clientMessageId: z.string().min(1),
  text: z.string().min(1),
  attachments: z.array(z.object({ name: z.string(), uri: z.string(), mime: z.string() })).optional(),
});

export async function POST(req: Request) {
  // Rate limit
  const ip = (req.headers.get("x-forwarded-for") ?? "ip:unknown").split(",")[0].trim();
  if (!(await rateLimit({ key: `chat:${ip}`, limit: 20, windowSec: 60 }))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const { botId, sessionId, clientMessageId, text, attachments } = parsed.data;

  // Lookup bot & workspace
  const bot = await db.bot.findUnique({ 
    where: { id: botId }, 
    include: { workspace: true }
  });
  if (!bot) return NextResponse.json({ error: "bot_not_found" }, { status: 404 });

  // Guards
  const g = await guardAccess({ 
    userEmail: session.user.email!, 
    workspaceId: bot.workspaceId, 
    botId 
  }, db);
  
  if (!g.ok) {
    return NextResponse.json({ 
      error: "guard_failed", 
      reason: g.reason 
    }, { status: 403 });
  }

  // SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (e: ChatSSEvent) => controller.enqueue(encoder.encode(`event: ${e.type}\ndata: ${JSON.stringify(e.data)}\n\n`));
      
      try {
        // meta inicial
        const meta: ChatMeta = {
          provider: bot.provider === "GPT" ? "GPT" : "GEMINI",
          model: bot.providerModel,
          flowId: bot.id, // o id real del flow
          stepId: "start",
        };
        send({ type: "meta", data: meta });

        // Initialize services
        const guardService = new GuardService(db);
        const datasourceService = new DatasourceService(db);
        const llmService = new LLMService();
        const whatsappService = new WhatsAppService();

        // Get bot flow configuration
        const flowConfig = await db.configBlock.findFirst({
          where: {
            workspaceId: bot.workspaceId,
            key: "flow.config",
            status: "PUBLISHED"
          }
        });

        if (!flowConfig) {
          throw new Error("No flow configuration found");
        }

        const flow = JSON.parse(flowConfig.value as string);
        
        // Create FlowRunner instance
        const flowRunner = new FlowRunner(
          flow,
          {
            botId: bot.id,
            userId: session.user.id,
            userEmail: session.user.email!,
            workspaceId: bot.workspaceId,
            sessionId,
            clientMessageId,
            input: text,
            attachments
          },
          {
            guardService,
            datasourceService,
            llmService,
            whatsappService
          }
        );

        // Execute flow with streaming callbacks
        await flowRunner.run({
          onToken(token) { 
            send({ type: "delta", data: token }); 
          },
          onStep(stepId) { 
            meta.stepId = stepId; 
            send({ type: "meta", data: meta }); 
          },
          onMeta(extra) { 
            Object.assign(meta, extra); 
            send({ type: "meta", data: meta }); 
          },
        });

        send({ type: "done", data: { finishReason: "stop" } });
        controller.close();
      } catch (err: any) {
        console.error("Flow execution error:", err);
        send({ type: "error", data: { message: err?.message ?? "internal_error" } });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // para nginx
    }
  });
}
