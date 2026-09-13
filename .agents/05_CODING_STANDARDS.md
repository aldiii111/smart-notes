# ⚖️ Coding Standards — Aturan Ketat

## Prinsip Utama

1. **Readability over cleverness** — kode yang mudah dibaca lebih penting daripada kode yang pintar
2. **Explicit over implicit** — jangan bergantung pada perilaku tersirat
3. **Fail fast, fail loud** — error harus langsung terlihat, bukan ditelan diam-diam
4. **Single responsibility** — satu file, satu tanggung jawab

---

## TypeScript Rules

### Strict Mode

TypeScript harus dijalankan dalam strict mode. Tambahkan flag berikut jika belum ada:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Larangan Mutlak

| ❌ Dilarang | ✅ Gunakan | Alasan |
|-------------|-----------|--------|
| `any` | `unknown` + type narrowing | `any` mematikan type safety |
| `as` type assertion | Type guard / discriminated union | Assertion berbohong ke compiler |
| `// @ts-ignore` | Perbaiki type-nya | Menutupi bug |
| `!` non-null assertion | Optional chaining `?.` + nullish coalescing `??` | Assertion berbohong ke compiler |
| `enum` | `const object + as const` atau union type literal | Enum punya runtime behavior yang membingungkan |
| `namespace` | ES modules (`import/export`) | Legacy pattern |
| Nested ternary | `if/else` atau early return | Sulit dibaca |

### Contoh Pola yang Benar

```typescript
// ❌ DILARANG
const data = response as NoteData
const name = user!.name
function process(input: any) { ... }
enum Status { Active, Inactive }

// ✅ BENAR
function isNoteData(value: unknown): value is NoteData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    'content' in value
  )
}

const name = user?.name ?? 'Anonymous'

function process(input: unknown) {
  if (!isNoteData(input)) {
    throw new Error('Invalid note data')
  }
  // input sekarang typed sebagai NoteData
}

const STATUS = {
  active: 'active',
  inactive: 'inactive',
} as const
type Status = typeof STATUS[keyof typeof STATUS]
```

---

## Konvensi Penamaan

### File & Folder

| Jenis | Konvensi | Contoh |
|-------|----------|--------|
| Komponen React | PascalCase | `NoteCard.tsx`, `ChatSidebar.tsx` |
| Hook | camelCase, prefix `use` | `useNotes.ts`, `useLocalStorage.ts` |
| Utility / lib | camelCase | `localStorage.ts`, `geminiClient.ts` |
| Type definitions | camelCase | `note.ts`, `chat.ts` |
| Constant | camelCase | `constants.ts` |
| Folder | kebab-case | `components/note-card/`, `hooks/` |

### Variabel & Fungsi

| Jenis | Konvensi | Contoh |
|-------|----------|--------|
| Variable | camelCase | `noteList`, `isLoading` |
| Function | camelCase, verb-first | `getNotes()`, `createNote()`, `handleDelete()` |
| Constant | SCREAMING_SNAKE_CASE | `STORAGE_KEYS`, `MAX_NOTE_LENGTH` |
| Type / Interface | PascalCase | `Note`, `ChatMessage`, `CreateNoteInput` |
| React Component | PascalCase | `NoteCard`, `ChatSidebar` |
| Boolean | prefix `is/has/can/should` | `isLoading`, `hasNotes`, `canEdit` |
| Event handler | prefix `handle` + event | `handleClick`, `handleSubmit`, `handleDelete` |
| Callback prop | prefix `on` + event | `onClick`, `onSubmit`, `onDelete` |

### Database (Fase 2+)

| Jenis | Konvensi | Contoh |
|-------|----------|--------|
| Table name | snake_case, plural | `notes`, `note_tags`, `chat_messages` |
| Column name | snake_case | `created_at`, `folder_id`, `is_pinned` |
| Index name | `idx_table_column` | `idx_notes_folder_id` |

---

## Struktur Komponen React

### Urutan di Dalam Komponen

