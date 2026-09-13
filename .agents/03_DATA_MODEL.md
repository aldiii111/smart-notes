# 🗄️ Data Model — Evolusi Data per Fase

## Prinsip Umum

- Catatan bersifat **plain text** (bukan rich text / markdown)
- Organisasi catatan menggunakan **folder**, **tag**, dan **kategori**
- Relasi tag bersifat many-to-many (satu catatan bisa punya banyak tag)
- Relasi folder bersifat one-to-many (satu catatan hanya ada di satu folder)
- Relasi kategori bersifat one-to-many (satu catatan hanya punya satu kategori)
- ID menggunakan format UUID v4

---

## Entity Relationship Diagram (Global)

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Folder  │     │ Category │     │     Tag      │
│──────────│     │──────────│     │──────────────│
│ id       │     │ id       │     │ id           │
│ name     │     │ name     │     │ name         │
│ color    │     │ color    │     │ color        │
│ createdAt│     │ createdAt│     │ createdAt    │
└────┬─────┘     └────┬─────┘     └──────┬───────┘
     │ 1:N            │ 1:N              │ M:N
     │                │                  │
     ▼                ▼                  ▼
┌──────────────────────────────────────────────────┐
│                     Note                          │
│──────────────────────────────────────────────────│
│ id: UUID                                          │
│ title: string                                     │
│ content: string (plain text)                      │
│ folderId: UUID | null (FK → Folder)               │
│ categoryId: UUID | null (FK → Category)           │
│ isPinned: boolean                                 │
│ createdAt: datetime                               │
│ updatedAt: datetime                               │
└──────────────────────────┬───────────────────────┘
                           │
              ┌────────────┼────────────┐
              │ (Fase 3+)  │            │
              ▼            ▼            ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────────┐
    │  Embedding   │ │  Chat    │ │ ChatMessage  │
    │──────────────│ │ Session  │ │──────────────│
    │ id           │ │──────────│ │ id           │
    │ noteId (FK)  │ │ id       │ │ sessionId(FK)│
    │ chunk        │ │ title    │ │ role         │
    │ vector       │ │ createdAt│ │ content      │
    │ createdAt    │ │ updatedAt│ │ sources[]    │
    └──────────────┘ └──────────┘ │ createdAt    │
                                  └──────────────┘
```

### Junction Table (Many-to-Many)

```
┌──────────────┐
│  NoteTag     │
│──────────────│
│ noteId (FK)  │
│ tagId (FK)   │
│ (PK: noteId  │
│  + tagId)    │
└──────────────┘
```

---

## Fase 1 — LocalStorage

### Storage Format

Semua data disimpan di `localStorage` sebagai JSON string.

```typescript
// localStorage keys
const STORAGE_KEYS = {
  notes: 'kb_notes',
  folders: 'kb_folders',
  categories: 'kb_categories',
  tags: 'kb_tags',
} as const

// ---------- Type Definitions ----------

interface Note {
  id: string              // UUID v4
  title: string
  content: string         // plain text
  folderId: string | null
  categoryId: string | null
  tagIds: string[]        // array of Tag IDs
  isPinned: boolean
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
}

interface Folder {
  id: string
  name: string
  color: string           // hex color code
  createdAt: string
}

interface Category {
  id: string
  name: string
  color: string
  createdAt: string
}

interface Tag {
  id: string
  name: string
  color: string
  createdAt: string
}
```

### Operasi CRUD (Fase 1)

```typescript
// Helper pattern untuk LocalStorage operations
function getNotes(): Note[] {
  const raw = localStorage.getItem(STORAGE_KEYS.notes)
  return raw ? JSON.parse(raw) : []
}

function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes))
}
```

### Limitasi Fase 1 yang Disengaja

| Limitasi | Alasan Pedagogis |
|----------|-----------------|
| Data hilang jika clear browser | Motivasi migrasi ke database di Fase 2 |
| Tidak ada relational integrity | Menunjukkan mengapa relational DB dibutuhkan |
| Tag disimpan sebagai array di Note | Di Fase 2 akan dinormalisasi ke junction table |
| Tidak ada pagination | Data volume kecil di LocalStorage |

---

## Fase 2 — Supabase PostgreSQL

### SQL Schema

```sql
-- Folders
CREATE TABLE folders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#6b7280',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#6b7280',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  color       TEXT NOT NULL DEFAULT '#6b7280',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Notes
CREATE TABLE notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  folder_id   UUID REFERENCES folders(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_pinned   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Note-Tag junction table (many-to-many)
CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Perubahan dari Fase 1

| Aspek | Fase 1 | Fase 2 |
|-------|--------|--------|
| Storage | LocalStorage (JSON) | Supabase PostgreSQL |
| Tag relation | `tagIds: string[]` dalam Note | Junction table `note_tags` |
| ID generation | `crypto.randomUUID()` di client | `gen_random_uuid()` di database |
| Timestamps | ISO string di client | `TIMESTAMPTZ` di database |
| Data integrity | Tidak ada constraint | Foreign keys + CASCADE |
| Naming convention | camelCase (JS) | snake_case (SQL) |

---

## Fase 3 — Embedding + Chat History

### Tabel Tambahan

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Note embeddings (untuk RAG retrieval)
CREATE TABLE note_embeddings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id    UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  chunk      TEXT NOT NULL,              -- teks yang di-embed (bisa = full note content)
  embedding  VECTOR(768) NOT NULL,       -- Gemini embedding dimension
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index untuk similarity search
CREATE INDEX ON note_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Chat sessions
CREATE TABLE chat_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages
CREATE TABLE chat_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT NOT NULL,
  sources    JSONB DEFAULT '[]',         -- array of { noteId, noteTitle, relevanceScore }
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Embedding Strategy

```
Catatan disimpan/diupdate
         │
         ▼
  Apakah content berubah?
         │
    Ya ──┤
         ▼
  Hapus embedding lama (note_id)
         │
         ▼
  Chunking: karena catatan = plain text pendek (sticky notes),
  maka 1 catatan = 1 chunk (tidak perlu splitting)
         │
         ▼
  Kirim chunk ke Gemini Embedding API
         │
         ▼
  Simpan vector ke note_embeddings
```

### Citation Source Format

```typescript
interface ChatSource {
  noteId: string
  noteTitle: string
  relevanceScore: number  // cosine similarity score
}

interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  sources: ChatSource[]   // hanya ada jika role = 'assistant'
  createdAt: string
}
```

---

## Fase 4 — Telemetry Table

```sql
-- AI usage telemetry
CREATE TABLE ai_telemetry (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  message_id      UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  prompt_tokens   INTEGER NOT NULL,
  response_tokens INTEGER NOT NULL,
  total_tokens    INTEGER NOT NULL,
  latency_ms      INTEGER NOT NULL,        -- response time in milliseconds
  model           TEXT NOT NULL,            -- e.g. 'gemini-2.0-flash'
  retrieved_count INTEGER DEFAULT 0,        -- jumlah catatan yang di-retrieve
  created_at      TIMESTAMPTZ DEFAULT now()
);
```
