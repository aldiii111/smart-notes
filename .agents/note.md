# 🪝 Spesifikasi Rancangan Custom Hooks & Data Flow (Ultra Lean)

Dokumen ini berisi spesifikasi akhir pembagian tugas antara `NotesContext.tsx`, Custom Hooks sederhana, serta komponen UI (`NoteForm` & `NoteEditor`).

---

## 🏛️ Arsitektur Data Flow 3-Layer

```
[Storage Layer]        useLocalStorage.ts (Fungsi Murni Read/Write JSON)
                              ▲
                              │ Sync saat state berubah
[State & Data Layer]   NotesContext.tsx (Master React State + Atomic CRUD + Relational Integrity)
                              ▲
                              │ useContext(NotesContext)
[Business Logic Layer] Custom Hooks (useNotes, useFolders, useCategories, useTags, useSearch)
                       └─ Wrapper CRUD + UX Feedback (Toast notifications via sonner)
                       └─ Filtering Sederhana (Keyword & Filter ID)
                              ▲
                              │ Call Hooks
[UI View Layer]        Pages & Components (HomePage, NoteForm, NoteEditor, Sidebar, NoteCard)
```

---

## 📋 Detail Spesifikasi Custom Hooks (Ultra Lean)

### 1. `useNotes.ts`
* **Tujuan/Peran:** Mengonsumsi `NotesContext`, menyediakan data `notes` dan wrapper CRUD yang memicu `toast` (`sonner`).
* **Data/State yang Dikeluarkan:**
  * `notes`: `Note[]` (Daftar seluruh catatan mentah)
  * `getNoteById(id: string)`: `Note | undefined` (Diambil oleh `NoteEditor` atau halaman `/notes/:id`)
* **Fungsi / Actions:**
  * `createNote(data: CreateNoteInput)`: Memanggil `addNote` di Context + `toast.success("Catatan berhasil dibuat")`
  * `editNote(id: string, data: UpdateNoteInput)`: Memanggil `updateNote` di Context + `toast.success("Catatan berhasil diperbarui")`
  * `removeNote(id: string)`: Memanggil `deleteNote` di Context + `toast.success("Catatan berhasil dihapus")`

---

### 2. `useFolders.ts`
* **Tujuan/Peran:** Mengonsumsi `folders` dari `NotesContext`, menyediakan wrapper CRUD dan Toast feedback.
* **Data/State yang Dikeluarkan:**
  * `folders`: `Folder[]`
* **Fungsi / Actions:**
  * `createFolder(data: CreateFolderInput)`: Memanggil `addFolder` + `toast.success("Folder berhasil dibuat")`
  * `editFolder(id: string, data: UpdateFolderInput)`: Memanggil `updateFolder` + `toast.success("Folder berhasil diubah")`
  * `removeFolder(id: string)`: Memanggil `deleteFolder` + `toast.success("Folder berhasil dihapus")`

---

### 3. `useCategories.ts`
* **Tujuan/Peran:** Mengonsumsi `categories` dari Context, menyediakan wrapper CRUD dan Toast feedback.
* **Data/State yang Dikeluarkan:**
  * `categories`: `Category[]`
* **Fungsi / Actions:**
  * `createCategory(data: CreateCategoryInput)`: Memanggil `addCategory` + `toast.success("Kategori berhasil dibuat")`
  * `editCategory(id: string, data: UpdateCategoryInput)`: Memanggil `updateCategory` + `toast.success("Kategori berhasil diubah")`
  * `removeCategory(id: string)`: Memanggil `deleteCategory` + `toast.success("Kategori berhasil dihapus")`

---

### 4. `useTags.ts`
* **Tujuan/Peran:** Mengonsumsi `tags` dari Context, menyediakan wrapper CRUD dan Toast feedback.
* **Data/State yang Dikeluarkan:**
  * `tags`: `Tag[]`
* **Fungsi / Actions:**
  * `createTag(data: CreateTagInput)`: Memanggil `addTag` + `toast.success("Tag berhasil dibuat")`
  * `editTag(id: string, data: UpdateTagInput)`: Memanggil `updateTag` + `toast.success("Tag berhasil diubah")`
  * `removeTag(id: string)`: Memanggil `deleteTag` + `toast.success("Tag berhasil dihapus")`

---

### 5. `useSearch.ts` (Filtering Sederhana)
* **Tujuan/Peran:** Memfilter daftar catatan secara sederhana berdasarkan pencarian kata kunci & `filterId` dari rute URL.
* **Parameters Input:** `(notes: Note[], keyword: string, filterId: string | null)`
* **Output:** `filteredNotes: Note[]`

---

## 🎨 Pemisahan Komponen UI: `NoteForm` vs `NoteEditor`

Untuk menjaga kode tetap bersih dan sederhana:

1. **`NoteForm.tsx` (Murni untuk Create Note):**
   * Digunakan di dalam Dialog Popup saat tombol `+ New Note` diklik.
   * State awal form **selalu kosong** (`title: ""`, `content: ""`).
   * Menggunakan **Smart Defaults** berdasarkan rute URL aktif saat ini (misal: jika berada di `/folders/:id`, folder awal otomatis terisi `id` tersebut).
   * Hanya mengimpor dan memanggil **`createNote`** dari `useNotes()`.

2. **`NoteEditor.tsx` (Murni untuk Read & Edit Note):**
   * Digunakan untuk membaca dan mengedit catatan yang sudah ada di `/notes/:id`.
   * Menerima catatan yang akan diedit / mengambil catatan via `getNoteById(id)`.
   * Mengimpor dan memanggil **`editNote`** dari `useNotes()`.

---

## 📌 Aturan Utama Integrasi (Mencegah Bentrok)
1. **Zero Duplicate State:** Tidak ada `useState` internal di dalam Custom Hooks untuk menyimpan daftar entitas. Semua hook wajib mengonsumsi data langsung dari `NotesContext`.
2. **Single Storage Sync:** Hanya `NotesContext` yang berinteraksi dengan `useLocalStorage.ts`.
3. **UX Feedback Centralized:** Toast Notification dipicu di level Custom Hooks.