```typescript
// 1. Imports (eksternal → internal → types → styles)
import { useState, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { useNotes } from '@/hooks/useNotes'
import type { Note } from '@/types/note'

// 2. Types & interfaces khusus komponen ini
interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

// 3. Komponen (named export, bukan default export)
export function NoteCard({ note, onDelete }: NoteCardProps) {
  // 3a. Hooks (semua hooks di atas, sebelum logic apapun)
  const [isEditing, setIsEditing] = useState(false)

  // 3b. Derived state / computed values
  const formattedDate = new Intl.DateTimeFormat('id-ID').format(
    new Date(note.createdAt)
  )

  // 3c. Event handlers
  const handleDelete = useCallback(() => {
    onDelete(note.id)
  }, [note.id, onDelete])

  // 3d. Early returns (loading, error, empty state)
  if (!note.content) {
    return <EmptyState message="Catatan kosong" />
  }

  // 3e. Render
  return (
    <Card>
      {/* ... */}
    </Card>
  )
}
```

### Aturan Export

| ❌ Dilarang | ✅ Gunakan |
|-------------|-----------|
| `export default function` | `export function NoteCard` |
| `export default` | Named export |

Alasan: Named export memaksa konsistensi nama saat import dan mempermudah refactoring.

---

## Error Handling

### Pattern Wajib

```typescript
// ❌ DILARANG: error ditelan diam-diam
try {
  await saveNote(note)
} catch {
  // kosong — bug tersembunyi
}

// ❌ DILARANG: catch tanpa type check
try {
  await saveNote(note)
} catch (error) {
  console.log(error.message) // error bertipe unknown
}

// ✅ BENAR: handle error dengan benar
try {
  await saveNote(note)
} catch (error) {
  const message = error instanceof Error
    ? error.message
    : 'Terjadi kesalahan yang tidak diketahui'

  console.error('[saveNote]', message)
  toast.error(message) // feedback ke user via Sonner
}
```

### Error Boundary

Setiap section utama (Notes area, Chat sidebar) harus dibungkus dengan React Error Boundary.

---

## State Management

### Fase 1

| Scope | Tool |
|-------|------|
| Komponen lokal | `useState` |
| Logika kompleks | `useReducer` |
| Shared state (notes, folders, tags) | React Context + `useReducer` |
| Side effects | `useEffect` (minimal, hindari jika bisa) |

### Aturan

1. **Jangan prop drill lebih dari 2 level** — gunakan Context
2. **Jangan simpan derived state** — hitung dari source of truth
3. **Context harus kecil dan fokus** — `NotesContext` dan `ChatContext` terpisah, bukan satu `AppContext` besar

```typescript
// ❌ DILARANG: derived state disimpan
const [notes, setNotes] = useState<Note[]>([])
const [filteredNotes, setFilteredNotes] = useState<Note[]>([]) // redundant!

// ✅ BENAR: derived state dihitung
const [notes, setNotes] = useState<Note[]>([])
const [searchQuery, setSearchQuery] = useState('')
const filteredNotes = useMemo(
  () => notes.filter(n => n.title.includes(searchQuery)),
  [notes, searchQuery]
)
```

---

## Import Alias

Gunakan path alias `@/` yang mengarah ke `src/`:

```jsonc
// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```typescript
// ❌ DILARANG: relative path panjang
import { NoteCard } from '../../../components/notes/NoteCard'

// ✅ BENAR: path alias
import { NoteCard } from '@/components/notes/NoteCard'
```

---

## Commit & Git

### Commit Message Format

```
<type>(<scope>): <deskripsi singkat>

type:  feat | fix | refactor | style | docs | test | chore
scope: notes | chat | ui | auth | db | rag | telemetry
```

Contoh:
```
feat(notes): implementasi create dan delete note
fix(chat): perbaiki race condition pada multi-turn chat
refactor(ui): extract NoteCard ke komponen terpisah
docs(agents): tambah phase-1 setup documentation
```

---

## Larangan Global

| # | Larangan | Alasan |
|---|----------|--------|
| 1 | Inline style (`style={{ }}`) | Gunakan Tailwind classes |
| 2 | `any` type | Gunakan `unknown` + type narrowing |
| 3 | `console.log` di production code | Gunakan structured logging atau hapus |
| 4 | Magic number / string | Extract ke constant |
| 5 | Nested ternary | Gunakan `if/else` atau early return |
| 6 | `default export` | Gunakan named export |
| 7 | `var` | Gunakan `const` atau `let` |
| 8 | Mutasi langsung pada state | Gunakan immutable update pattern |
| 9 | API key di client-side code (Fase 2+) | Pindahkan ke server environment variable |
| 10 | Mengabaikan error (empty catch) | Handle atau re-throw dengan konteks |
