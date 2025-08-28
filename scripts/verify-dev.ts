// Verificación rápida para desarrollo local
// Uso: tsx scripts/verify-dev.ts
import fetch from "node-fetch";

const BASE = process.env.BASE_URL || "http://localhost:3004";

function assert(cond: any, msg: string) { 
  if (!cond) throw new Error(msg); 
}

async function checkEndpoint(path: string, expectedStatus = 200) {
  try {
    const r = await fetch(`${BASE}${path}`);
    assert(r.status === expectedStatus, `${path} → ${r.status} (esperado ${expectedStatus})`);
    console.log(`✓ ${path}`);
    return true;
  } catch (error) {
    console.error(`❌ ${path}: ${error.message}`);
    return false;
  }
}

async function checkChatbotTest() {
  try {
    const r = await fetch(`${BASE}/api/chatbot/test`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "hola" })
    });
    
    if (r.ok) {
      const data = await r.json();
      assert(typeof data.reply === "string", "chatbot/test no devuelve reply string");
      console.log("✓ /api/chatbot/test");
      return true;
    } else {
      console.error(`❌ /api/chatbot/test: ${r.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ /api/chatbot/test: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`🔍 Verificando ${BASE}...\n`);
  
  const checks = [
    await checkEndpoint("/api/healthz"),
    await checkEndpoint("/api/readyz"),
    await checkEndpoint("/api/status"),
    await checkChatbotTest()
  ];
  
  const passed = checks.filter(Boolean).length;
  const total = checks.length;
  
  console.log(`\n📊 Resultado: ${passed}/${total} checks pasaron`);
  
  if (passed === total) {
    console.log("✅ Todos los checks pasaron - Sistema funcionando correctamente");
    process.exit(0);
  } else {
    console.log("❌ Algunos checks fallaron - Revisar logs arriba");
    process.exit(1);
  }
}

main().catch(error => {
  console.error("💥 Error fatal:", error.message);
  process.exit(1);
});
