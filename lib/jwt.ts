// JWT utility functions for token generation and verification
const SECRET_KEY = "your-secret-key-change-in-production"

interface JWTPayload {
  id: number
  email: string
  name: string
  iat: number
  exp: number
}

// Simple JWT generation (for demo purposes)
export function generateJWT(payload: Omit<JWTPayload, "iat" | "exp">): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 24 * 60 * 60 // 24 hours

  const tokenPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  }

  const headerEncoded = btoa(JSON.stringify(header))
  const payloadEncoded = btoa(JSON.stringify(tokenPayload))

  // Simple signature (in production, use proper JWT library)
  const signature = btoa(`${headerEncoded}.${payloadEncoded}.${SECRET_KEY}`)

  return `${headerEncoded}.${payloadEncoded}.${signature}`
}

// Verify JWT token
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts

    // Verify signature
    const expectedSignature = btoa(`${headerEncoded}.${payloadEncoded}.${SECRET_KEY}`)
    if (signatureEncoded !== expectedSignature) {
      return null
    }

    // Decode payload
    const payloadStr = atob(payloadEncoded)
    const payload: JWTPayload = JSON.parse(payloadStr)

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

// Decode JWT without verification (for client-side reading)
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    const payloadStr = atob(parts[1])
    return JSON.parse(payloadStr)
  } catch {
    return null
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload) return true

  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}
