# 🪝 Spesifikasi Rancangan Custom Hooks & Data Flow

Dokumen ini berisi spesifikasi pembagian tugas antara `NotesContext.tsx` dan Custom Hooks di `src/hooks/` untuk mencegah *double logic* dan desinkronisasi state.

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
                       └─ Derived Data (note count, hydrated notes)
                       └─ Filtering & Sorting (Pinned notes teratas, search & route filter)
                       └─ UX Feedback (Toast notifications via sonner)
                              ▲
                              │ Call Hooks
[UI View Layer]        Pages & Components (HomePage, NoteForm, Sidebar, NoteCard)
```

---

## 📋 Detail Spesifikasi Custom Hooks

### 1. `useNotes.ts`
* **Tujuan/Peran:** Mengonsumsi `NotesContext`, menyajikan helper data *hydrated note*, serta membungkus fungsi mutasi catatan dengan UX Feedback (`sonner` Toast).
* **Data/State yang Dikeluarkan:**
  * `notes`: `Note[]` (Daftar seluruh catatan mentah)
  * `getNoteById(id: string)`: `Note | undefined` untuk detail view atau untuk page `/notes/:id`
  * `getHydratedNote(id: string)`: `HydratedNote | undefined` *(Catatan beserta objek lengkap Folder, Category, dan array Tag)*
* **Fungsi / Actions:**
  * `createNote(data: CreateNoteInput)`: Memanggil `addNote` di Context + `toast.success("Catatan berhasil dibuat")`
  * `editNote(id: string, data: UpdateNoteInput)`: Memanggil `updateNote` di Context + `toast.success("Catatan berhasil diperbarui")`
  * `removeNote(id: string)`: Memanggil `deleteNote` di Context + `toast.success("Catatan berhasil dihapus")`
  * `togglePinNote(id: string)`: Mengubah boolean `isPinned` + `toast.info(statusPin ? "Catatan dipin" : "Pin dilepas")`

---

### 2. `useFolders.ts`
* **Tujuan/Peran:** Mengonsumsi `folders` & `notes` dari `NotesContext`, menghitung jumlah catatan per folder  disusul tanggal `updatedAt` terbaru(`noteCount`), dan memberikan Toast feedback.
* **Data/State yang Dikeluarkan:**
  * `folders`: `Folder[]`
  * `foldersWithCount`: `(Folder & { noteCount: number })[]`
* **Fungsi / Actions:**
  * `createFolder(data: CreateFolderInput)`: Memanggil `addFolder` + `toast.success("Folder berhasil dibuat")`
  * `editFolder(id: string, data: UpdateFolderInput)`: Memanggil `updateFolder` + `toast.success("Folder berhasil diubah")`
  * `removeFolder(id: string)`: Memanggil `deleteFolder` + `toast.success("Folder berhasil dihapus")`

---

### 3. `useCategories.ts`
* **Tujuan/Peran:** Mengonsumsi `categories` & `notes` dari Context, menghitung `noteCount` per kategori, dan memberikan Toast feedback.
* **Data/State yang Dikeluarkan:**
  * `categories`: `Category[]`
  * `categoriesWithCount`: `(Category & { noteCount: number })[]`
* **Fungsi / Actions:**
  * `createCategory(data: CreateCategoryInput)`: Memanggil `addCategory` + `toast.success("Kategori berhasil dibuat")`
  * `editCategory(id: string, data: UpdateCategoryInput)`: Memanggil `updateCategory` + `toast.success("Kategori berhasil diubah")`
  * `removeCategory(id: string)`: Memanggil `deleteCategory` + `toast.success("Kategori berhasil dihapus")`

---

### 4. `useTags.ts`
* **Tujuan/Peran:** Mengonsumsi `tags` & `notes` dari Context, menghitung `noteCount` per tag, dan memberikan Toast feedback.
* **Data/State yang Dikeluarkan:**
  * `tags`: `Tag[]`
  * `tagsWithCount`: `(Tag & { noteCount: number })[]`
* **Fungsi / Actions:**
  * `createTag(data: CreateTagInput)`: Memanggil `addTag` + `toast.success("Tag berhasil dibuat")`
  * `editTag(id: string, data: UpdateTagInput)`: Memanggil `updateTag` + `toast.success("Tag berhasil diubah")`
  * `removeTag(id: string)`: Memanggil `deleteTag` + `toast.success("Tag berhasil dihapus")`

---

### 5. `useSearch.ts` (Filtering & Sorting)
* **Tujuan/Peran:** Memfilter daftar catatan secara dinamis berdasarkan pencarian kata kunci & parameter Rute URL (`folderId`, `categoryId`, `tagId`), serta mengurutkannya.
* **Parameters Input:**
  * `notes`: `Note[]`
  * `searchKeyword`: `string`
  * `filterType`: `'all' | 'folder' | 'category' | 'tag'`
  * `filterId`: `string | null`
* **Output:**
  * `filteredNotes`: `Note[]` (Daftar catatan ter-filter, dengan **Pinned Notes (`isPinned: true`) selalu berada di paling atas**)

---

## 🔗 Alur Assign Entitas (Folder, Kategori, Tag) di `NoteForm`

Komponen `NoteForm` (dalam Dialog) memanggil `useFolders()`, `useCategories()`, dan `useTags()` untuk menampilkan opsi dropdown / multi-select:

1. **Mode Edit (`initialData` ada):**
   * Menggunakan `initialData.folderId`, `initialData.categoryId`, dan `initialData.tagIds` untuk mengisi nilai awal form.
2. **Mode Create Baru (`initialData` tidak ada + Smart Defaults):**
   * Membaca parameter Rute URL saat tombol `+ New Note` ditekan:
     * Jika dibuka saat berada di `/folders/:id` → Dropdown Folder otomatis terisi `id` folder tersebut.
     * Jika dibuka saat berada di `/categories/:id` → Dropdown Kategori otomatis terisi `id` kategori tersebut.
     * Jika dibuka saat berada di `/tags/:id` → Multi-select Tag otomatis mencakup `id` tag tersebut.
     * Jika di `/` (HomePage) → Pilihan awal kosong (`null` / `[]`).

---

## 📌 Aturan Utama Integrasi (Mencegah Bentrok)
1. **Zero Duplicate State:** Tidak ada `useState` internal di dalam Custom Hooks untuk menyimpan daftar entitas. Semua hook wajib mengonsumsi data langsung dari `NotesContext`.
2. **Single Storage Sync:** Hanya `NotesContext` yang berinteraksi dengan `useLocalStorage.ts`. Custom Hooks tidak memanggil `saveNotes` atau `saveFolders` secara langsung.
3. **UX Feedback Centralized:** Toast Notification dipicu di level Custom Hooks agar komponen UI (seperti form atau dialog) murni hanya menangani tampilan/submit.
