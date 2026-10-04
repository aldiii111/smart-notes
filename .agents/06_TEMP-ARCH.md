# 🏗️ Arsitektur UI/UX & Data Flow (Revisi Ultra Lean)

Dokumen ini adalah patokan arsitektur untuk Fase 1 berdasarkan hasil revisi rancangan (Ultra Lean: tanpa `filterType`, tanpa `noteCount`, tanpa `pinned`, pemisahan `NoteForm` & `NoteEditor`).

## 1. Struktur Routing & Navigasi (App.tsx)

Pendekatan rute langsung (Direct Routing) tanpa halaman *list* penengah. Navigasi utama dikendalikan oleh **Sidebar**.

*   **`/` (HomePage):** Merender semua `NoteCard`.
*   **`/folders/:id` (FolderPage):** Merender `NoteCard` yang difilter berdasarkan Folder ID.
*   **`/tags/:id` (TagPage):** Merender `NoteCard` yang difilter berdasarkan Tag ID.
*   **`/categories/:id` (CategoryPage):** Merender `NoteCard` yang difilter berdasarkan Category ID.
*   **`/notes/:id` (NotePage):** Merender detail catatan spesifik & editing via `NoteEditor`.

> **Catatan UI:** `MainSidebar` menampilkan 3 menu Collapsible / Dropdown (Folders, Categories, Tags). Mengklik item di dalam dropdown akan bernavigasi ke `/folders/:id`, `/categories/:id`, atau `/tags/:id`.

## 2. Alur Interaksi Komponen (User Journey)

### A. Melihat Daftar Catatan
Komponen `HomePage`, `FolderPage`, `TagPage`, dan `CategoryPage`:
1. Mengambil parameter ID dari URL (`useParams`).
2. Memanggil `useSearch(notes, keyword, filterId)` untuk mendapatkan `filteredNotes`.
3. Mengoper `filteredNotes` ke komponen `<NoteList />` untuk dirender.

### B. Membaca & Mengedit Catatan (NotePage / NoteEditor)
1. User mengklik `<NoteCard />` -> Navigasi ke `/notes/:id`.
2. Komponen `<NoteEditor />` dipanggil untuk membaca dan mengedit catatan tersebut.
3. Mengedit catatan memanggil `editNote(id, updatedData)` dari `useNotes()`.
4. Data di Context terupdate -> UI otomatis merender data terbaru + Toast sukses muncul.

### C. Membuat Catatan Baru (`NoteForm`)
1. Tombol `+ New Note` di Header memicu Dialog **`<NoteForm />`** murni untuk pembuatan catatan baru.
2. Memiliki fitur *Smart Defaults* berdasarkan rute URL aktif saat ini.
3. Memanggil `createNote(newData)` dari `useNotes()` -> Dialog tutup + Toast sukses muncul.

## 3. Alur Data & Reaktivitas (Ultra Lean 3-Layer)

1. **`useLocalStorage.ts`**: Helper murni `getItem` & `setItem` synchronous.
2. **`NotesContext.tsx`**: Single Source of Truth untuk state (`notes`, `folders`, `categories`, `tags`) + mutasi atomic + relasi hapus.
3. **Custom Hooks (`useNotes`, `useFolders`, `useCategories`, `useTags`, `useSearch`)**:
   - Membungkus mutasi Context dengan Toast notifications (`sonner`).
   - Menyajikan array entitas mentah (`notes`, `folders`, `categories`, `tags`).
   - Tanpa logic `noteCount`, tanpa `pinned`, tanpa `filterType`.
4. **Pages / Components**: Memanggil Custom Hooks, menggunakan `.find()` langsung jika butuh nama entitas pada kartu.

> Detail lengkap spesifikasi dapat dilihat di [note.md](file:///home/aldiii/Documents/learning/project/notes-app/.agents/note.md).