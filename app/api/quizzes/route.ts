import { NextResponse } from 'next/server'
import { getPublishedQuizzes } from '@/lib/quiz-data'

// GET /api/quizzes — published quizzes for the Library page.
export async function GET() {
  try {
    const quizzes = await getPublishedQuizzes()
    return NextResponse.json({ quizzes })
  } catch (err) {
    console.error('[v0] GET /api/quizzes failed:', err)
    return NextResponse.json({ error: 'Failed to load quizzes.' }, { status: 500 })
  }
}
