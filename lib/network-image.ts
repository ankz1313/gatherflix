import { useSyncExternalStore } from 'react'

export type ImageNetworkTier = 'slow' | 'mid' | 'fast'

type Connection = {
  effectiveType?: string
  downlink?: number
  saveData?: boolean
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

function readConnection(): Connection | null {
  if (typeof navigator === 'undefined') return null
  const nav = navigator as Navigator & {
    connection?: Connection
    mozConnection?: Connection
    webkitConnection?: Connection
  }
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection ?? null
}

export function imageNetworkTierFromConnection(connection: Connection | null): ImageNetworkTier {
  if (!connection) return 'mid'
  if (connection.saveData) return 'slow'
  const type = connection.effectiveType
  if (type === 'slow-2g' || type === '2g') return 'slow'
  if (typeof connection.downlink === 'number') {
    if (connection.downlink > 0 && connection.downlink < 0.8) return 'slow'
    if (connection.downlink < 2.5) return 'mid'
    return 'fast'
  }
  if (type === '3g') return 'mid'
  if (type === '4g') return 'fast'
  return 'mid'
}

export const IMAGE_NETWORK_PROFILE: Record<
  ImageNetworkTier,
  { quality: number; width: number; sizes: string }
> = {
  slow: {
    quality: 40,
    width: 720,
    sizes: '(max-width: 720px) 100vw, 720px',
  },
  mid: {
    quality: 55,
    width: 1080,
    sizes: '(max-width: 1080px) 100vw, 1080px',
  },
  fast: {
    quality: 70,
    width: 1440,
    sizes: '(max-width: 1440px) 100vw, 1440px',
  },
}

function subscribe(onStoreChange: () => void) {
  const connection = readConnection()
  if (!connection?.addEventListener) return () => {}
  connection.addEventListener('change', onStoreChange)
  return () => connection.removeEventListener?.('change', onStoreChange)
}

function getSnapshot(): ImageNetworkTier {
  return imageNetworkTierFromConnection(readConnection())
}

function getServerSnapshot(): ImageNetworkTier {
  return 'mid'
}

export function useImageNetworkTier(): ImageNetworkTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
