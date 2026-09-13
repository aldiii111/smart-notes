# 🏗️ Architecture — Evolusi Arsitektur per Fase

## Tech Stack Global

| Layer | Teknologi | Catatan |
|-------|-----------|---------|
| **Language** | TypeScript (strict mode) | Digunakan di semua fase |
| **UI Framework** | React 19 | Fase 1 standalone, Fase 2+ di dalam Next.js |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Design system konsisten dari awal |
| **Bundler** | Vite (Fase 1) → Next.js built-in (Fase 2+) | |
| **Linter** | oxlint | |
| **AI Provider** | Google Gemini API | Free tier |
| **Database** | Supabase PostgreSQL | Fase 2+ |
| **Vector DB** | Supabase pgvector | Fase 3+ (extension bawaan, bukan service terpisah) |
| **Auth** | Supabase Auth (Google OAuth) | Fase 2+ |
| **Package Manager** | pnpm | |

---

## Arsitektur per Fase

### Fase 1 — Client-Side Only

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  React   │  │  Notes   │  │  AI Chat  │  │
│  │  Router  │──│  CRUD    │  │  Panel    │  │
│  └──────────┘  └────┬─────┘  └─────┬─────┘  │
│                     │              │         │
│               ┌─────▼─────┐  ┌─────▼──────┐ │
│               │LocalStorage│  │ Gemini API │ │
│               │  (notes)   │  │ (direct)   │ │
│               └────────────┘  └────────────┘ │
│                                              │
│  ⚠️ API Key exposed di client — disengaja    │
│     untuk motivasi migrasi ke Fase 2         │
└─────────────────────────────────────────────┘
```

**Karakteristik:**
- Semua logika di browser
- State management via React hooks (`useState`, `useReducer`)
- Data persist di LocalStorage
- Gemini API dipanggil langsung dari client via `fetch`
- Routing: React Router (client-side routing)

---

### Fase 2 — Fullstack (Next.js + Supabase)

```
┌──────────────────┐       ┌──────────────────────────┐
│     Browser      │       │     Next.js Server       │
│                  │       │                           │
│  ┌────────────┐  │  HTTP │  ┌──────────────────┐    │
│  │  React     │──┼───────┼─▶│  Server Actions   │   │
│  │  Components│  │       │  │  / API Routes     │   │
│  └────────────┘  │       │  └───────┬──────┬────┘   │
│                  │       │          │      │         │
└──────────────────┘       │    ┌─────▼──┐ ┌─▼──────┐ │
                           │    │Supabase│ │ Gemini │ │
                           │    │  DB    │ │  API   │ │
                           │    └────────┘ └────────┘ │
                           │                           │
                           │  ┌──────────────────┐    │
                           │  │  Supabase Auth   │    │
                           │  │  (Google OAuth)  │    │
                           │  └──────────────────┘    │
                           └──────────────────────────┘
```

**Karakteristik:**
- API key aman di server-side environment variables
- Database relasional (PostgreSQL via Supabase)
- Server Actions untuk mutasi data (create, update, delete)
- API Routes untuk operasi kompleks
- Supabase Auth mengelola session & Google OAuth
- Row Level Security (RLS) di Supabase sebagai proteksi tambahan

---

### Fase 3 — RAG Pipeline

```
┌──────────┐    ┌─────────────────────────────────────────┐
│ Browser  │    │            Next.js Server                │
│          │    │                                          │
│ User     │    │  ┌─────────────────────────────────┐    │
│ bertanya ┼────┼─▶│         RAG Pipeline            │    │
│          │    │  │                                  │    │
│          │    │  │  1. Terima pertanyaan user       │    │
│          │    │  │  2. Embed pertanyaan (Gemini)    │    │
│          │    │  │  3. Vector search (pgvector)     │    │
│          │    │  │  4. Ambil catatan relevan        │    │
│          │    │  │  5. Bangun augmented prompt      │    │
│          │    │  │  6. Kirim ke Gemini + instruksi  │    │
│          │    │  │     "jawab dari konteks ini"     │    │
│          │    │  │  7. Return jawaban + citation    │    │
│          │    │  │                                  │    │
│ ◀────────┼────┼──│  Response + sumber catatan       │    │
│          │    │  └──────────┬───────────────────────┘    │
│          │    │             │                            │
│          │    │  ┌──────────▼──────────┐                 │
│          │    │  │   Supabase DB       │                 │
│          │    │  │  ┌───────────────┐  │                 │
│          │    │  │  │  notes table  │  │                 │
│          │    │  │  │  (text data)  │  │                 │
│          │    │  │  ├───────────────┤  │                 │
│          │    │  │  │  embeddings   │  │                 │
│          │    │  │  │  (pgvector)   │  │                 │
│          │    │  │  ├───────────────┤  │                 │
│          │    │  │  │  chat_history │  │                 │
│          │    │  │  │  (sessions)   │  │                 │
│          │    │  │  └───────────────┘  │                 │
│          │    │  └─────────────────────┘                 │
│          │    └─────────────────────────────────────────┘
└──────────┘
```

**Karakteristik:**
- Embedding dibuat otomatis saat catatan disimpan/diupdate
- pgvector melakukan similarity search (cosine distance)
- Chat history disimpan di database untuk multi-turn conversation
- AI prompt di-augment dengan catatan relevan + instruksi citation
- Chunking strategy: per catatan (karena catatan = plain text pendek/sticky notes)

---

### Fase 4 — Production Polish

```
Fase 3 Architecture + tambahan:

┌────────────────────────────┐
│     Observability Layer    │
│                            │
│  ┌──────────────────────┐  │
│  │  AI Telemetry        │  │
│  │  - Token usage       │  │
│  │  - Response latency  │  │
│  │  - Retrieval quality │  │
│  │  - Error rates       │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  App Monitoring      │  │
│  │  - Error boundaries  │  │
│  │  - Loading states    │  │
│  │  - Performance       │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

---

## Folder Structure Evolution

### Fase 1 (Vite + React)

```
notes-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── notes/           # Notes-related components
│   │   ├── chat/            # AI chat components
│   │   └── layout/          # Layout components (sidebar, header)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (localStorage helpers, gemini client)
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Global styles + Tailwind + CSS variables
├── public/
├── .agents/                 # Agent context documents
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Fase 2+ (Next.js — struktur berubah total)

```
notes-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/          # Auth-related routes
│   │   └── api/             # API Routes
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── notes/
│   │   ├── chat/
│   │   └── layout/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase/        # Supabase client & helpers
│   │   ├── gemini/          # Gemini API wrapper
│   │   └── utils.ts
│   ├── actions/             # Server Actions
│   ├── types/
│   └── index.css
├── .agents/
├── package.json
├── next.config.ts
└── tsconfig.json
```
