"use client"

import { SessionProvider } from "next-auth/react"
import { QueryProvider } from "@/lib/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionExpiredModal } from "@/components/session-expired-modal"
import { useSessionMonitor } from "@/hooks/use-session-monitor"

function SessionMonitor() {
  const { isExpired, dismissModal } = useSessionMonitor()

  return (
    <SessionExpiredModal
      isOpen={isExpired}
      onClose={dismissModal}
    />
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <Toaster />
        <SessionMonitor />
      </QueryProvider>
    </SessionProvider>
  )
}