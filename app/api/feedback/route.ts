import { generateFeedback } from "@/lib/groq"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { content, type } = await req.json()
    if (!content || !type) {
      return Response.json({ error: "content and type are required" }, { status: 400 })
    }
    const feedback = await generateFeedback(content, type)
    return Response.json(feedback)
  } catch (err) {
    console.error("[Feedback API Error]:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to generate feedback" },
      { status: 500 }
    )
  }
}
