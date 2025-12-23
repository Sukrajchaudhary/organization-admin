import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      accessToken?: string
      expiresAt?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    accessToken?: string
    expiresAt?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    accessToken?: string
    expiresAt?: string
    userId?: string
    email?: string
    isExpired?: boolean
  }
}