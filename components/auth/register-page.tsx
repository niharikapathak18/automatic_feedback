"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Loader2, UserPlus } from "lucide-react"

interface RegisterPageProps {
  onSwitchToLogin: () => void
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { register } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    const result = await register(name.trim(), email, password)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      // Auto-redirect to login after a beat
      setTimeout(onSwitchToLogin, 1800)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success text-2xl">
              ✓
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground">Account created!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirecting you to sign in…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Start tracking your progress today
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="reg-password">
              Password{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (min 6 characters)
              </span>
            </label>
            <input
              id="reg-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
