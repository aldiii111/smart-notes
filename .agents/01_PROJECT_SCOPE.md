# 🎯 Project Scope — AI-Powered Knowledge Base

## Ringkasan Produk

Aplikasi pencatatan pintar (Smart Notes App) fullstack yang dilengkapi dengan AI berbasis Retrieval-Augmented Generation (RAG). Pengguna menyimpan catatan dalam format plain text yang terorganisir (folder, tag, kategori), lalu bisa mengobrol dengan AI yang menjawab secara eksklusif berdasarkan isi catatan tersebut — bukan dari pengetahuan umum AI.

## Target Pengguna

- **Primary**: Developer sendiri (self-use + portfolio showcase)
- **Secondary**: Recruiter / hiring manager yang mengevaluasi portfolio
- Bukan aplikasi untuk publik — tidak perlu optimasi skala besar

## Tujuan Pembelajaran

Menjembatani transisi dari **Frontend Developer** → **Fullstack Developer + Applied AI Engineer** melalui pendekatan pragmatis:

| Aspek | Fokus | Bukan Fokus |
|-------|-------|-------------|
| AI | Merangkai model yang sudah ada (Gemini API) ke produk | Training model dari nol, matematika ML |
| Backend | Server Actions, API Routes, database design | Microservices, message queues, gRPC |
| Data | CRUD → Embedding → Vector Search pipeline | Big data, data warehouse, ETL pipeline |
| Auth | Google OAuth via Supabase Auth | Custom auth server, JWT dari scratch |
| Infra | Supabase managed services (free tier) | Self-hosted DB, Docker, Kubernetes |

---

## Roadmap 4 Fase

### Fase 1 — React Vanilla (Foundation)

**Tujuan**: Bangun UI & logika frontend murni. Pelajari React fundamentals dan integrasi API sederhana.

**Fitur yang dibangun:**

| # | Fitur | Detail |
|---|-------|--------|
| 1 | ✏️ CRUD Catatan | Buat, baca, edit, hapus catatan plain text |
| 2 | 📁 Organisasi | Folder, tag, dan kategori untuk mengelompokkan catatan |
| 3 | 🔍 Search & Filter | Pencarian catatan berdasarkan keyword, filter by tag/folder/kategori |
| 4 | 🤖 AI Chat Umum | Chat dengan Gemini API — belum bisa membaca catatan |
| 5 | 📱 Responsive Design | Layout responsive untuk desktop dan mobile |

**Storage**: LocalStorage (client-side)
**AI**: Direct fetch ke Gemini API dari browser (API key exposed — ini disengaja untuk pembelajaran)

---

### Fase 2 — Next.js Migration (Fullstack)

**Tujuan**: Migrasi ke arsitektur fullstack. Pindahkan data dan API call ke server-side demi keamanan.

**Fitur yang dibangun:**

| # | Fitur | Detail |
|---|-------|--------|
| 6 | 🔐 Google OAuth | Login via Google menggunakan Supabase Auth |
| 7 | 🗄️ Database Migration | Pindahkan semua data catatan dari LocalStorage ke Supabase PostgreSQL |
| 8 | 🔒 Secure AI Call | Pindahkan pemanggilan Gemini API ke Server Actions / API Routes |

**Storage**: Supabase PostgreSQL
**Motivasi migrasi**: API key terekspos di client-side (Fase 1) → harus dipindah ke server

---

### Fase 3 — RAG Implementation (AI Engineering)

**Tujuan**: Implementasi RAG pipeline agar AI bisa menjawab berdasarkan isi catatan pengguna.

**Fitur yang dibangun:**

| # | Fitur | Detail |
|---|-------|--------|
| 9 | 🧠 AI + RAG | AI menjawab pertanyaan berdasarkan catatan yang relevan |
| 10 | 📎 Citation | AI menyertakan referensi sumber catatan dalam jawabannya |
| 11 | 💬 Multi-turn Chat | Percakapan berlanjut dengan memory konteks sebelumnya |

**Vector DB**: Supabase pgvector (extension PostgreSQL, tidak perlu service terpisah)
**Pipeline**: Catatan → Chunking → Embedding (Gemini) → pgvector → Retrieval → Augmented Prompt → Response

---

### Fase 4 — Production Polish

**Tujuan**: Jadikan proyek production-ready dan layak showcase di portfolio.

**Fitur yang dibangun:**

| # | Fitur | Detail |
|---|-------|--------|
| 12 | 📊 AI Telemetry | Logging penggunaan AI, tracking akurasi jawaban, usage metrics |
| 13 | ✨ Polish | Performance optimization, error boundaries, loading states |

---

## Yang TIDAK Dibuat (Out of Scope)

| Item | Alasan |
|------|--------|
| Role-based access (admin/user) | Single-user app, tidak perlu role |
| Rich text / Markdown editor | Catatan plain text saja, menyederhanakan embedding |
| File upload (gambar, PDF) | Fokus pada text-based RAG |
| Real-time collaboration | Single-user, tidak ada kebutuhan multiplayer |
| Mobile native app | Web responsive cukup untuk portfolio |
| Custom AI model training | Fokus Applied AI, bukan ML Engineering |
| Payment / subscription | Bukan produk komersial |
| Dark mode | Light mode saja (meskipun CSS variables sudah disiapkan) |

## Core Features Summary

```
Fase 1: CRUD + Organisasi + Search + AI Chat Umum + Responsive
Fase 2: Google OAuth + Database Migration + Secure AI
Fase 3: RAG + Citation + Multi-turn Chat
Fase 4: Telemetry + Polish
```
