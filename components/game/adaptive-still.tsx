'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IMAGE_NETWORK_PROFILE, useImageNetworkTier } from '@/lib/network-image'

type AdaptiveStillProps = {
  src: string
  alt?: string
  className?: string
  priority?: boolean
  upcomingSrcs?: string[]
  onReady?: () => void
}

export function AdaptiveStill({
  src,
  alt = '',
  className,
  priority = false,
  upcomingSrcs = [],
  onReady,
}: AdaptiveStillProps) {
  const tier = useImageNetworkTier()
  const profile = IMAGE_NETWORK_PROFILE[tier]
  const [loaded, setLoaded] = useState(false)
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
        onLoad={() => {
          setLoaded(true)
          onReady?.()
        }}
        onError={() => onReady?.()}
        className={`${className ?? ''} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
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
          className="hidden"
        />
      ))}
    </>
  )
}
