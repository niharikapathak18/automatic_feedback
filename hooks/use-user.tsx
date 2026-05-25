"use client"

import { useEffect, useMemo, useState } from "react"
import { getUserProfile, USER_STORAGE_KEY } from "@/lib/mock-users"
import type { UserProfile } from "@/lib/mock-users"

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      setUserId(stored)
    }
    setIsReady(true)
  }, [])

  const user = useMemo<UserProfile | null>(() => {
    if (!userId) return null
    return getUserProfile(userId)
  }, [userId])

  const login = (id: string) => {
    window.localStorage.setItem(USER_STORAGE_KEY, id)
    setUserId(id)
  }

  const logout = () => {
    window.localStorage.removeItem(USER_STORAGE_KEY)
    setUserId(null)
  }

  return { user, userId, isReady, login, logout }
}
