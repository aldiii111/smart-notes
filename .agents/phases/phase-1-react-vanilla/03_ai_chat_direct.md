# Fase 1 — AI Chat Direct (Gemini API)

> Prerequisite: `02_notes_crud.md` selesai
> Output: AI chat sidebar yang bisa mengobrol dengan Gemini API (tanpa konteks catatan)

## Scope

Di Fase 1, AI chat bersifat **general purpose** — seperti ChatGPT biasa. AI **belum bisa membaca catatan** pengguna. RAG pipeline baru di Fase 3.

### Yang Dibangun

| Fitur | Detail |
|-------|--------|
| Chat sidebar | Panel chat di sisi kanan, toggle show/hide |
| Kirim pesan | User mengetik pertanyaan, AI menjawab |
| Streaming response | Response AI muncul secara streaming (bukan tunggu selesai) |
| Chat state | Percakapan disimpan di React state (hilang jika refresh) |

### Yang TIDAK Dibangun di Fase 1

| Fitur | Alasan |
|-------|--------|
| RAG / baca catatan | Belum ada backend, embedding, atau vector DB |
| Citation | Tidak ada sumber catatan yang direferensikan |
| Chat history persist | Tidak disimpan ke LocalStorage (chat bersifat ephemeral) |
| Multi-turn memory di server | API key ada di client, tidak perlu kompleksitas |

---

## Gemini API Integration

### API Key

Di Fase 1, API key disimpan sebagai variabel di client-side code. Ini **sengaja tidak aman** untuk memotivasi migrasi ke server-side di Fase 2.

```typescript
// src/lib/geminiClient.ts
// ⚠️ FASE 1 ONLY: API key exposed di client — migrasi ke server di Fase 2
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Simpan di .env (gitignore'd)
// VITE_GEMINI_API_KEY=your_key_here
```

### API Call Pattern

```typescript
// Gunakan Gemini REST API langsung via fetch
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent

interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature: number
    maxOutputTokens: number
  }
}

async function* streamChat(
  messages: GeminiMessage[]
): AsyncGenerator<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  )

  // Parse SSE stream
  // ... streaming logic
}
```

### System Prompt (Fase 1)

```typescript
const SYSTEM_PROMPT = `Kamu adalah asisten AI yang membantu pengguna. 
Jawab dengan singkat, jelas, dan dalam bahasa yang sesuai dengan pertanyaan user.
Jika user bertanya dalam Bahasa Indonesia, jawab dalam Bahasa Indonesia.
Jika user bertanya dalam Bahasa Inggris, jawab dalam Bahasa Inggris.`
```

---

## Komponen yang Dibangun

```
components/chat/
├── ChatSidebar.tsx       # Container utama sidebar chat (panel kanan)
├── ChatMessage.tsx       # Bubble pesan (user / assistant)
├── ChatInput.tsx         # Input area + tombol send
├── ChatEmptyState.tsx    # State awal sebelum ada pesan
└── ChatToggle.tsx        # Tombol toggle show/hide chat sidebar

hooks/
├── useChat.ts            # State management chat messages
└── useGemini.ts          # Gemini API call + streaming logic

lib/
└── geminiClient.ts       # Low-level Gemini API wrapper

contexts/
└── ChatContext.tsx        # Shared chat state
```

## Aturan Khusus

1. **API key via environment variable** (`VITE_GEMINI_API_KEY` di `.env`)
2. **`.env` harus ada di `.gitignore`** — jangan pernah commit API key
3. **Streaming wajib** — response harus muncul token-by-token, bukan menunggu selesai
4. **Loading state** — tampilkan indikator saat menunggu response AI
5. **Error handling** — tampilkan pesan error yang jelas jika API gagal (rate limit, network error)
6. **Chat state ephemeral** — tidak perlu persist ke LocalStorage

## Checklist

- [ ] `.env` dengan `VITE_GEMINI_API_KEY` terkonfigurasi
- [ ] `.env` ada di `.gitignore`
- [ ] `geminiClient.ts` bisa memanggil Gemini API
- [ ] Streaming response berfungsi
- [ ] Chat sidebar bisa toggle show/hide
- [ ] User bisa mengirim pesan dan menerima jawaban
- [ ] Loading state tampil saat menunggu AI
- [ ] Error state tampil jika API gagal
- [ ] Chat sidebar responsive (overlay/sheet di mobile)
