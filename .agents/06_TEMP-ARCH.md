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

## 3. Alur Data & Reaktivitas (Context Pipeline)

Untuk mencegah UI yang *stale* (tidak update saat LocalStorage berubah), kita menggunakan **Context API** sebagai *Single Source of Truth*.

**Alur Pipa Data (Bottom-Up):**

1. **`useLocalStorage` (Storage Layer)**
   *Tugas:* Murni melakukan `localStorage.getItem` dan `localStorage.setItem`. Tidak menyimpan state React.
   
2. **`NotesContext` (State Management Layer)**
   *Tugas:* 
   - Saat aplikasi dimuat (mount), ambil data dari `useLocalStorage` dan simpan ke dalam `useState` (React State).
   - Menyediakan fungsi mutasi (seperti `addNote`, `updateNote`).
   - *Logic mutasi:* Update React State terlebih dahulu, **lalu** panggil `useLocalStorage` untuk persistensi (menyimpan permanen).
   
3. **`useNotes`, `useFolders`, dll (Entity Hooks / Business Logic Layer)**
   *Tugas:* 
   - Hook ini *mengonsumsi* (consume) data dari `NotesContext`, BUKAN memanggil local storage secara langsung.
   - Menyediakan fungsi spesifik (seperti `getNotesByFolderId(id)`).
   
4. **Pages / Components (UI Layer)**
   *Tugas:* Memanggil Entity Hooks untuk mendapatkan data reaktif, dan memberikan aksi (seperti submit form) kembali ke Hooks.

### (Hint) Contoh Alur di Context:
```tsx
// Di dalam NotesContext.tsx (HINT ONLY)
const [notes, setNotes] = useState(initialNotesFromLocalStorage);

const updateNote = (updatedData) => {
   // 1. Update React State agar UI reaktif
   const newNotes = notes.map(n => n.id === updatedData.id ? updatedData : n);
   setNotes(newNotes);
   // 2. Simpan ke LocalStorage via fungsi helper
   saveToLocalStorage(newNotes); 
};
```