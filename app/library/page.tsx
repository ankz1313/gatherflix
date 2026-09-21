import type { Metadata } from 'next'
import { SiteFooter } from '@/components/site-footer'
import { LibraryBrowse } from '@/components/library/library-browse'

export const metadata: Metadata = {
  title: 'Explore Trivia Packs — Bollywood, Hollywood, TV & Sports · GatherFlix',
  description:
    'Browse published trivia decks for Bollywood cinema, Hollywood, TV series, and sports. Pick a pack and host a live trivia night.',
  alternates: { canonical: '/library' },
}

export default function LibraryPage() {
  return (
    <>
      <LibraryBrowse />
      <SiteFooter />
    </>
  )
}
