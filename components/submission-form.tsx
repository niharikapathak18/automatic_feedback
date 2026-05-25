"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FeedbackDisplay } from "@/components/feedback-display"
import { useProgress } from "@/hooks/use-progress"
import {
  FileText,
  Code,
  Calculator,
  Sparkles,
  Loader2,
  RotateCcw,
} from "lucide-react"

const assignmentTypes = [
  {
    id: "essay",
    label: "Essay",
    icon: FileText,
    placeholder:
      "Paste your essay here...\n\nExample: In today's world, climate change represents one of the most pressing challenges facing humanity...",
  },
  {
    id: "coding",
    label: "Coding",
    icon: Code,
    placeholder:
      'Paste your code here...\n\nExample:\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    ...\n  }\n}',
  },
  {
    id: "maths",
    label: "Maths",
    icon: Calculator,
    placeholder:
      "Paste your math work here...\n\nExample:\nProblem: Find the integral of x^2 * e^x dx\n\nSolution:\nUsing integration by parts...\nLet u = x^2, dv = e^x dx...",
  },
]

interface FeedbackData {
  overallScore?: number
  summary?: string
  strengths?: { title: string; description: string }[]
  improvements?: { title: string; description: string; severity: string }[]
  annotations?: {
    text: string
    issue: string
    suggestion: string
    category: string
  }[]
  weakTopics?: string[]
  practiceRecommendations?: {
    topic: string
    description: string
    difficulty: string
  }[]
  letterGrade?: string
}

export function SubmissionForm() {
  const [selectedType, setSelectedType] = useState("essay")
  const [content, setContent] = useState("")
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { submitAssignment } = useProgress()

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) return
    setIsLoading(true)
    setFeedback(null)
    setError(null)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type: selectedType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to get feedback")
      }

      if (data?.error) {
        throw new Error(data.error)
      }

      setFeedback(data)
      submitAssignment({
        type: selectedType as "essay" | "coding" | "maths",
        title: `${selectedType} submission`,
        score: data?.overallScore ?? 75,
      })

    } catch (err) {
      console.error("Feedback error:", err)
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again!"
      )
    } finally {
      setIsLoading(false)
    }
  }, [content, selectedType])

  const handleReset = () => {
    setContent("")
    setFeedback(null)
    setError(null)
    setIsLoading(false)
  }

  const selectedConfig = assignmentTypes.find((t) => t.id === selectedType)!

  return (
    <div className="flex flex-col gap-8">
      {/* Type selector */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">
          Assignment Type
        </label>
        <div className="flex flex-wrap gap-3">
          {assignmentTypes.map((type) => {
            const isActive = selectedType === type.id
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground glow-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                <type.icon className="h-4 w-4" />
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Text input */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">
          Your Work
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={selectedConfig.placeholder}
          className="min-h-[240px] rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 resize-y font-mono text-sm leading-relaxed"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length > 0
              ? `${content.split(/\s+/).filter(Boolean).length} words`
              : "Paste or type your assignment above"}
          </span>
          <div className="flex gap-2">
            {(content || feedback) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="rounded-xl text-muted-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Get Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-[140px] w-[140px] rounded-full bg-secondary animate-pulse shrink-0" />
              <div className="flex-1 flex flex-col gap-3">
                <div className="h-6 w-48 rounded-lg bg-secondary animate-pulse" />
                <div className="h-4 w-full rounded-lg bg-secondary animate-pulse" />
                <div className="h-4 w-3/4 rounded-lg bg-secondary animate-pulse" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="h-5 w-32 rounded-lg bg-secondary animate-pulse mb-4" />
              <div className="flex flex-col gap-3">
                <div className="h-20 rounded-xl bg-secondary animate-pulse" />
                <div className="h-20 rounded-xl bg-secondary animate-pulse" />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="h-5 w-32 rounded-lg bg-secondary animate-pulse mb-4" />
              <div className="flex flex-col gap-3">
                <div className="h-20 rounded-xl bg-secondary animate-pulse" />
                <div className="h-20 rounded-xl bg-secondary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback results */}
      {feedback && <FeedbackDisplay data={feedback} />}
    </div>
  )
}
