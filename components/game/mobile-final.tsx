'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { lastAnswerStorageKey, type QuestionResult } from '@/lib/score'

function ordinal(place: number) {
  return place === 1 ? '1st' : place === 2 ? '2nd' : place === 3 ? '3rd' : `${place}th`
}

export function MobileFinal({ code }: { code: string }) {
  const [me, setMe] = useState<QuestionResult | null>(null)

  useEffect(() => {
    if (!code) return
    const raw = sessionStorage.getItem(lastAnswerStorageKey(code))
    if (!raw) return
    try {
      setMe(JSON.parse(raw) as QuestionResult)
    } catch {
      setMe(null)
    }
  }, [code])

  const place = me?.rank ?? 0

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pb-8 pt-10">
      <p className="text-center text-sm uppercase tracking-wider text-muted-foreground">
        Your results
      </p>

      <div className="mt-6 flex flex-1 flex-col items-center rounded-[2rem] border border-border bg-card/60 px-7 py-9 text-center">
        <div className="grid size-24 place-items-center rounded-full border-2 border-brand">
          <span className="text-4xl" aria-hidden="true">
            {'\u2728'}
          </span>
        </div>

        <span className="mt-6 rounded-full bg-gold px-5 py-1.5 font-display text-sm font-black uppercase tracking-wide text-gold-foreground">
          {place ? `${ordinal(place)} Place` : 'In the running'}
        </span>

        <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-balance">
          {place ? `You Placed #${place}!` : 'Score saved'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Nice round — keep an eye on the TV for the podium.
        </p>

        <hr className="my-7 w-full border-border" />

        <div className="grid w-full grid-cols-2 divide-x divide-border">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Score
            </p>
            <p className="mt-1 font-display text-4xl font-black text-gold">
              {(me?.totalScore ?? 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Rank
            </p>
            <p className="mt-1 font-display text-4xl font-black text-success">
              {place ? `#${place}` : '—'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-brand/40 px-5 py-3.5">
          <span className="size-2.5 animate-pulse rounded-full bg-brand" />
          <span className="font-semibold text-muted-foreground">Waiting for Host to replay…</span>
        </div>

        <Link
          href="/join"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-gold px-8 py-4 font-display text-lg font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform active:scale-[0.99]"
        >
          Play Again?
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        GatherFlix Party Room: {code || '—'}
      </p>
    </div>
  )
}
