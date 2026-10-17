const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '**.supabase.co'

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.gatherflix.app' }],
        destination: 'https://gatherflix.app/:path*',
        permanent: true,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [40, 55, 70, 75],
    deviceSizes: [640, 720, 828, 1080, 1200, 1440, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
