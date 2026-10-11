export type HostPace = 'auto' | 'manual'

export function parseHostPace(value: string | null | undefined): HostPace {
  return value === 'manual' ? 'manual' : 'auto'
}

export function paceStorageKey(code: string) {
  return `gf_host_pace_${code}`
}

export function withHostPace(href: string, pace: HostPace) {
  if (pace !== 'manual') return href
  const join = href.includes('?') ? '&' : '?'
  return `${href}${join}pace=manual`
}
