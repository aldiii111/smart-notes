# 🏗️ Arsitektur UI/UX & Data Flow (Revisi)

Dokumen ini adalah patokan arsitektur untuk Fase 1 berdasarkan hasil revisi rancangan (Meniadakan UI redundant, menggunakan Context untuk reaktivitas, dan Popup/Dialog logic).

## 1. Struktur Routing & Navigasi (App.tsx)

Pendekatan rute langsung (Direct Routing) tanpa halaman *list* penengah. Navigasi utama dikendalikan oleh **Sidebar**.

*   **`/` (HomePage):** Merender semua `NoteCard`.
*   **`/folders/:id` (FolderPage):** Merender `NoteCard` yang difilter berdasarkan Folder ID.
*   **`/tags/:id` (TagPage):** Merender `NoteCard` yang difilter berdasarkan Tag ID.
*   **`/categories/:id` (CategoryPage):** Merender `NoteCard` yang difilter berdasarkan Category ID.
*   **`/notes/:id` (NotePage):** Merender detail catatan spesifik (*Read-only view*).

> **Catatan UI:** `MainSidebar` akan menampilkan *scrollable list / dropdown* untuk Folders, Tags, dan Categories. Mengklik item di sidebar langsung men-trigger navigasi dropdown scrollable yang nge map seluruh isi folder, dan isi tag, category nya masing masing ketiga tombol, yang mana jika di klik salah satu isi dari mapingan yang scrolable tersebut akan ke rute `/:id` di atas. (Folder `src/components/filter` **dihapus** karena filter terjadi secara natural via URL Parameter).

## 2. Alur Interaksi Komponen (User Journey)

### A. Melihat Daftar Catatan
Komponen `HomePage`, `FolderPage`, `TagPage`, dan `CategoryPage` memiliki struktur identik:
1. Mengambil parameter ID dari URL (jika ada).
2. Memanggil data yang **sudah difilter** dari Hooks.
3. Mengoper data tersebut ke komponen `<NoteList />` yang akan merender `<NoteCard />` berulang kali.

### B. Membaca & Mengedit Catatan (NotePage)
1. User mengklik `<NoteCard />` -> Navigasi ke `/notes/:id`.
2. `<NotePage />` merender isi catatan (Judul, Konten, Metadata) secara biasa (teks statis/read-only).
3. Terdapat tombol **"Edit"**.
4. Mengklik "Edit" membuka **Popup/Dialog** berisi `<NoteForm />` yang sudah di-*populate* (terisi) dengan data catatan tersebut.
5. Saat di-save: Popup menutup -> Data di Context terupdate -> UI `NotePage` otomatis merender ulang data terbaru.

### C. Membuat Catatan Baru (Contextual `+ New Note`)
Tombol `+ New Note` diletakkan di UI global (misal: di Header/Navbar atas agar selalu terlihat).
Tombol ini memicu **Popup/Dialog `<NoteForm />`** kosong, dengan fitur cerdas (Smart Defaults):
*   Jika ditekan saat di `/` -> Dropdown folder/tag di form kosong.
*   Jika ditekan saat di `/folders/work` -> Dropdown folder di form **otomatis terpilih** "Work".

## 3. Alur Data & Reaktivitas (Context Pipeline & 3-Layer Architecture)

Untuk mencegah UI yang *stale* dan menghindari *double logic*, kita menggunakan **Architecture Pipeline 3-Layer** dengan **Context API** sebagai *Single Source of Truth*.

**Alur Pipa Data (Bottom-Up):**

1. **`useLocalStorage.ts` (Storage Layer)**
   *Tugas:* Murni melakukan `localStorage.getItem` dan `localStorage.setItem`. Tidak menyimpan React State.

2. **`NotesContext.tsx` (State Management & Master Data Layer)**
   *Tugas:* 
   - Menjadi *Single Source of Truth* untuk React State (`notes`, `folders`, `categories`, `tags`).
   - Menyediakan fungsi mutasi atomic dasar (`addNote`, `updateNote`, `deleteNote`, dll.).
   - Menjaga **Integritas Relasi** (Cascade reset `folderId`/`categoryId` ke `null`, serta memfilter `tagIds` saat entitas dihapus).
   - Menyimpan otomatis ke `useLocalStorage` setiap kali React State berubah.

3. **Custom Hooks (`useNotes`, `useFolders`, `useCategories`, `useTags`, `useSearch`) (Business Logic & UX Layer)**
   *Tugas:* 
   - Mengonsumsi data dari `NotesContext` (BUKAN memanggil `localStorage` secara langsung).
   - Menyajikan *Derived Data* (seperti `noteCount` per folder/kategori/tag, dan *hydrated notes*).
   - Membungkus fungsi mutasi dengan **UX Feedback** (`sonner` Toast Notifications).
   - **TIDAK menyimpan React state duplikat** untuk daftar entitas.

4. **Pages / Components (UI Layer)**
   *Tugas:* Memanggil Custom Hooks untuk mendapatkan data reaktif dan menjalankan aksi CRUD. `NoteForm` memanfaatkan data dari `useFolders()`, `useCategories()`, dan `useTags()` untuk opsi dropdown/select, dengan fitur *Smart Defaults* berdasarkan rute aktif saat membuat catatan baru.

> Detail lengkap pembagian fungsi dan tanggung jawab masing-masing hook dapat dilihat di [note.md](file:///home/aldiii/Documents/learning/project/notes-app/.agents/note.md).