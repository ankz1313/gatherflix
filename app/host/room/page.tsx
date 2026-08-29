import type { Metadata } from 'next'
import { RoomCreated } from '@/components/host/room-created'
import { getDeck } from '@/lib/decks'

export const metadata: Metadata = {
  title: 'Host a Room · Go Live — GatherFlix',
  description: 'Your room is live. Share the code or QR and start the game.',
}

export default async function HostRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ deck?: string }>
}) {
  const { deck: slug } = await searchParams
  const deck = getDeck(slug)

  return <RoomCreated deck={deck} />
}
