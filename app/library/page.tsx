import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LibraryBrowse } from '@/components/library/library-browse'

export const metadata: Metadata = {
  title: 'Trending Packs — GatherFlix',
  description: 'Browse hundreds of fan-made Bollywood trivia decks. Search by era, mood, or genre.',
}

export default function LibraryPage() {
  return (
    <>
      <SiteHeader />
      <LibraryBrowse />
      <SiteFooter />
    </>
  )
}
