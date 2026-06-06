"use client"

import { supabase } from "@/lib/supabase"
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
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const supabaseUser = session?.user
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? "",
          name: (supabaseUser.user_metadata?.name as string) ?? "",
          createdAt: supabaseUser.created_at,
        })
      }

      setIsReady(true)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user

      if (!authUser) {
        setUser(null)
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        name: (authUser.user_metadata?.name as string) ?? "",
        createdAt: authUser.created_at,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ error?: string }> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    },
    []
  )

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ error?: string }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    },
    []
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isReady,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>")
  }

  return ctx
}