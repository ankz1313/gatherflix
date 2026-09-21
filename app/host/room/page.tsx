import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RoomCreated } from '@/components/host/room-created'
import { HostTopbar } from '@/components/host/host-topbar'
import { getDeck } from '@/lib/decks'
import { getQuizWithQuestions, getPublishedQuizIdByTitle } from '@/lib/quiz-data'
import { createServerSupabase } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Host a Room · Go Live — GatherFlix',
  description: 'Your room is live. Share the code or QR and start the game.',
  robots: { index: false, follow: false },
}

export default async function HostRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ quiz?: string; deck?: string }>
}) {
  const { quiz: quizId, deck: slug } = await searchParams

  // Hosting a live room requires an account. Send guests to sign in and bring
  // them right back to this quiz once authenticated.
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const params = new URLSearchParams()
    if (quizId) params.set('quiz', quizId)
    if (slug) params.set('deck', slug)
    const query = params.toString()
    const from = query ? `/host/room?${query}` : '/host/room'
    redirect(`/login?redirectedFrom=${encodeURIComponent(from)}`)
  }

  let id = quizId
  if (!id && slug) {
    id = (await getPublishedQuizIdByTitle(getDeck(slug).title)) ?? undefined
  }
  const quiz = id ? await getQuizWithQuestions(id) : null

  if (!quiz) {
    return (
      <>
        <HostTopbar active="library" />
        <main className="container-page flex flex-col items-center gap-4 py-24 text-center">
          <h1 className="font-display text-3xl font-extrabold">Quiz not found</h1>
          <p className="max-w-sm text-muted-foreground">
            Pick a quiz pack from the library to host a live room.
          </p>
          <Link
            href="/library"
            className="rounded-full bg-gold px-6 py-3 font-display font-bold text-gold-foreground"
          >
            Back to Library
          </Link>
        </main>
      </>
    )
  }

  return <RoomCreated quizId={quiz.id} quizTitle={quiz.title} />
}
