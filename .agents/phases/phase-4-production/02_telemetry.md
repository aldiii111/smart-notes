# Fase 4 — AI Telemetry & Monitoring

> Prerequisite: `01_auth.md` selesai
> Output: Logging dan monitoring AI usage untuk mengukur kualitas RAG

## Mengapa Telemetry?

RAG tanpa pengukuran = menebak-nebak. Telemetry menjawab:
- Apakah AI menjawab dengan akurat?
- Berapa lama response time?
- Berapa token yang dipakai (biaya)?
- Catatan mana yang paling sering di-retrieve?
- Apakah threshold similarity sudah optimal?

---

## Data yang Di-log

### Per Request AI

```typescript
interface TelemetryEntry {
  id: string
  sessionId: string          // chat session
  messageId: string          // chat message (assistant)
  promptTokens: number       // input tokens
  responseTokens: number     // output tokens
  totalTokens: number
  latencyMs: number          // total response time
  model: string              // e.g. 'gemini-2.0-flash'
  retrievedCount: number     // jumlah catatan yang di-retrieve
  topSimilarity: number      // similarity score tertinggi
  createdAt: string
}
```

### Implementasi Logging

```typescript
// src/lib/telemetry/logger.ts
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function logAITelemetry(entry: Omit<TelemetryEntry, 'id' | 'createdAt'>) {
  const supabase = await createSupabaseServerClient()

  await supabase.from('ai_telemetry').insert({
    session_id: entry.sessionId,
    message_id: entry.messageId,
    prompt_tokens: entry.promptTokens,
    response_tokens: entry.responseTokens,
    total_tokens: entry.totalTokens,
    latency_ms: entry.latencyMs,
    model: entry.model,
    retrieved_count: entry.retrievedCount,
  })
}
```

### Integrasi di RAG Pipeline

```typescript
// Di src/app/api/chat/route.ts — tambahkan telemetry
const startTime = performance.now()

// ... RAG pipeline ...

const latencyMs = Math.round(performance.now() - startTime)

// Log setelah response selesai (non-blocking)
void logAITelemetry({
  sessionId,
  messageId: assistantMessage.id,
  promptTokens: usage.promptTokens,
  responseTokens: usage.completionTokens,
  totalTokens: usage.totalTokens,
  latencyMs,
  model: 'gemini-2.0-flash',
  retrievedCount: retrievedNotes.length,
})
```

---

## Dashboard Telemetry (Opsional tapi Impressive untuk Portfolio)

Buat halaman `/dashboard` yang menampilkan:

| Metrik | Visualisasi |
|--------|-------------|
| Total conversations | Counter |
| Avg response time | Line chart (per hari) |
| Total tokens used | Counter + trend |
| Top retrieved notes | Ranked list |
| Avg similarity score | Gauge / number |
| Error rate | Percentage |

Implementasi bisa sederhana menggunakan query langsung ke `ai_telemetry` table.

---

## Production Polish Checklist (Seluruh App)

### Error Handling
- [ ] Error Boundary di setiap section utama
- [ ] Fallback UI yang informatif saat error
- [ ] Toast notification untuk semua error yang bisa di-recover

### Loading States
- [ ] Skeleton loading di setiap data fetch
- [ ] Loading spinner saat submit form
- [ ] Optimistic update di semua mutasi

### Performance
- [ ] Lazy loading untuk AI Chat sidebar
- [ ] Debounce pada search input
- [ ] Memoization (`useMemo`, `useCallback`) di komponen yang sering re-render

### Accessibility
- [ ] Semua tombol punya label yang jelas
- [ ] Keyboard navigation berfungsi
- [ ] Focus trap di modal/dialog

### Final Checklist
- [ ] `ai_telemetry` table terbuat
- [ ] Logging berfungsi di setiap AI request
- [ ] Telemetry tidak blocking response (async/fire-and-forget)
- [ ] Dashboard telemetry ter-render (jika diimplementasikan)
- [ ] `next build` berhasil tanpa error
- [ ] Tidak ada `console.log` tersisa di production code
- [ ] Semua environment variables terdokumentasi
- [ ] README.md diupdate dengan setup instructions
