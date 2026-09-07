import type { Metadata } from 'next'
import { SiteFooter } from '@/components/site-footer'
import { LibraryBrowse } from '@/components/library/library-browse'

export const metadata: Metadata = {
  title: 'Explore Packs — GatherFlix',
  description: 'Browse fan-made trivia decks across Bollywood, Hollywood, TV series, and sports.',
}

export default function LibraryPage() {
  return (
    <>
      <LibraryBrowse />
      <SiteFooter />
    </>
  )
}
