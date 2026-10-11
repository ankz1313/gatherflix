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
  // Host TVs are usually on Wi-Fi. If the browser does not expose a connection
  // (Safari), assume fast so we do not hide the still behind a loading label.
  if (!connection) return 'fast'
  if (connection.saveData) return 'slow'
  const type = connection.effectiveType
  if (type === 'slow-2g' || type === '2g') return 'slow'
  if (type === '4g') return 'fast'
  if (typeof connection.downlink === 'number' && connection.downlink > 0 && connection.downlink < 0.8) {
    return 'slow'
  }
  if (type === '3g') return 'mid'
  return 'fast'
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
  return 'fast'
}

export function useImageNetworkTier(): ImageNetworkTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
