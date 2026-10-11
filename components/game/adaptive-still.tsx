'use client'

import Image from 'next/image'
import { IMAGE_NETWORK_PROFILE, useImageNetworkTier } from '@/lib/network-image'

type AdaptiveStillProps = {
  src: string
  alt?: string
  className?: string
  priority?: boolean
  upcomingSrcs?: string[]
}

export function AdaptiveStill({
  src,
  alt = '',
  className,
  priority = false,
  upcomingSrcs = [],
}: AdaptiveStillProps) {
  const tier = useImageNetworkTier()
  const profile = IMAGE_NETWORK_PROFILE[tier]
  const optimize = tier !== 'fast'
  const prefetch = upcomingSrcs.filter((url) => url.trim() && url !== src).slice(0, 2)

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={profile.width}
        height={Math.round(profile.width * 0.5625)}
        sizes={profile.sizes}
        quality={profile.quality}
        priority={priority}
        unoptimized={!optimize}
        className={className}
      />
      {prefetch.map((url) => (
        <Image
          key={url}
          src={url}
          alt=""
          width={profile.width}
          height={Math.round(profile.width * 0.5625)}
          sizes={profile.sizes}
          quality={profile.quality}
          unoptimized={!optimize}
          className="hidden"
        />
      ))}
    </>
  )
}
