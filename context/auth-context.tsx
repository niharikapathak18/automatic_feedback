"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"



export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthContextValue {
  user: User | null
  isReady: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ error?: string }>
  logout: () => void
}



const USERS_KEY = "app:users"
const SESSION_KEY = "app:session"

function getUsers(): Record<string, { user: User; passwordHash: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}")
  } catch {
    return {}
  }
}

/** Very simple hash — fine for a local demo; swap for bcrypt on a real backend */
async function simpleHash(value: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  )
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}



const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Rehydrate session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) {
        const saved: User = JSON.parse(raw)
        setUser(saved)
      }
    } catch {
      // ignore
    } finally {
      setIsReady(true)
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const users = getUsers()
      const key = email.toLowerCase()
      const entry = users[key]

      if (!entry) return { error: "No account found with that email." }

      const hash = await simpleHash(password)
      if (hash !== entry.passwordHash)
        return { error: "Incorrect password." }

      setUser(entry.user)
      localStorage.setItem(SESSION_KEY, JSON.stringify(entry.user))
      return {}
    },
    []
  )

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ error?: string }> => {
      const users = getUsers()
      const key = email.toLowerCase()

      if (users[key]) return { error: "An account with that email already exists." }

      const newUser: User = {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        name,
        createdAt: new Date().toISOString(),
      }

      const hash = await simpleHash(password)
      users[key] = { user: newUser, passwordHash: hash }
      localStorage.setItem(USERS_KEY, JSON.stringify(users))

      return {}
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
