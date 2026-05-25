"use client"

import { Button } from "@/components/ui/button"

const userOptions = [
  { id: "alice", label: "Alice" },
  { id: "mohit", label: "Mohit" },
]

export function LoginPanel({ onLogin }: { onLogin: (id: string) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a profile below to view your personalized progress dashboard.
          </p>
        </div>

        <div className="space-y-3">
          {userOptions.map((option) => (
            <Button
              key={option.id}
              className="w-full"
              onClick={() => onLogin(option.id)}
            >
              Continue as {option.label}
            </Button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
          This is a mock login flow. The selected profile determines which graph and progress data you see.
        </div>
      </div>
    </div>
  )
}
