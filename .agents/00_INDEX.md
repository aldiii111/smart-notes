# 🧠 .agents — AI Agent Context Index

> Dokumen ini adalah peta navigasi untuk seluruh konteks proyek.
> Baca file ini PERTAMA sebelum melakukan apapun.

## Dokumen Global

| File | Fungsi |
|------|--------|
| [01_PROJECT_SCOPE.md](./01_PROJECT_SCOPE.md) | Ringkasan produk, target user, roadmap 4 fase, pembagian fitur per fase |
| [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) | Arsitektur teknis global — stack, diagram, evolusi per fase |
| [03_DATA_MODEL.md](./03_DATA_MODEL.md) | Skema data, relasi entitas, evolusi storage per fase |
| [04_UI_UX_RULES.md](./04_UI_UX_RULES.md) | Design system, CSS variables, komponen wajib, layout rules |
| [05_CODING_STANDARDS.md](./05_CODING_STANDARDS.md) | Konvensi kode, TypeScript rules, error handling, larangan |

## Dokumen Per Fase

| Fase | Direktori | Fokus Pembelajaran |
|------|-----------|-------------------|
| Fase 1 | [phases/phase-1-react-vanilla/](./phases/phase-1-react-vanilla/) | React + Vite, LocalStorage CRUD, Direct Gemini API |
| Fase 2 | [phases/phase-2-nextjs-migration/](./phases/phase-2-nextjs-migration/) | Next.js App Router, Supabase, Server Actions, Google OAuth |
| Fase 3 | [phases/phase-3-rag-implementation/](./phases/phase-3-rag-implementation/) | Embedding, pgvector, RAG pipeline, citation |
| Fase 4 | [phases/phase-4-production/](./phases/phase-4-production/) | Telemetry, logging, production polish |

## Aturan untuk Agent

1. **Baca dokumen global** sebelum mengerjakan tugas apapun
2. **Baca dokumen fase** yang relevan sebelum menulis kode untuk fase tersebut
3. **Jangan lompat fase** — setiap fase punya prerequisite dari fase sebelumnya
4. **Ikuti coding standards** tanpa pengecualian
5. **Gunakan design system** yang sudah didefinisikan, jangan buat token/style baru secara ad-hoc
