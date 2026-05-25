"use client"

import { useState } from "react"
import { X, Send } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"

interface SubmitAssignmentModalProps {
  open: boolean
  onClose: () => void
}

const TYPES = [
  { value: "essay",  label: "Essay Writing" },
  { value: "coding", label: "Coding" },
  { value: "maths",  label: "Maths" },
] as const

export function SubmitAssignmentModal({ open, onClose }: SubmitAssignmentModalProps) {
  const { submitAssignment } = useProgress()

  const [title, setTitle] = useState("")
  const [type, setType] = useState<"essay" | "coding" | "maths">("essay")
  const [score, setScore] = useState("75")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const scoreNum = Math.min(100, Math.max(0, parseInt(score, 10)))
    if (isNaN(scoreNum)) return

    setLoading(true)
    // Simulate brief async (would be API call in production)
    await new Promise((r) => setTimeout(r, 400))
    submitAssignment({ title: title.trim(), type, score: scoreNum })
    setLoading(false)
    setTitle("")
    setScore("75")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">Submit Assignment</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Log a new result to your progress</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Assignment Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Climate Change Essay"
              className="rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Subject</label>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    type === t.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Score{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (0–100)
              </span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="flex-1 accent-primary"
              />
              <span className="w-10 text-right text-lg font-bold text-foreground">
                {score}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all"
          >
            <Send className="h-4 w-4" />
            {loading ? "Submitting…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  )
}
