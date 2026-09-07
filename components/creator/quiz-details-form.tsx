'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveQuizDetails } from '@/app/create/actions'
import { ImageUpload } from '@/components/creator/image-upload'
import { QUIZ_CATEGORIES } from '@/lib/categories'

const DIFFICULTIES = [
  { label: 'Easy (Freshman)', value: 'Easy', dot: 'var(--success)' },
  { label: 'Medium (Box Office)', value: 'Medium', dot: 'var(--gold)' },
  { label: 'Hard (Director Cut)', value: 'Hard', dot: 'var(--brand)' },
]

export type QuizDetailsInitial = {
  quizId: string
  title: string
  description: string
  category: string | null
  subtags: string[]
  difficulty: string
  coverImageUrl: string | null
}

export function QuizDetailsForm({ initial }: { initial?: QuizDetailsInitial }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(() => {
    const idx = QUIZ_CATEGORIES.findIndex((c) => c.value === initial?.category)
    return idx >= 0 ? idx : 0
  })
  const [difficulty, setDifficulty] = useState(() => {
    const idx = DIFFICULTIES.findIndex((d) => d.value === initial?.difficulty)
    return idx >= 0 ? idx : 1
  })
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initial?.coverImageUrl ?? null)

  function handleNext() {
    setError('')
    if (!title.trim()) {
      setError('Please enter a quiz title before continuing.')
      return
    }
    startTransition(async () => {
      const result = await saveQuizDetails({
        quizId: initial?.quizId,
        title,
        description,
        category: QUIZ_CATEGORIES[category].value,
        subtags: initial?.subtags ?? [],
        difficulty: DIFFICULTIES[difficulty].value,
        coverImageUrl,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.push(`/create/questions?quiz=${result.quizId}`)
    })
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[300px_1fr]">
      {/* Left rail */}
      <aside>
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-black uppercase tracking-wide text-brand">
            Step 1 of 3
          </span>
          <span className="font-display text-sm font-bold">Quiz Settings</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/3 rounded-full bg-brand" />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="font-display text-lg font-black text-gold">Lights, Camera, Action!</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every pack starts with a clear title, a category so players can find it, and a
            color-coded difficulty.
          </p>
          <p className="mt-4 text-sm font-semibold text-brand">
            Tip: Mix easy and spicy questions to keep the pacing exciting!
          </p>
        </div>
      </aside>

      {/* Right card */}
      <div className="rounded-[2rem] border border-border bg-card/50 p-7 sm:p-10">
        <h1 className="font-display text-3xl font-black tracking-tight">Quiz Overview Details</h1>

        <div className="mt-8 space-y-7">
          {/* Title */}
          <div>
            <label htmlFor="q-title" className="font-display text-sm font-bold">
              Quiz Title
            </label>
            <input
              id="q-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ultimate Shah Rukh Khan Mega Fan Quiz"
              className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3.5 outline-none placeholder:text-muted-foreground/70 focus:border-brand"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="q-desc" className="font-display text-sm font-bold">
              Description
            </label>
            <textarea
              id="q-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description to hook your players. What cinematic surprises do you have in store?"
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3.5 outline-none placeholder:text-muted-foreground/70 focus:border-brand"
            />
          </div>

          {/* Cover image */}
          <div>
            <span className="font-display text-sm font-bold">Cover Image</span>
            <p className="mt-1 text-xs text-muted-foreground">
              Shown on your quiz card and the public library.
            </p>
            <div className="mt-2">
              <ImageUpload
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                label="Drag & drop or click to add a cover image"
                hint={'16:9 works best \u00B7 PNG, JPEG, GIF, WEBP \u00B7 max 10MB'}
              />
            </div>
          </div>

          {/* Primary category */}
          <div>
            <span className="font-display text-sm font-bold">Primary Category</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {QUIZ_CATEGORIES.map((c, i) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(i)}
                  className={`rounded-xl border px-5 py-3 font-display text-sm font-bold transition-colors ${
                    category === i
                      ? 'border-brand bg-brand-soft text-brand'
                      : 'border-border bg-background/60 text-foreground hover:bg-accent'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <span className="font-display text-sm font-bold">Quiz Difficulty</span>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {DIFFICULTIES.map((d, i) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => setDifficulty(i)}
                  className={`flex items-center gap-2.5 rounded-xl border px-5 py-3.5 font-display text-sm font-bold transition-colors ${
                    difficulty === i
                      ? 'border-gold bg-gold-soft text-foreground'
                      : 'border-border bg-background/60 text-foreground hover:bg-accent'
                  }`}
                >
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: d.dot }} />
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nav */}
        {error && (
          <p className="mt-6 rounded-xl border border-brand/40 bg-brand/5 px-4 py-3 text-sm font-semibold text-brand">
            {error}
          </p>
        )}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/create"
            className="font-display text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            Cancel Quiz Creation
          </Link>
          <button
            type="button"
            onClick={handleNext}
            disabled={pending}
            className="rounded-full bg-gold px-8 py-3.5 font-display text-sm font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Saving\u2026' : initial ? 'Save & Edit Questions' : 'Next: Add Questions'}
          </button>
        </div>
      </div>
    </main>
  )
}
