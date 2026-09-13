# Fase 1 — Notes CRUD

> Prerequisite: `01_setup.md` selesai
> Output: Fitur CRUD catatan lengkap dengan organisasi (folder, tag, kategori)

## Scope Fitur

### Notes CRUD

| Operasi | Detail |
|---------|--------|
| **Create** | Buat catatan baru via Dialog form (title + content + folder + category + tags) |
| **Read** | Tampilkan semua catatan sebagai grid kartu, klik untuk expand |
| **Update** | Edit catatan inline di expanded view, perubahan disimpan ke LocalStorage |
| **Delete** | Hapus catatan dengan konfirmasi AlertDialog |
| **Pin** | Toggle pin catatan — pinned notes tampil di atas |

### Organisasi

| Entity | Operasi | Lokasi UI |
|--------|---------|-----------|
| **Folder** | CRUD + assign ke note | Sidebar kiri |
| **Category** | CRUD + assign ke note | Sidebar kiri / dropdown di form |
| **Tag** | CRUD + assign (many-to-many) | Badge di kartu + multi-select di form |

### Search & Filter

| Filter | Mekanisme |
|--------|-----------|
| Keyword search | Filter `note.title` dan `note.content` yang mengandung keyword |
| By folder | Tampilkan notes dengan `folderId` matching |
| By category | Tampilkan notes dengan `categoryId` matching |
| By tag | Tampilkan notes yang `tagIds` mengandung tag tersebut |
| All notes | Reset semua filter |

---

## Data Flow

```
User Action → Event Handler → LocalStorage Write → State Update → Re-render
                                                          ↑
                                                   useLocalStorage hook
                                                   (sync state ↔ storage)
```

## Komponen yang Dibangun

```
components/notes/
├── NoteCard.tsx          # Kartu catatan di grid (title, preview, tags, date)
├── NoteList.tsx          # Grid container untuk NoteCard
├── NoteEditor.tsx        # Expanded view untuk baca/edit catatan
├── NoteForm.tsx          # Form di dalam Dialog untuk create/edit
└── NoteEmptyState.tsx    # State ketika tidak ada catatan

components/layout/
├── AppLayout.tsx         # Layout 3-panel utama
├── AppSidebar.tsx        # Sidebar kiri (folders, tags, categories)
├── AppHeader.tsx         # Header dengan search, tombol new note, toggle AI
└── SearchBar.tsx         # Input search dengan filter logic

hooks/
├── useNotes.ts           # CRUD operations untuk notes
├── useFolders.ts         # CRUD operations untuk folders
├── useCategories.ts      # CRUD operations untuk categories
├── useTags.ts            # CRUD operations untuk tags
├── useLocalStorage.ts    # Generic hook: sync state ↔ localStorage
└── useSearch.ts          # Search & filter logic

contexts/
├── NotesContext.tsx       # Shared state: notes, folders, tags, categories
└── FilterContext.tsx      # Active folder/tag/category filter
```

## Aturan Khusus Fase 1

1. **Semua data di LocalStorage** — lihat `03_DATA_MODEL.md` Fase 1 untuk format
2. **Tidak ada async operation** untuk data — LocalStorage bersifat synchronous
3. **ID dibuat di client** menggunakan `crypto.randomUUID()`
4. **Timestamp dibuat di client** menggunakan `new Date().toISOString()`
5. **Optimistic update** — state diupdate langsung, lalu persist ke LocalStorage

## Checklist

- [ ] `useLocalStorage` hook berfungsi (generic, reusable)
- [ ] Notes CRUD lengkap (create, read, update, delete)
- [ ] Pin/unpin berfungsi
- [ ] Folder CRUD + assign note ke folder
- [ ] Category CRUD + assign note ke category
- [ ] Tag CRUD + assign tag ke note (many-to-many)
- [ ] Search by keyword berfungsi
- [ ] Filter by folder / category / tag berfungsi
- [ ] Empty state tampil saat tidak ada catatan
- [ ] Konfirmasi hapus via AlertDialog
- [ ] Toast notification setelah setiap aksi CRUD
- [ ] Responsive layout berfungsi
