import { GatherflixLogo } from '@/components/gatherflix-logo'
import { ShareActions } from '@/components/share-actions'
import { SITE_TITLE, SITE_URL } from '@/lib/site'

const FOOTER_LINKS = [
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Trending Packs', href: '/library' },
  { label: 'Host a Room', href: '/host' },
  { label: 'Contact Us', href: '/contact' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-8 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <GatherflixLogo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Free to play on your phones. No app download. Hosts sign in to start a room.
          </p>
          <div className="mt-5">
            <ShareActions
              url={SITE_URL}
              text={SITE_TITLE}
            />
          </div>
        </div>

        <nav className="flex flex-col gap-3 sm:items-end" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="container-page border-t border-border py-6">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} GatherFlix. All rights reserved.</p>
      </div>
    </footer>
  )
}
