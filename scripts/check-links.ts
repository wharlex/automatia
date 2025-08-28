// Crawler simple: detecta 404/5xx en links internos (a, img, script, link)
// Ejecutar con: BASE_URL=https://automatia.ar tsx scripts/check-links.ts
import fetch from "node-fetch";
import * as cheerio from "cheerio";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const origin = new URL(BASE).origin;
const seen = new Set<string>();
const bad: string[] = [];

async function headOrGet(url:string){
  let r = await fetch(url, { method: "HEAD" }).catch(()=>null);
  if (!r || !r.ok) r = await fetch(url).catch(()=>null);
  return r;
}
async function crawl(path = "/") {
  const url = new URL(path, origin).toString();
  if (seen.has(url)) return; seen.add(url);
  const res = await fetch(url).catch(()=>null);
  if (!res || !res.ok) { bad.push(`${res?.status||'ERR'} ${url}`); return; }
  const html = await res.text();
  const $ = cheerio.load(html);
  const urls = new Set<string>();
  $("a[href],link[href],script[src],img[src]").each((_,el)=>{
    const attr = $(el).attr("href") || $(el).attr("src"); if (!attr) return;
    const u = new URL(attr, origin);
    if (u.origin === origin) urls.add(u.toString());
  });
  for (const u of urls) {
    const r = await headOrGet(u);
    if (!r || !r.ok) bad.push(`${r?.status||'ERR'} ${u}`);
    if (u.startsWith(origin) && r?.headers.get("content-type")?.includes("text/html")) {
      await crawl(u);
    }
  }
}
crawl("/").then(()=>{
  if (bad.length) { console.error("❌ Links rotos:\n" + bad.join("\n")); process.exit(1); }
  console.log("✓ Sin enlaces rotos"); process.exit(0);
});
