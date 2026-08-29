'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnswerShape } from '@/components/game/answer-shape'
import { ANSWER_STYLES } from '@/lib/game'
import { DRAFT_QUESTIONS, type DraftQuestion } from '@/lib/creator'

const BLANK: DraftQuestion = { prompt: '', options: ['', '', '', ''], correctIndex: 0 }

export function QuestionEditor() {
  const router = useRouter()
  const [questions, setQuestions] = useState<DraftQuestion[]>(DRAFT_QUESTIONS)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = questions[activeIndex]

  function update(patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q, i) => (i === activeIndex ? { ...q, ...patch } : q)))
  }

  function updateOption(optIndex: number, value: string) {
    update({ options: active.options.map((o, i) => (i === optIndex ? value : o)) })
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, { ...BLANK, options: [...BLANK.options] }])
    setActiveIndex(questions.length)
  }

  function removeQuestion(index: number) {
    if (questions.length === 1) return
    setQuestions((qs) => qs.filter((_, i) => i !== index))
    setActiveIndex((cur) => (cur >= index && cur > 0 ? cur - 1 : cur))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Question list */}
      <aside className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            {questions.length} Questions
          </h2>
        </div>
        <ol className="space-y-2">
          {questions.map((q, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  i === activeIndex
                    ? 'border-gold bg-gold-soft'
                    : 'border-border bg-card hover:bg-accent'
                }`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary font-display text-xs font-black">
                  {i + 1}
                </span>
                <span className="line-clamp-1 flex-1 text-sm font-semibold">
                  {q.prompt || 'Untitled question'}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={addQuestion}
          className="w-full rounded-2xl border border-dashed border-border bg-card px-4 py-3 font-display text-sm font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          + Add Question
        </button>
      </aside>

      {/* Editor */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold">Question {activeIndex + 1}</h3>
          <button
            type="button"
            onClick={() => removeQuestion(activeIndex)}
            disabled={questions.length === 1}
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-brand disabled:opacity-40"
          >
            Delete
          </button>
        </div>

        <textarea
          value={active.prompt}
          onChange={(e) => update({ prompt: e.target.value })}
          rows={2}
          placeholder="Type your question here..."
          className="mt-4 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3.5 font-display text-lg font-bold outline-none transition-colors placeholder:font-normal placeholder:text-muted-foreground/60 focus:border-gold"
        />

        <p className="mt-6 font-display text-sm font-bold">
          Answer options{' '}
          <span className="font-normal text-muted-foreground">— tap the circle to mark correct</span>
        </p>
        <div className="mt-3 space-y-3">
          {active.options.map((option, i) => {
            const style = ANSWER_STYLES[i]
            const isCorrect = active.correctIndex === i
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2"
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-xl"
                  style={{ backgroundColor: style.color }}
                >
                  <AnswerShape shape={style.shape} className="size-4 fill-white text-white" />
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-transparent py-1.5 text-foreground outline-none placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => update({ correctIndex: i })}
                  aria-label={`Mark option ${i + 1} correct`}
                  className={`grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                    isCorrect ? 'border-success bg-success text-white' : 'border-border'
                  }`}
                >
                  {isCorrect && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="size-4">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Nav spans both columns */}
      <div className="flex items-center justify-between lg:col-span-2">
        <Link
          href="/create/details"
          className="rounded-full border border-border bg-secondary px-6 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent"
        >
          Back
        </Link>
        <button
          type="button"
          onClick={() => router.push('/create/review')}
          className="rounded-full bg-gold px-8 py-3 font-display text-sm font-bold text-gold-foreground shadow-[0_10px_45px_-16px] shadow-gold/70 transition-transform hover:scale-[1.02]"
        >
          Next: Review
        </button>
      </div>
    </div>
  )
}
