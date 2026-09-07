'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const MAX_BYTES = 10 * 1024 * 1024

type ImageUploadProps = {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
  hint?: string
}

// Uploads an image straight to the public `quiz-media` Supabase bucket from
// the browser using the authenticated client. Files land under a folder named
// with the user's id, which the bucket's RLS policy requires. On success the
// public URL is handed back via onChange.
export function ImageUpload({
  value,
  onChange,
  label = 'Drag & drop or click to upload an image',
  hint = 'PNG, JPEG, GIF, or WEBP \u00B7 max 10MB',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    setError('')
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be 10MB or smaller.')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError('Please sign in to upload images.')
        return
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('quiz-media')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadError) {
        setError(uploadError.message)
        return
      }

      const { data } = supabase.storage.from('quiz-media').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {value ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-background/40">
          <Image src={value || '/placeholder.svg'} alt="Uploaded preview" fill className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-background/90 to-transparent p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-border bg-background/80 px-4 py-1.5 font-display text-xs font-bold transition-colors hover:bg-accent disabled:opacity-60"
            >
              {uploading ? 'Uploading\u2026' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={uploading}
              className="rounded-full border border-brand/50 bg-background/80 px-4 py-1.5 font-display text-xs font-bold text-brand transition-colors hover:bg-brand-soft disabled:opacity-60"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
          className="grid aspect-[16/9] w-full place-items-center rounded-2xl border-2 border-dashed border-border bg-background/40 px-6 text-center transition-colors hover:border-brand"
        >
          <span className="grid size-12 place-items-center rounded-lg border-2 border-brand text-2xl text-brand">
            {'\u{1F39E}\uFE0F'}
          </span>
          <p className="mt-4 font-display font-bold">{uploading ? 'Uploading\u2026' : label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </button>
      )}

      {error && <p className="mt-2 text-sm font-semibold text-brand">{error}</p>}
    </div>
  )
}
