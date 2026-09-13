# Fase 2 — Migration Plan (React → Next.js)

> Prerequisite: Fase 1 selesai sepenuhnya
> Output: Aplikasi berjalan di Next.js App Router dengan semua fitur Fase 1 tetap berfungsi

## Motivasi Migrasi

| Masalah di Fase 1 | Solusi di Fase 2 |
|--------------------|-----------------|
| API key Gemini exposed di browser | Environment variable di server (`process.env`) |
| Data hilang jika clear browser | Database persisten (Supabase PostgreSQL) |
| Tidak ada autentikasi | Google OAuth via Supabase Auth |
| Tidak ada relational integrity | Foreign keys, constraints di PostgreSQL |
| Semua logika di client | Server Actions & API Routes |

## Strategi Migrasi

**Approach: Incremental Migration** — bukan rewrite dari nol. Komponen React UI yang sudah dibuat di Fase 1 dipindahkan dan diadaptasi.

### Urutan Migrasi

```
1. Setup Next.js project baru (App Router)
   ├── Pindahkan shadcn/ui components
   ├── Pindahkan CSS / design tokens
   └── Pastikan layout 3-panel ter-render

2. Setup Supabase
   ├── Buat project di Supabase Dashboard
   ├── Jalankan SQL schema (dari 03_DATA_MODEL.md Fase 2)
   ├── Konfigurasi Supabase client (server + client)
   └── Setup environment variables

3. Migrasi Data Layer
   ├── Ganti useLocalStorage → Supabase queries
   ├── Buat Server Actions untuk CRUD
   └── Update hooks untuk call Server Actions

4. Setup Google OAuth
   ├── Konfigurasi Google Cloud Console
   ├── Enable Google provider di Supabase Auth
   ├── Buat login page
   ├── Implementasi auth middleware
   └── Proteksi routes

5. Migrasi Gemini API
   ├── Pindahkan API call ke API Route / Server Action
   ├── Hapus VITE_GEMINI_API_KEY dari client
   └── Gunakan GEMINI_API_KEY (server-only env var)

6. Verifikasi
   ├── Semua fitur Fase 1 berfungsi
   ├── API key tidak terexpose di client bundle
   ├── Login/logout berfungsi
   └── Data persist di database
```

## File Mapping (Fase 1 → Fase 2)

| Fase 1 (Vite) | Fase 2 (Next.js) | Perubahan |
|----------------|------------------|-----------|
| `src/App.tsx` | `src/app/layout.tsx` + `src/app/page.tsx` | Dipecah ke layout dan page |
| `src/main.tsx` | Tidak ada (Next.js handle) | Dihapus |
| `src/index.css` | `src/app/globals.css` | Rename + pindah |
| `src/components/ui/` | `src/components/ui/` | Sama (shadcn/ui) |
| `src/components/notes/` | `src/components/notes/` | Tambah `"use client"` |
| `src/components/chat/` | `src/components/chat/` | Tambah `"use client"` |
| `src/hooks/useLocalStorage.ts` | Dihapus | Diganti Supabase |
| `src/hooks/useNotes.ts` | `src/hooks/useNotes.ts` | Refactor ke Server Actions |
| `src/lib/geminiClient.ts` | `src/lib/gemini/server.ts` | Pindah ke server-only |
| `vite.config.ts` | `next.config.ts` | Framework config baru |

## Aturan Khusus Fase 2

1. **Server Components by default** — tambahkan `"use client"` hanya jika komponen butuh interaktivitas (state, event handler, hooks)
2. **Server Actions untuk mutasi** — semua create/update/delete via Server Actions
3. **API Routes untuk operasi kompleks** — streaming AI response, webhook
4. **Environment variables** — gunakan `process.env` (tanpa prefix `NEXT_PUBLIC_`) untuk secret
5. **Supabase client** — buat 2 instance: server client (untuk Server Actions) dan browser client (untuk auth listener)

## Checklist

- [ ] Next.js project terkonfigurasi dengan App Router
- [ ] shadcn/ui dan design tokens berfungsi
- [ ] Layout 3-panel ter-render
- [ ] Supabase project dibuat dan SQL schema dijalankan
- [ ] CRUD notes berfungsi via Server Actions + Supabase
- [ ] Folder, Category, Tag CRUD berfungsi
- [ ] Search & filter berfungsi
- [ ] Google OAuth login/logout berfungsi
- [ ] Route protection (redirect ke login jika belum auth)
- [ ] Gemini API dipanggil dari server (API key aman)
- [ ] AI chat streaming berfungsi
- [ ] `next build` berhasil tanpa error
