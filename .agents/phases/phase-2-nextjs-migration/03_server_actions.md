# Fase 2 — Server Actions

> Prerequisite: `02_database_setup.md` selesai
> Output: Semua operasi CRUD dan AI call dipindah ke server-side via Server Actions

## Konsep

Server Actions adalah fungsi async yang berjalan di server, dipanggil langsung dari client component. Ini menggantikan pola `fetch → API route` yang lebih verbose.

```typescript
// Deklarasi: tambahkan "use server" di atas file
'use server'

// Pemanggilan: langsung import dan panggil dari client component
import { createNote } from '@/actions/notes'
await createNote({ title: 'Test', content: 'Hello' })
```

---

## Server Actions yang Dibangun

### Notes Actions

```
src/actions/
├── notes.ts        # CRUD notes
├── folders.ts      # CRUD folders
├── categories.ts   # CRUD categories
├── tags.ts         # CRUD tags
└── chat.ts         # Gemini API call (server-side)
```

### Pattern untuk Setiap Action

```typescript
// src/actions/notes.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { CreateNoteInput, UpdateNoteInput } from '@/types/note'

// Semua action mengembalikan Result pattern
interface ActionResult<T> {
  data: T | null
  error: string | null
}

export async function createNote(
  input: CreateNoteInput
): Promise<ActionResult<Note>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: input.title,
        content: input.content,
        folder_id: input.folderId ?? null,
        category_id: input.categoryId ?? null,
        is_pinned: false,
      })
      .select()
      .single()

    if (error) throw error

    // Handle tags (junction table)
    if (input.tagIds.length > 0) {
      const tagInserts = input.tagIds.map(tagId => ({
        note_id: data.id,
        tag_id: tagId,
      }))
      await supabase.from('note_tags').insert(tagInserts)
    }

    return { data: mapToNote(data), error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create note'
    return { data: null, error: message }
  }
}

export async function getNotes(): Promise<ActionResult<Note[]>> {
  // ... query with joins for tags
}

export async function updateNote(
  id: string,
  input: UpdateNoteInput
): Promise<ActionResult<Note>> {
  // ... update + sync note_tags
}

export async function deleteNote(
  id: string
): Promise<ActionResult<{ id: string }>> {
  // ... delete (CASCADE handles note_tags)
}
```

### Naming Convention: Database → TypeScript

Supabase mengembalikan snake_case. Map ke camelCase di server action:

```typescript
// Mapper function (server-side)
function mapToNote(row: DatabaseNote): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    folderId: row.folder_id,
    categoryId: row.category_id,
    isPinned: row.is_pinned,
    tagIds: [],  // populated separately from junction table
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
```

---

## Migrasi Gemini API ke Server

```typescript
// src/actions/chat.ts
'use server'

// API key sekarang aman di server
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<ReadableStream> {
  // Panggil Gemini API dari server
  // Return streaming response
}
```

Untuk streaming dari Server Action ke client, gunakan API Route:

```typescript
// src/app/api/chat/route.ts
export async function POST(request: Request) {
  const { messages } = await request.json()

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: messages }),
    }
  )

  // Forward stream ke client
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

---

## Update Hooks (Client-Side)

Hooks yang sebelumnya langsung akses LocalStorage, sekarang memanggil Server Actions:

```typescript
// src/hooks/useNotes.ts (Fase 2 version)
'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { getNotes, createNote, updateNote, deleteNote } from '@/actions/notes'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isPending, startTransition] = useTransition()

  // Fetch notes on mount
  useEffect(() => {
    async function fetchNotes() {
      const result = await getNotes()
      if (result.data) setNotes(result.data)
    }
    fetchNotes()
  }, [])

  const handleCreate = useCallback((input: CreateNoteInput) => {
    startTransition(async () => {
      const result = await createNote(input)
      if (result.data) {
        setNotes(prev => [result.data!, ...prev])
        toast.success('Catatan berhasil dibuat')
      }
      if (result.error) {
        toast.error(result.error)
      }
    })
  }, [])

  // ... update, delete handlers

  return { notes, isPending, handleCreate, handleUpdate, handleDelete }
}
```

## Aturan Khusus

1. **Semua Server Actions return `ActionResult<T>`** — tidak boleh throw ke client
2. **Mapping snake_case → camelCase** dilakukan di server action, bukan di client
3. **`useTransition`** untuk semua mutation agar UI tetap responsif
4. **Optimistic update** — update state dulu, rollback jika server gagal
5. **Revalidasi data** — setelah mutasi berhasil, panggil `revalidatePath` jika perlu

## Checklist

- [ ] `src/actions/notes.ts` — CRUD lengkap
- [ ] `src/actions/folders.ts` — CRUD lengkap
- [ ] `src/actions/categories.ts` — CRUD lengkap
- [ ] `src/actions/tags.ts` — CRUD lengkap
- [ ] `src/app/api/chat/route.ts` — Gemini streaming dari server
- [ ] Hooks diupdate untuk memanggil Server Actions
- [ ] snake_case → camelCase mapping berfungsi
- [ ] Error handling mengembalikan pesan yang jelas ke user
- [ ] `useTransition` digunakan untuk semua mutasi
- [ ] Search & filter tetap berfungsi
- [ ] Semua fitur Fase 1 tetap berjalan setelah migrasi
