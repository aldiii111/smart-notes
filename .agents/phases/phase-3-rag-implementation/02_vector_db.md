# Fase 3 — Vector Database (pgvector)

> Prerequisite: `01_embedding_concept.md` selesai
> Output: pgvector terkonfigurasi di Supabase, similarity search berfungsi

## Apa Itu pgvector?

pgvector adalah extension PostgreSQL yang menambahkan tipe data `VECTOR` dan operator similarity search. Karena Supabase berbasis PostgreSQL, pgvector bisa diaktifkan langsung tanpa service tambahan.

## Setup

### 1. Enable Extension

```sql
-- Jalankan di Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Tabel Embedding

```sql
-- Sudah didefinisikan di 03_DATA_MODEL.md Fase 3
CREATE TABLE note_embeddings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id    UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  chunk      TEXT NOT NULL,
  embedding  VECTOR(768) NOT NULL,     -- Gemini text-embedding-004 = 768 dimensi
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. Index untuk Performance

```sql
-- IVFFlat index untuk approximate nearest neighbor search
-- lists = sqrt(jumlah_row) sebagai starting point, minimum 100
CREATE INDEX ON note_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

---

## Similarity Search

### Supabase RPC Function

Buat function di Supabase untuk melakukan vector similarity search:

```sql
CREATE OR REPLACE FUNCTION match_notes(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  note_id UUID,
  chunk TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    ne.note_id,
    ne.chunk,
    1 - (ne.embedding <=> query_embedding) AS similarity
  FROM note_embeddings ne
  WHERE 1 - (ne.embedding <=> query_embedding) > match_threshold
  ORDER BY ne.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### Operator

| Operator | Nama | Penggunaan |
|----------|------|------------|
| `<=>` | Cosine distance | `1 - (a <=> b)` = cosine similarity |
| `<->` | L2 (Euclidean) distance | Tidak dipakai di proyek ini |
| `<#>` | Inner product (negative) | Tidak dipakai di proyek ini |

Kita pakai **cosine distance** karena paling cocok untuk text embedding.

### Memanggil dari Server

```typescript
// src/lib/supabase/vectorSearch.ts
import { createSupabaseServerClient } from './server'
import { generateEmbedding } from '@/lib/gemini/embedding'

interface MatchedNote {
  noteId: string
  chunk: string
  similarity: number
}

export async function searchSimilarNotes(
  query: string,
  threshold = 0.7,
  limit = 5
): Promise<MatchedNote[]> {
  const supabase = await createSupabaseServerClient()

  // 1. Embed pertanyaan user
  const queryEmbedding = await generateEmbedding(query)

  // 2. Similarity search via RPC
  const { data, error } = await supabase.rpc('match_notes', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  })

  if (error) throw error

  return (data ?? []).map((row: Record<string, unknown>) => ({
    noteId: row.note_id as string,
    chunk: row.chunk as string,
    similarity: row.similarity as number,
  }))
}
```

---

## Tuning Parameters

| Parameter | Default | Penjelasan |
|-----------|---------|------------|
| `match_threshold` | `0.7` | Minimum similarity score (0–1). Semakin tinggi = semakin ketat |
| `match_count` | `5` | Maksimum jumlah catatan yang dikembalikan |
| `lists` (index) | `100` | Jumlah cluster untuk IVFFlat. Naikkan jika data > 10.000 row |

Threshold `0.7` adalah starting point. Tuning dilakukan berdasarkan hasil testing di Fase 4 (telemetry).

## Checklist

- [ ] pgvector extension aktif di Supabase
- [ ] `note_embeddings` table terbuat
- [ ] IVFFlat index terbuat
- [ ] `match_notes` RPC function terbuat
- [ ] `searchSimilarNotes` berfungsi dari server
- [ ] Similarity search mengembalikan catatan yang relevan
- [ ] Threshold dan limit bisa dikonfigurasi
