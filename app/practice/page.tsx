"use client"

import { AppShell } from "@/components/app-shell"
import { PracticeMode } from "@/components/practice-mode"

export default function PracticePage() {
  return (
    <AppShell>
      <div className="rounded-3xl border bg-gradient-to-r from-primary/20 to-accent/20 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Practice Mode
          </h1>
          <p className="text-muted-foreground mt-1">
            Get AI-generated exercises tailored to your weak spots
          </p>
        </div>
        <PracticeMode />
      </div>
    </AppShell>
  )
}
