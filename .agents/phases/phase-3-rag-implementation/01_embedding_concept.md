# Fase 3 — Embedding Concept

> Prerequisite: Fase 2 selesai sepenuhnya
> Output: Pemahaman tentang embedding dan implementasi embedding pipeline

## Apa Itu Embedding?

Embedding adalah representasi teks dalam bentuk array angka (vector) yang menangkap "makna" semantik dari teks tersebut. Dua teks yang memiliki makna serupa akan memiliki vector yang berdekatan dalam ruang multidimensi.

```
"kucing tidur di sofa"  → [0.12, -0.34, 0.89, ... 768 dimensi]
"cat sleeping on couch" → [0.11, -0.33, 0.87, ... 768 dimensi]  ← berdekatan!
"harga saham naik"      → [-0.56, 0.78, 0.01, ... 768 dimensi]  ← berjauhan
```

## Mengapa Embedding Dibutuhkan untuk RAG?

| Tanpa Embedding (keyword search) | Dengan Embedding (semantic search) |
|----------------------------------|-------------------------------------|
| "kucing" tidak match "cat" | "kucing" dan "cat" dianggap serupa |
| Harus pakai kata yang persis sama | Memahami makna, bukan kata literal |
| Tidak bisa menangani sinonim | Sinonim otomatis ter-cover |

---

## Embedding Pipeline

```
Catatan disimpan/diupdate
         │
         ▼
┌─────────────────────────┐
│  Apakah content berubah?│
│  (bandingkan hash)      │
└────────┬────────────────┘
         │ Ya
         ▼
┌─────────────────────────┐
│  Hapus embedding lama   │
│  (DELETE WHERE note_id) │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Chunking               │
│  Karena catatan = plain │
│  text pendek, maka:     │
│  1 catatan = 1 chunk    │
│  (tidak perlu splitting)│
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Kirim ke Gemini        │
│  Embedding API          │
│  Model: text-embedding- │
│  004                    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Simpan ke Supabase     │
│  note_embeddings table  │
│  (note_id, chunk,       │
│   vector[768])          │
└─────────────────────────┘
```

## Gemini Embedding API

```typescript
// src/lib/gemini/embedding.ts
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface EmbeddingResponse {
  embedding: {
    values: number[]  // 768 dimensi
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text }],
        },
      }),
    }
  )

  const data: EmbeddingResponse = await response.json()
  return data.embedding.values
}
```

## Kapan Embedding Dibuat?

| Event | Aksi |
|-------|------|
| Catatan baru dibuat | Generate embedding untuk content |
| Catatan diupdate (content berubah) | Hapus embedding lama, generate baru |
| Catatan dihapus | Embedding dihapus otomatis (CASCADE) |
| Catatan diupdate (hanya title/tag/folder) | Tidak perlu re-embed |

## Aturan Khusus

1. **Embedding hanya di server** — jangan pernah panggil Embedding API dari client
2. **Async processing** — embedding dibuat setelah note tersimpan, tidak blocking UI
3. **Idempotent** — re-embed catatan yang sama menghasilkan vector yang sama (deterministic)
4. **Error tolerant** — jika embedding gagal, catatan tetap tersimpan (embedding bisa di-retry)

## Checklist

- [ ] `generateEmbedding` function berfungsi
- [ ] Embedding otomatis dibuat saat catatan baru dibuat
- [ ] Embedding otomatis diupdate saat catatan content berubah
- [ ] Embedding terhapus saat catatan dihapus (CASCADE)
- [ ] Embedding tersimpan di `note_embeddings` table
- [ ] Error pada embedding tidak menggagalkan penyimpanan catatan
