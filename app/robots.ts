import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/play',
          '/play/',
          '/results',
          '/results/',
          '/auth/',
          '/login',
          '/create',
          '/create/',
          '/host/room',
          '/join/lobby',
          '/join/nickname',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
