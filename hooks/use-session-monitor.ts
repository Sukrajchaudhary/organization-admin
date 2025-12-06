"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { sessionExpiredEmitter } from "@/lib/session-events"

export function useSessionMonitor() {
  const { data: session, status } = useSession()
  const [isExpired, setIsExpired] = useState(false)

  const checkSessionExpiration = useCallback(() => {
    if (session?.user?.expiresAt) {
      const expiresAt = new Date(session.user.expiresAt)
      const now = new Date()

      if (now >= expiresAt) {
        setIsExpired(true)
        return true
      }
    }
    return false
  }, [session])

  const handleSessionExpired = useCallback(async () => {
    setIsExpired(true)
    // Sign out to clear the session
    await signOut({ callbackUrl: "/login" })
  }, [])

  const dismissModal = useCallback(() => {
    setIsExpired(false)
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check immediately
      checkSessionExpiration()
      // Set up periodic check every minute
      const interval = setInterval(() => {
        checkSessionExpiration()
      }, 60000) // 1 minute
      return () => clearInterval(interval)
    }
  }, [session, status, checkSessionExpiration])
  // Listen for session expired events from API calls
  useEffect(() => {
    const unsubscribe = sessionExpiredEmitter.subscribe(() => {
      setIsExpired(true)
    })
    return unsubscribe
  }, [])

  return {
    isExpired,
    dismissModal,
    handleSessionExpired,
    isAuthenticated: status === "authenticated"
  }
}