# Fase 3 — RAG Pipeline

> Prerequisite: `01_embedding_concept.md` dan `02_vector_db.md` selesai
> Output: AI chat yang menjawab berdasarkan catatan user dengan citation dan multi-turn conversation

## RAG Flow Lengkap

```
User mengirim pertanyaan
         │
         ▼
┌─────────────────────────────────┐
│ 1. RETRIEVAL                    │
│                                 │
│  Embed pertanyaan user          │
│         │                       │
│         ▼                       │
│  Vector search di pgvector      │
│  → top 5 catatan paling relevan │
│         │                       │
│         ▼                       │
│  Fetch full note data           │
│  (title, content, folder, tags) │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 2. AUGMENTATION                 │
│                                 │
│  Bangun prompt:                 │
│  - System instruction           │
│  - Context (catatan relevan)    │
│  - Chat history (multi-turn)    │
│  - User question                │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 3. GENERATION                   │
│                                 │
│  Kirim augmented prompt         │
│  ke Gemini API (streaming)      │
│         │                       │
│         ▼                       │
│  Parse response + extract       │
│  source references              │
│         │                       │
│         ▼                       │
│  Return jawaban + citation      │
│  ke client                      │
└─────────────────────────────────┘
```

---

## System Prompt (RAG Version)

```typescript
const RAG_SYSTEM_PROMPT = `Kamu adalah asisten AI untuk aplikasi Knowledge Base. 
Tugasmu adalah menjawab pertanyaan pengguna HANYA berdasarkan catatan yang diberikan sebagai konteks.

ATURAN KETAT:
1. Jawab HANYA berdasarkan informasi yang ada di catatan konteks yang diberikan.
2. Jika informasi tidak ditemukan di catatan, katakan dengan jujur: "Saya tidak menemukan informasi tersebut di catatan Anda."
3. JANGAN mengarang atau menggunakan pengetahuan umum di luar catatan.
4. Setiap klaim dalam jawaban HARUS disertai referensi ke catatan sumber menggunakan format: [Judul Catatan]
5. Jawab dalam bahasa yang sama dengan pertanyaan user.
6. Jawab dengan singkat dan jelas.

FORMAT REFERENSI:
- Sertakan sumber di akhir kalimat atau paragraf yang relevan: [Judul Catatan]
- Di akhir jawaban, buat section "Sumber:" yang mendaftar semua catatan yang direferensikan.`
```

## Augmented Prompt Construction

```typescript
// src/lib/rag/promptBuilder.ts

interface RetrievedNote {
  noteId: string
  title: string
  content: string
  similarity: number
}

export function buildAugmentedPrompt(
  retrievedNotes: RetrievedNote[],
  chatHistory: ChatMessage[],
  userQuestion: string
): GeminiMessage[] {
  // 1. System instruction sebagai message pertama
  const systemMessage: GeminiMessage = {
    role: 'user',
    parts: [{ text: RAG_SYSTEM_PROMPT }],
  }

  const systemAck: GeminiMessage = {
    role: 'model',
    parts: [{ text: 'Dipahami. Saya akan menjawab hanya berdasarkan catatan yang diberikan dan menyertakan referensi.' }],
  }

  // 2. Context injection
  const contextText = retrievedNotes
    .map((note, i) => `--- Catatan ${i + 1}: "${note.title}" ---\n${note.content}`)
    .join('\n\n')

  const contextMessage: GeminiMessage = {
    role: 'user',
    parts: [{
      text: `Berikut adalah catatan yang relevan sebagai konteks:\n\n${contextText}\n\n---\nGunakan catatan di atas untuk menjawab pertanyaan berikutnya.`,
    }],
  }

  const contextAck: GeminiMessage = {
    role: 'model',
    parts: [{ text: 'Saya sudah membaca catatan konteks tersebut. Silakan ajukan pertanyaan.' }],
  }

  // 3. Chat history (multi-turn)
  const historyMessages = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  })) as GeminiMessage[]

  // 4. Current question
  const questionMessage: GeminiMessage = {
    role: 'user',
    parts: [{ text: userQuestion }],
  }

  return [
    systemMessage,
    systemAck,
    contextMessage,
    contextAck,
    ...historyMessages,
    questionMessage,
  ]
}
```

