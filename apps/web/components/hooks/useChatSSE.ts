import { useRef, useState } from "react";
import type { ChatMeta } from "@packages/core/types/chat";

export function useChatSSE() {
  const [meta, setMeta] = useState<ChatMeta | null>(null);
  const [buffer, setBuffer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ctrl = useRef<AbortController | null>(null);

  function start({ body }: { body: any }) {
    if (loading) return;
    
    setLoading(true);
    setBuffer("");
    setError(null);
    ctrl.current = new AbortController();

    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      signal: ctrl.current.signal,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.reason || err?.error || `HTTP ${res.status}`);
      }
      
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buf += decoder.decode(value, { stream: true });
        
        // Parse simple SSE
        const lines = buf.split("\n\n");
        buf = lines.pop() || ""; // Keep incomplete chunk
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          const ev = line.split("\n").reduce((acc, l) => {
            const colonIndex = l.indexOf(":");
            if (colonIndex === -1) return acc;
            
            const k = l.slice(0, colonIndex).trim();
            const v = l.slice(colonIndex + 1).trim();
            
            if (k === "event" || k === "data") {
              (acc as any)[k] = v;
            }
            return acc;
          }, {} as any);
          
          if (ev.event === "delta") {
            try {
              const data = JSON.parse(ev.data);
              setBuffer(prev => prev + data);
            } catch (e) {
              setBuffer(prev => prev + ev.data);
            }
          }
          
          if (ev.event === "meta") {
            try {
              const data = JSON.parse(ev.data);
              setMeta(data);
            } catch (e) {
              console.error("Error parsing meta:", e);
            }
          }
          
          if (ev.event === "error") {
            try {
              const data = JSON.parse(ev.data);
              throw new Error(data.message);
            } catch (e) {
              throw new Error(ev.data || "Unknown error");
            }
          }
          
          if (ev.event === "done") {
            // Flow completed successfully
            break;
          }
        }
      }
    }).catch((e) => {
      if (e.name === 'AbortError') {
        setError("Request cancelled");
      } else {
        setError(e.message);
      }
      console.error("Chat SSE error:", e);
    }).finally(() => {
      setLoading(false);
      ctrl.current = null;
    });
  }

  function cancel() { 
    ctrl.current?.abort(); 
  }

  function reset() {
    setMeta(null);
    setBuffer("");
    setError(null);
    setLoading(false);
    ctrl.current?.abort();
    ctrl.current = null;
  }

  return { 
    meta, 
    buffer, 
    loading, 
    error,
    start, 
    cancel,
    reset
  };
}
