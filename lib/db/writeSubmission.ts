import { supabase } from "@/lib/supabase"

function scoreToLetterGrade(score: number): string {
  if (score >= 97) return "A+"
  if (score >= 93) return "A"
  if (score >= 90) return "A-"
  if (score >= 87) return "B+"
  if (score >= 83) return "B"
  if (score >= 80) return "B-"
  if (score >= 77) return "C+"
  if (score >= 73) return "C"
  if (score >= 70) return "C-"
  if (score >= 60) return "D"
  return "F"
}

interface WriteSubmissionParams {
  userId: string
  type: "essay" | "coding" | "maths"
  title: string
  content: string
  score: number
  letterGrade?: string
  summary?: string
  strengths?: unknown[]
  improvements?: unknown[]
  annotations?: unknown[]
  weakTopics?: string[]
  practiceRecommendations?: unknown[]
  model?: string
}

export async function writeSubmission(params: WriteSubmissionParams): Promise<void> {
  const { data: sub, error: subErr } = await supabase
    .from("submissions")
    .insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      content: params.content,
      status: "reviewed",
    })
    .select("id")
    .single()

  if (subErr || !sub) {
    throw new Error(subErr?.message ?? "Failed to save submission")
  }

  const { error: fbErr } = await supabase.from("feedback").insert({
    submission_id: sub.id,
    user_id: params.userId,
    overall_score: params.score,
    letter_grade: params.letterGrade ?? scoreToLetterGrade(params.score),
    summary: params.summary ?? "",
    strengths: params.strengths ?? [],
    improvements: params.improvements ?? [],
    annotations: params.annotations ?? [],
    weak_topics: params.weakTopics ?? [],
    practice_recommendations: params.practiceRecommendations ?? [],
    model: params.model ?? "llama-3.3-70b-versatile",
  })

  if (fbErr) {
    await supabase.from("submissions").delete().eq("id", sub.id)
    throw new Error(fbErr.message)
  }
}
