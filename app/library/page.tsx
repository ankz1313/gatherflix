import type { Metadata } from 'next'
import { SiteFooter } from '@/components/site-footer'
import { LibraryBrowse } from '@/components/library/library-browse'

export const metadata: Metadata = {
  title: 'Explore Trivia Packs — Bollywood, Cricket & TV · GatherFlix',
  description:
    'Browse live trivia decks for Bollywood cinema, Indian cricket, and TV shows. Pick a pack and host a night with friends.',
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
