import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/contact/contact-form'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Contact Us · GatherFlix',
  description: 'Send GatherFlix feedback, bug reports, and ideas. We read every note.',
}

export default function ContactPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="relative flex flex-1 flex-col items-center px-6 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(120% 80% at 50% 0%, var(--brand-soft) 0%, transparent 55%)',
          }}
        />
        <div className="w-full max-w-lg">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-brand">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground">
            Tell us what you think
          </h1>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground text-pretty">
            Bugs, ideas, packing-the-room stories — drop them here. We will get back to you from
            GatherFlix; there is no public inbox to copy.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <ContactForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              &larr; Back to home
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
