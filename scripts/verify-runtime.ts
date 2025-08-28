// Verifica: LLM ping, GET/POST webhooks (WA/TG/Webchat), idempotencia WA, métricas.
// Uso: tsx scripts/verify-runtime.ts https://automatia.ar
import fetch from "node-fetch";
import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";

const BASE = process.argv[2] || process.env.BASE || "http://localhost:3000";
const prisma = new PrismaClient();

function assert(cond: any, msg: string) { if (!cond) throw new Error(msg); }

async function pingLLM() {
  const r = await fetch(`${BASE}/api/llm/ping`, { method: "POST" }).catch(()=>null);
  assert(r && r.ok, "LLM ping endpoint no responde 200");
  const j = await r!.json().catch(()=>({}));
  assert(j.ok === true || typeof j.message === "string", "LLM ping no OK");
  console.log("✓ LLM ping");
}

async function getActiveStuff() {
  const bot = await prisma.bot.findFirst({ orderBy: { updatedAt: "desc" } });
  assert(bot, "No hay Bot");
  const chWA = await prisma.channel.findFirst({ where: { type: "whatsapp_cloud", isActive: true } });
  const chTG = await prisma.channel.findFirst({ where: { type: "telegram", isActive: true } });
  const chWC = await prisma.channel.findFirst({ where: { type: "webchat", isActive: true } });
  return { bot, chWA, chTG, chWC };
}

async function verifyWA_GET(ch: any) {
  const u = new URL(`${BASE}/api/webhooks/whatsapp/${ch.id}`);
  u.searchParams.set("hub.mode","subscribe");
  u.searchParams.set("hub.verify_token", ch.verifyToken || "");
  u.searchParams.set("hub.challenge","12345");
  const r = await fetch(u.toString());
  const t = await r.text();
  assert(r.status === 200 && t.includes("12345"), "WhatsApp GET verify FAIL");
  console.log("✓ WhatsApp GET verify");
}

function signWA(appSecret: string, body: Buffer) {
  const h = "sha256=" + crypto.createHmac("sha256", appSecret).update(body).digest("hex");
  return h;
}

async function verifyWA_POST_idempotent(ch: any) {
  const msgId = `verif-${Date.now()}`;
  const payload = {
    object: "whatsapp_business_account",
    entry: [{ changes: [{ value: { messages: [{ id: msgId, from: "5490000000000", type: "text", text: { body: "verificacion" } }] } }] }]
  };
  const raw = Buffer.from(JSON.stringify(payload));
  const sig = signWA(ch.appSecret, raw);
  const url = `${BASE}/api/webhooks/whatsapp/${ch.id}`;

  for (let i=0;i<2;i++){
    const r = await fetch(url, { method:"POST", body: raw, headers: { "x-hub-signature-256": sig, "content-type":"application/json" }});
    assert(r.ok, `WhatsApp POST intento ${i+1} FAIL`);
  }
  // Esperar a que el worker persista mensaje (rápido)
  await new Promise(r=>setTimeout(r, 1500));
  const count = await prisma.message.count({ where: { channelId: ch.id, content: "verificacion", role: "user", createdAt: { gte: new Date(Date.now()-60_000) } } });
  assert(count === 1, `Idempotencia WA FAIL (hay ${count} mensajes user con ese texto)`);
  console.log("✓ WhatsApp POST idempotente");
}

async function verifyTG(ch: any) {
  const url = `${BASE}/api/webhooks/telegram/${ch.id}`;
  const payload = { message: { chat: { id: 123456 }, text: "/hola" } };
  const r = await fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "content-type": "application/json" } });
  assert(r.ok, "Telegram webhook FAIL");
  console.log("✓ Telegram POST");
}

async function verifyWC(ch: any) {
  const url = `${BASE}/api/webhooks/webchat/${ch.id}`;
  const r = await fetch(url, { method: "POST", body: JSON.stringify({ text: "hola" }), headers: { "content-type": "application/json" } });
  assert(r.ok, "Webchat webhook FAIL");
  console.log("✓ Webchat POST");
}

async function verifyMetrics() {
  const r = await fetch(`${BASE}/api/metrics`);
  assert(r.ok, "metrics 200 FAIL");
  const txt = await r.text();
  assert(/incoming_total/.test(txt), "metrics no expone contadores");
  console.log("✓ /api/metrics");
}

async function verifyStatus() {
  const r = await fetch(`${BASE}/api/status`);
  assert(r.ok, "status 200 FAIL");
  const j:any = await r.json();
  assert(j.checks && typeof j.ok === "boolean", "status payload inválido");
  console.log("✓ /api/status payload");
}

(async () => {
  await verifyStatus();
  await pingLLM();
  const { chWA, chTG, chWC } = await getActiveStuff();

  if (chWA) {
    await verifyWA_GET(chWA);
    await verifyWA_POST_idempotent(chWA);
  } else { console.log("• WA inactivo: salto test WA"); }

  if (chTG) await verifyTG(chTG); else console.log("• TG inactivo: salto test TG");
  if (chWC) await verifyWC(chWC); else console.log("• Webchat inactivo: salto test Webchat");

  await verifyMetrics();
  console.log("✅ runtime OK");
  process.exit(0);
})().catch(err => {
  console.error("❌ VERIFICACIÓN FALLÓ:", err.message);
  process.exit(1);
});
