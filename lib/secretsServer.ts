import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-gcm"
// Use a default key for build time, but require real key for runtime
const SECRET_KEY = process.env.APP_SECRET || "0000000000000000000000000000000000000000000000000000000000000000"

export function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, "hex"), iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  const authTag = cipher.getAuthTag()

  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted
}

export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(":")
  const iv = Buffer.from(parts[0], "hex")
  const authTag = Buffer.from(parts[1], "hex")
  const encrypted = parts[2]

  const decipher = createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, "hex"), iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
