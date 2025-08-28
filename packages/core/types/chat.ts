export type GuardFailReason =
  | "membership-not-approved"
  | "bot-not-activated"
  | "not-in-allowlist";

export interface ChatRequest {
  botId: string;
  sessionId: string;    // persistí en localStorage
  clientMessageId: string; // para idempotencia
  text: string;
  attachments?: Array<{ name: string; uri: string; mime: string }>;
}

export interface ChatMeta {
  provider: "GPT" | "GEMINI";
  model: string;
  flowId: string;
  stepId: string;
  tokens?: { input?: number; output?: number; total?: number };
  usedRAG?: boolean;
  datasources?: string[]; // ids o nombres
}

export type ChatSSEvent =
  | { type: "meta"; data: ChatMeta }
  | { type: "delta"; data: string } // chunk de texto
  | { type: "done"; data?: { finishReason?: string } }
  | { type: "error"; data: { message: string } };
