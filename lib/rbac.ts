import type { UserRole } from "./types"

export const canEditBot = (role: UserRole): boolean => {
  return role === "owner" || role === "admin"
}

export const canViewBot = (role: UserRole): boolean => {
  return role === "owner" || role === "admin" || role === "viewer"
}

export const canManageAccount = (role: UserRole): boolean => {
  return role === "owner"
}
