"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { LoginPage } from "@/components/auth/login-page"
import { RegisterPage } from "@/components/auth/register-page"

type Screen = "login" | "register"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Wrap any page that requires authentication.
 * - Not ready yet → shows nothing (avoids flash).
 * - Not logged in → shows Login / Register screen.
 * - Logged in → renders children.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isReady } = useAuth()
  const [screen, setScreen] = useState<Screen>("login")

  if (!isReady) return null

  if (!user) {
    if (screen === "register") {
      return (
        <RegisterPage onSwitchToLogin={() => setScreen("login")} />
      )
    }
    return (
      <LoginPage onSwitchToRegister={() => setScreen("register")} />
    )
  }

  return <>{children}</>
}
