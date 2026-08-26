import { FeaturedDecks } from '@/components/featured-decks'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FeaturedDecks />
      </main>
      <SiteFooter />
    </div>
  )
}
