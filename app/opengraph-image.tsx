import { ImageResponse } from 'next/og'

export const alt = 'GatherFlix — live movie, sports, and shows trivia with friends'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: '#0a0509',
          color: '#faf3f7',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#e8b923',
          }}
        >
          GatherFlix
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          Face off in real-time movie, sports, and shows trivia.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: '#c9b8c2', maxWidth: 860 }}>
          Host a night. Friends join on their phones. Free.
        </div>
      </div>
    ),
    size,
  )
}
