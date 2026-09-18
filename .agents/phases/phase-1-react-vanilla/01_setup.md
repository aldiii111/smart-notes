# Fase 1 — Setup Project

> Prerequisite: Tidak ada (fase pertama)
> Output: Project Vite + React + TypeScript + Tailwind v4 + shadcn/ui yang siap dikembangkan

## Status Saat Ini

Project sudah di-init dengan:
- Vite 8 + React 19 + TypeScript 6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- oxlint
- pnpm
- CSS design tokens sudah didefinisikan di `index.css`

## Yang Perlu Ditambahkan

### 1. shadcn/ui

Install dan konfigurasi shadcn/ui. Pastikan menggunakan CSS variables yang sudah didefinisikan.

Komponen yang dibutuhkan di Fase 1:
- `Button`
- `Input`
- `Textarea`
- `Card`
- `Dialog`
- `AlertDialog`
- `DropdownMenu`
- `Badge`
- `Tooltip`
- `Skeleton`
- `Sheet`
- `ScrollArea`
- `Separator`
- `Sidebar` (shadcn sidebar)
- `Sonner` (toast)

### 2. Path Alias

Konfigurasi `@/` path alias di `tsconfig.app.json` dan `vite.config.ts`.

### 3. React Router

Install `react-router` untuk client-side routing.

Routes yang dibutuhkan:
```
/              → Dashboard (semua catatan)
/folder/:id   → Catatan dalam folder tertentu
/tag/:id        → Catatan dalam tag tertentu
/category/:id   → Catatan dalam category tertentu
/note/:id     → Detail/edit catatan
```

### 4. Folder Structure

Buat folder structure sesuai `02_ARCHITECTURE.md` Fase 1:

```
src/
├── components/
│   ├── ui/          # shadcn/ui components (auto-generated)
│   ├── notes/       # NoteCard, NoteEditor, NoteList, NoteForm
│   ├── chat/        # ChatSidebar, ChatMessage, ChatInput
│   └── layout/      # AppLayout, Sidebar, Header
├── hooks/           # useNotes, useLocalStorage, useFolders, useTags
├── lib/             # geminiClient, localStorage helpers, utils
├── types/           # note.ts, chat.ts, folder.ts, tag.ts, category.ts
├── contexts/        # NotesContext, ChatContext
├── App.tsx
├── main.tsx
└── index.css
```

## Checklist

- [ ] shadcn/ui terinstall dan terkonfigurasi
- [ ] Path alias `@/` berfungsi
- [ ] React Router terinstall dengan routes dasar
- [ ] Folder structure terbuat
- [ ] Type definitions terbuat di `src/types/`
- [ ] Layout dasar (3-panel) ter-render tanpa error
- [ ] `pnpm build` berhasil tanpa error
