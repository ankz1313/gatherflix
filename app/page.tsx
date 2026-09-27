import { FeaturedDecks } from '@/components/featured-decks'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SiteJsonLd } from '@/components/site-json-ld'

export const metadata = {
  alternates: { canonical: '/' },
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteJsonLd />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeaturedDecks />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  )
}
