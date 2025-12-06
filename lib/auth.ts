import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getServerSession } from "next-auth"
import { LoginUser } from "@/apiServices/auth/api.authServices"
import { ApiError } from "@/types/api"

export interface User {
  id: string
  name: string
  email: string
  role: string
  accessToken?: string
  expiresAt?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await LoginUser({
            email: credentials.email,
            password: credentials.password
          });

          if (response.success && response.data) {
            // Map API user to NextAuth user format
            const apiUser = response.data;
            return {
              id: apiUser._id,
              name: `${apiUser.firstName} ${apiUser.lastName}`,
              email: apiUser.email,
              role: apiUser.role,
              accessToken: response.token,
              expiresAt: response.expiresAt,
            };
          }
        } catch (error) {
          if (error instanceof ApiError) {
            console.error('API Error details:', {
              message: error.message,
              statusCode: error.statusCode,
              fields: error.fields
            });
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role
        token.accessToken = (user as User).accessToken
        token.expiresAt = (user as User).expiresAt
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken as string
        session.user.expiresAt = token.expiresAt as string
      }
      return session
    }
  }
}

export async function auth() {
  return await getServerSession(authOptions)
}

// Client-side function to get auth token
export async function getAuthToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const session = await response.json();
      
      return session?.user?.accessToken || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}
