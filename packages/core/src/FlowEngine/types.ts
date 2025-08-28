export type FlowConfig = {
  version: "1.0";
  providers: {
    default: { kind: "GPT" | "GEMINI"; model: string; apiKeyRef: string };
  };
  steps: Array<
    | { id: string; type: "receive"; channel: "whatsapp"; parse: { text: boolean; media: boolean } }
    | { id: string; type: "guard"; checks: Array<"membership-approved" | "bot-activated" | "email-allowlist"> }
    | { id: string; type: "classify-intent"; labels: string[] }
    | { 
        id: string; 
        type: "datasource-query"; // leer tablas subidas por el user
        mode: "table" | "rag";
        datasourceId: string; // FILE/URL/DOCS
        // para 'table': filtros simples
        tableQuery?: { 
          where?: Record<string, string | number | boolean>; 
          limit?: number; 
          orderBy?: string 
        };
        // para 'rag':
        rag?: { topK: number };
        saveAs?: string; // variable para guardar resultado
      }
    | { 
        id: string; 
        type: "call-llm"; 
        providerRef: "default"; 
        system: string; 
        template: string; 
        saveAs?: string 
      }
    | { 
        id: string; 
        type: "branch"; 
        on: "intent" | "var"; 
        cases: Record<string, string /* next step id */>; 
        default?: string 
      }
    | { 
        id: string; 
        type: "send"; 
        channel: "whatsapp"; 
        format: "text" | "template"; 
        templateId?: string; 
        fromVar?: string 
      }
    | { 
        id: string; 
        type: "memory"; 
        op: "append" | "upsert"; 
        key: string; 
        fromVar?: string 
      }
    | { id: string; type: "delay"; ms: number }
    | { 
        id: string; 
        type: "http"; 
        method: "GET" | "POST"; 
        url: string; 
        headers?: Record<string,string>; 
        body?: any; 
        saveAs?: string 
      }
  >;
  start: string; // id del primer step, típico: receive -> guard -> classify...
};

export type FlowContext = {
  botId: string;
  userId?: string;
  userEmail?: string;
  workspaceId: string;
  variables: Record<string, any>;
  intent?: string;
  message: string;
  channel: "whatsapp" | "telegram" | "webchat";
  metadata: Record<string, any>;
};

export type FlowStep = {
  id: string;
  type: string;
  config: any;
};

export type FlowResult = {
  success: boolean;
  nextStep?: string;
  response?: string;
  variables?: Record<string, any>;
  error?: string;
};

export type GuardResult = {
  allowed: boolean;
  reason?: string;
  nextStep?: string;
};

export type DatasourceQueryResult = {
  success: boolean;
  data?: any[];
  error?: string;
  count?: number;
};

export type LLMResult = {
  success: boolean;
  response?: string;
  error?: string;
  usage?: {
    tokens: number;
    cost: number;
  };
};
