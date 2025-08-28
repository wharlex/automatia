export interface User {
  uid: string
  name: string
  email: string
  emailVerified: boolean
  photoURL?: string
  plan: "trial" | "starter" | "pro" | "enterprise"
  createdAt: Date
}

export interface Module {
  id: string
  accountId: string
  type: "chatbot" | "generator" | "onboarding-bot" | "cold-outreach" | "crm-lite"
  name: string
  status: "active" | "needs-config" | "paused"
  createdAt: Date
  settings: Record<string, any>
  metrics: {
    messages24h?: number
    satisfaction?: number
    timeSaved?: number
  }
}

export interface KpiMetric {
  label: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "stable"
}

export interface Integration {
  id: string
  name: string
  status: "connected" | "disconnected" | "error"
  icon: string
  description: string
}

export type UserRole = "owner" | "admin" | "viewer"

export interface AutomatiaUser {
  uid: string
  email: string
  displayName: string
  photoURL: string
  emailVerified: boolean
  createdAt: Date
}

export interface Account {
  id: string
  name: string
  ownerUid: string
  members: Array<{ uid: string; role: UserRole }>
  createdAt: Date
}

export interface Bot {
  id: string
  accountId: string
  ownerUid: string
  name: string
  status: "implementing" | "testing" | "active"
  tone: "formal" | "cercano" | "vendedor"
  brandColor?: string
  createdAt: Date
  updatedAt: Date
}

export interface BotInfo {
  botId: string
  horarios?: string
  precios?: string
  zonasEnvio?: string
  metodosPago?: string[]
  faqs?: Array<{ q: string; a: string }>
  prohibidos?: string
  updatedAt: Date
}

export interface Lead {
  id: string
  botId: string
  accountId: string
  name: string
  contact: string
  notes?: string[]
  channel?: "web" | "ig" | "wa" | "dashboard"
  createdAt: Date
}

export interface ActivityLog {
  id: string
  accountId: string
  actorUid: string
  action: string
  target: string
  meta?: any
  createdAt: Date
}
