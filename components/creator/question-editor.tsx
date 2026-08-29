'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DRAFT_QUESTIONS, type DraftQuestion } from '@/lib/creator'

function blank(): DraftQuestion {
  return {
    prompt: '',
    choices: [
      { label: 'A', text: '' },
      { label: 'B', text: '' },
    ],
    correctIndex: 0,
    timer: 20,
    points: 250,
  }
}

export function QuestionEditor() {
  const router = useRouter()
  const [questions, setQuestions] = useState<DraftQuestion[]>(DRAFT_QUESTIONS)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = questions[activeIndex]

  function update(patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q, i) => (i === activeIndex ? { ...q, ...patch } : q)))
  }

  function updateChoice(i: number, text: string) {
    update({ choices: active.choices.map((c, idx) => (idx === i ? { ...c, text } : c)) })
  }

  function addChoice() {
    if (active.choices.length >= 4) return
    const label = String.fromCharCode(65 + active.choices.length)
    update({ choices: [...active.choices, { label, text: '' }] })
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, blank()])
    setActiveIndex(questions.length)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* Left: question list */}
      <aside className="flex flex-col rounded-3xl border border-border bg-card/50 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-black">Questions ({questions.length})</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="rounded-lg border border-brand px-3 py-1 font-display text-xs font-bold text-brand transition-colors hover:bg-brand-soft"
          >
            + Add
          </button>
        </div>

        <ol className="mt-4 space-y-2.5">
          {questions.map((q, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  i === activeIndex
                    ? 'border-gold bg-gold-soft'
                    : 'border-border bg-background/50 hover:bg-accent'
                }`}
              >
                <span
                  className={`font-display text-sm font-black ${
                    i === activeIndex ? 'text-gold' : 'text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="line-clamp-1 flex-1 text-sm font-semibold">
                  {q.prompt || 'Untitled question'}
                </span>
                <span aria-hidden="true" className="text-sm">
                  {i === activeIndex ? '\u26A1' : '\u2297'}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-black uppercase tracking-wide text-brand">
              Step 2 of 3
            </span>
            <span className="font-display text-sm font-bold">Add Questions</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-2/3 rounded-full bg-brand" />
          </div>
        </div>
      </aside>

      {/* Right: editor */}
      <div className="rounded-[2rem] border border-border bg-card/50 p-7 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-black">Editing Question #{activeIndex + 1}</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Timer:</span>
              <span className="font-display font-bold">{active.timer}s</span>
              <span className="text-muted-foreground">{'\u25BE'}</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Points:</span>
              <span className="font-display font-bold text-gold">{active.points} XP</span>
              <span className="text-muted-foreground">{'\u25BE'}</span>
            </span>
          </div>
        </div>

        {/* Question text */}
        <div className="mt-7">
          <label htmlFor="q-text" className="text-sm font-semibold text-muted-foreground">
            Question Text
          </label>
          <input
            id="q-text"
            type="text"
            value={active.prompt}
            onChange={(e) => update({ prompt: e.target.value })}
            placeholder="Type your question here..."
            className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3.5 font-display text-lg font-bold outline-none placeholder:font-normal placeholder:text-muted-foreground/60 focus:border-brand"
          />
        </div>

        {/* Media dropzone */}
        <div className="mt-6 grid place-items-center rounded-2xl border border-border bg-background/40 px-6 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-lg border-2 border-brand text-2xl text-brand">
            {'\u{1F39E}\uFE0F'}
          </span>
          <p className="mt-4 font-display font-bold">Drag &amp; Drop a movie poster, GIF, or audio track</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Recommended: 16:9 cinematic aspect ratio (.mp4, .png, .jpeg max 10MB)
          </p>
        </div>

        {/* Answer choices */}
        <p className="mt-7 text-sm font-semibold text-muted-foreground">
          Answer Choices (Mark the correct gold icon)
        </p>
        <div className="mt-3 space-y-3">
          {active.choices.map((choice, i) => {
            const isCorrect = active.correctIndex === i
            return (
              <div
                key={i}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-4 ${
                  isCorrect ? 'border-gold bg-gold-soft' : 'border-border bg-background/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => update({ correctIndex: i })}
                  aria-label={`Mark ${choice.label} correct`}
                  className={`grid size-8 shrink-0 place-items-center rounded-full border-2 font-display text-sm font-black transition-colors ${
                    isCorrect ? 'border-gold text-gold' : 'border-border text-muted-foreground'
                  }`}
                >
                  {isCorrect ? (
                    <svg viewBox="0 0 24 24" fill="none" className="size-4 text-gold">
                      <path
                        d="M12 2a10 10 0 1 0 10 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="m8 12 3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    choice.label
                  )}
                </button>
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) => updateChoice(i, e.target.value)}
                  placeholder={`Option ${choice.label}`}
                  className={`flex-1 bg-transparent py-1 outline-none placeholder:text-muted-foreground/60 ${
                    isCorrect ? 'font-display font-bold text-gold' : 'text-foreground'
                  }`}
                />
                {isCorrect && (
                  <span className="font-display text-xs font-black uppercase tracking-wide text-gold">
                    Correct Answer
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Nav */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              className="rounded-full border border-border bg-background/60 px-5 py-3 font-display text-sm font-bold transition-colors hover:bg-accent"
            >
              Previous Question
            </button>
            <button
              type="button"
              onClick={addChoice}
              className="rounded-full border border-border bg-background/60 px-5 py-3 font-display text-sm font-bold transition-colors hover:bg-accent"
            >
              + Add New Choice
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-border bg-background/60 px-5 py-3 font-display text-sm font-bold transition-colors hover:bg-accent"
            >
              Preview Slide
            </button>
            <button
              type="button"
              onClick={() => router.push('/create/review')}
              className="rounded-full bg-gold px-7 py-3 font-display text-sm font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02]"
            >
              Save &amp; Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
