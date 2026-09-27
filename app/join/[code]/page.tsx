import { JoinEnterCode } from '@/components/join/join-enter-code'

export default async function JoinByPathCodePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const preset = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)
  return <JoinEnterCode key={preset || 'manual'} presetCode={preset} />
}
