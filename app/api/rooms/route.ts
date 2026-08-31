import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function sixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST /api/rooms — create a room for a published quiz with a unique 6-digit code.
export async function POST(request: Request) {
  let body: { quizId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const quizId = body.quizId?.trim()
  if (!quizId) {
    return NextResponse.json({ error: 'A quizId is required.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Confirm the quiz exists and is published before creating a room for it.
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title, status')
    .eq('id', quizId)
    .maybeSingle()

  if (quizError) {
    console.error('[v0] POST /api/rooms quiz lookup failed:', quizError)
    return NextResponse.json({ error: 'Failed to create room.' }, { status: 500 })
  }
  if (!quiz || quiz.status !== 'published') {
    return NextResponse.json({ error: 'Quiz not found or not published.' }, { status: 404 })
  }

  // Insert with a fresh code, retrying a few times on the unique constraint.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = sixDigitCode()
    const { data: room, error } = await supabase
      .from('rooms')
      .insert({ code, quiz_id: quizId, status: 'lobby' })
      .select('id, code, quiz_id')
      .single()

    if (!error && room) {
      return NextResponse.json({
        room: { id: room.id, code: room.code, quizId: room.quiz_id },
        quiz: { id: quiz.id, title: quiz.title },
      })
    }

    // 23505 = unique_violation (code already taken) — try another code.
    if (error && error.code !== '23505') {
      console.error('[v0] POST /api/rooms insert failed:', error)
      return NextResponse.json({ error: 'Failed to create room.' }, { status: 500 })
    }
  }

  return NextResponse.json(
    { error: 'Could not generate a unique room code, please retry.' },
    { status: 503 },
  )
}