---

## Multi-Turn Conversation

### Chat Session & History

```typescript
// Chat session disimpan di database
interface ChatSession {
  id: string
  title: string         // auto-generated dari pertanyaan pertama
  createdAt: string
  updatedAt: string
}

interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  sources: ChatSource[]  // hanya ada jika role = 'assistant'
  createdAt: string
}

interface ChatSource {
  noteId: string
  noteTitle: string
  relevanceScore: number
}
```

### Flow Multi-Turn

```
Pertanyaan 1 → Retrieve → Augment (no history) → Generate → Save to DB
Pertanyaan 2 → Retrieve → Augment (+ history Q1/A1) → Generate → Save to DB
Pertanyaan 3 → Retrieve → Augment (+ history Q1/A1, Q2/A2) → Generate → Save to DB
```

### Batasan History

- Kirim maksimal **10 pesan terakhir** sebagai history ke Gemini
- Jika history terlalu panjang, potong dari awal (keep latest)
- Ini untuk menghindari token limit dan menjaga relevansi

---

## Citation Extraction

AI diminta menyertakan referensi dalam format `[Judul Catatan]`. Di sisi server, kita parse response untuk mencocokkan judul catatan dengan data yang di-retrieve:

```typescript
// src/lib/rag/citationParser.ts

export function extractCitations(
  aiResponse: string,
  retrievedNotes: RetrievedNote[]
): ChatSource[] {
  const sources: ChatSource[] = []
  const seen = new Set<string>()

  for (const note of retrievedNotes) {
    if (aiResponse.includes(note.title) && !seen.has(note.noteId)) {
      seen.add(note.noteId)
      sources.push({
        noteId: note.noteId,
        noteTitle: note.title,
        relevanceScore: note.similarity,
      })
    }
  }

  return sources
}
```

---

## API Route (Updated)

```typescript
// src/app/api/chat/route.ts (Fase 3 version)
export async function POST(request: Request) {
  const { sessionId, message, history } = await request.json()

  // 1. Retrieve relevant notes
  const retrievedNotes = await searchSimilarNotes(message)

  // 2. Build augmented prompt
  const prompt = buildAugmentedPrompt(retrievedNotes, history, message)

  // 3. Call Gemini (streaming)
  const stream = await streamGeminiChat(prompt)

  // 4. Save messages to DB (after stream completes)
  // ... save user message + assistant response + sources

  // 5. Return stream + sources metadata
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

## Komponen UI yang Diperbarui

```
components/chat/
├── ChatSidebar.tsx       # Tambah: session list, new chat button
├── ChatMessage.tsx       # Tambah: citation badges di bawah AI response
├── ChatInput.tsx         # Sama
├── ChatSessionList.tsx   # Baru: list chat sessions
├── ChatCitation.tsx      # Baru: badge yang link ke catatan sumber
└── ChatEmptyState.tsx    # Update: ajak user bertanya tentang catatan
```

## Checklist

- [ ] RAG pipeline berfungsi end-to-end
- [ ] Embedding dibuat otomatis saat catatan disimpan
- [ ] Vector search mengembalikan catatan relevan
- [ ] Augmented prompt dibangun dengan benar
- [ ] AI menjawab berdasarkan catatan (bukan pengetahuan umum)
- [ ] Citation muncul di response AI
- [ ] Klik citation navigasi ke catatan sumber
- [ ] Multi-turn conversation berfungsi
- [ ] Chat history tersimpan di database
- [ ] Chat session bisa dibuat baru
- [ ] History dibatasi 10 pesan terakhir
- [ ] AI menolak menjawab jika tidak ada catatan relevan
