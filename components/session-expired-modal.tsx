"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SessionExpiredModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SessionExpiredModal({ isOpen, onClose }: SessionExpiredModalProps) {
  const router = useRouter()

  const handleLogin = async () => {
    await signOut({ callbackUrl: "/login" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end  gap-2">
          <Button onClick={handleLogin}>
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}