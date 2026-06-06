import { generatePractice } from "@/lib/groq"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { topic, difficulty, type } = await req.json()
    const object = await generatePractice(topic, difficulty, type)
    return Response.json(object)
  } catch (err) {
    console.error("[Practice API Error]:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to generate practice problem" },
      { status: 500 }
    )
  }
}
