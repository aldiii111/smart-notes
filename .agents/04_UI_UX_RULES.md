# 🎨 UI/UX Rules — Design System & Layout

## Framework UI

- **Component Library**: shadcn/ui (wajib, tanpa pengecualian)
- **Styling**: Tailwind CSS v4 menggunakan CSS custom properties yang sudah didefinisikan
- **Font**: Inter (sans), JetBrains Mono (mono), Georgia (serif)
- **Mode**: Light mode only (dark mode CSS variables sudah tersedia untuk future use)
- **Inspirasi layout**: Notion-style — clean, spacious, content-focused

## Layout Utama

```
┌─────────────────────────────────────────────────────────┐
│  App Layout                                              │
│                                                          │
│  ┌───────────┐  ┌───────────────────────┐  ┌──────────┐ │
│  │           │  │                       │  │          │ │
│  │  Sidebar  │  │    Main Content       │  │ AI Chat  │ │
│  │  (nav)    │  │    (notes area)       │  │ Sidebar  │ │
│  │           │  │                       │  │          │ │
│  │  - Folders│  │  ┌─────┐ ┌─────┐     │  │ Messages │ │
│  │  - Tags   │  │  │Note │ │Note │     │  │          │ │
│  │  - Cats   │  │  │Card │ │Card │     │  │          │ │
│  │  - note   │  │  └─────┘ └─────┘     │  │          │ │
│  │           │  │  ┌─────┐ ┌─────┐     │  │          │ │
│  │           │  │  │Note │ │Note │     │  │ ┌──────┐ │ │
│  │           │  │  │Card │ │Card │     │  │ │Input │ │ │
│  │           │  │  └─────┘ └─────┘     │  │ └──────┘ │ │
│  └───────────┘  └───────────────────────┘  └──────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Tiga Panel

| Panel | Lebar | Fungsi | Responsive |
|-------|-------|--------|------------|
| **Sidebar (kiri)** | `280px` fixed | Navigasi: folder, tag, kategori, search | Collapsible di mobile |
| **Main Content (tengah)** | Fluid (sisa ruang) | Grid catatan, editor catatan | Full width di mobile |
| **AI Chat (kanan)** | `380px` fixed | Panel chat AI, toggle show/hide | Overlay di mobile |

### Responsive Breakpoints

| Breakpoint | Perilaku |
|------------|----------|
| `≥ 1280px` (xl) | Ketiga panel terlihat |
| `768–1279px` (md–lg) | Sidebar collapsible, AI chat sebagai overlay |
| `< 768px` (sm) | Sidebar & AI chat sebagai drawer/sheet |

---

## CSS Design Tokens

Gunakan CSS variables yang sudah didefinisikan. Jangan membuat warna atau shadow baru secara ad-hoc.

### Warna Utama (Light Mode)

| Token | Nilai | Penggunaan |
|-------|-------|------------|
| `--background` | `oklch(0.9755 0.0067 97.3510)` | Background halaman utama |
| `--foreground` | `oklch(0.2178 0 0)` | Teks utama |
| `--card` | `oklch(1.0000 0 0)` | Background kartu catatan |
| `--card-foreground` | `oklch(0.2178 0 0)` | Teks di dalam kartu |
| `--primary` | `oklch(0.7414 0.0738 84.5946)` | Aksen utama, tombol CTA |
| `--primary-foreground` | `oklch(1.0000 0 0)` | Teks di atas primary |
| `--secondary` | `oklch(0.9096 0.0167 91.5611)` | Background elemen sekunder |
| `--muted` | `oklch(0.9459 0.0165 91.5544)` | Background muted / disabled |
| `--muted-foreground` | `oklch(0.5022 0.0278 85.7741)` | Teks muted / placeholder |
| `--accent` | `oklch(0.7414 0.0738 84.5946)` | Highlight, hover state |
| `--destructive` | `oklch(0.5680 0.2002 26.4057)` | Aksi berbahaya (hapus) |
| `--border` | `oklch(0.8986 0.0258 97.1423)` | Garis pembatas |
| `--input` | `oklch(0.8986 0.0258 97.1423)` | Border input field |
| `--ring` | `oklch(0.7414 0.0738 84.5946)` | Focus ring |

### Sidebar Tokens

| Token | Penggunaan |
|-------|------------|
| `--sidebar` | Background sidebar |
| `--sidebar-foreground` | Teks sidebar |
| `--sidebar-primary` | Item aktif di sidebar |
| `--sidebar-accent` | Hover state sidebar item |
| `--sidebar-border` | Border sidebar |

### Shadow System

| Token | Penggunaan |
|-------|------------|
| `--shadow-sm` | Kartu catatan default |
| `--shadow-md` | Kartu catatan hover |
| `--shadow-lg` | Modal, popover |
| `--shadow-xl` | Dropdown menu |

### Border Radius

| Token | Nilai |
|-------|-------|
| `--radius-sm` | `calc(0.75rem - 4px)` = `8px` |
| `--radius-md` | `calc(0.75rem - 2px)` = `10px` |
| `--radius-lg` | `0.75rem` = `12px` |
| `--radius-xl` | `calc(0.75rem + 4px)` = `16px` |

---

## Komponen shadcn/ui yang Wajib Digunakan

Jangan membuat komponen custom jika shadcn/ui sudah menyediakan.

| Kebutuhan | Komponen shadcn/ui |
|-----------|--------------------|
| Tombol aksi | `Button` |
| Input teks | `Input`, `Textarea` |
| Dialog konfirmasi | `AlertDialog` |
| Form catatan | `Dialog` + `Input` + `Textarea` |
| Dropdown menu | `DropdownMenu` |
| Sidebar navigasi | `Sidebar` (shadcn sidebar component) |
| Toast notification | `Sonner` |
| Badge/label tag | `Badge` |
| Search | `Input` dengan icon search |
| Tooltip | `Tooltip` |
| Skeleton loading | `Skeleton` |
| Sheet (mobile drawer) | `Sheet` |
| Scroll area | `ScrollArea` |
| Separator | `Separator` |
| Card catatan | `Card` |

---

## Pola Interaksi

### Notes CRUD

| Aksi | UI Pattern |
|------|------------|
| Buat catatan baru | Tombol `+` di header → `Dialog` dengan form |
| Lihat catatan | Klik kartu → expand di Main Content area |
| Edit catatan | Inline edit di expanded view, auto-save on blur |
| Hapus catatan | Tombol delete → `AlertDialog` konfirmasi |
| Pin catatan | Toggle icon pin di kartu |
| Assign tag | Multi-select dropdown di form catatan |
| Pindah folder | Dropdown select di form catatan |

### AI Chat Sidebar

| Aksi | UI Pattern |
|------|------------|
| Buka chat | Toggle button di header / keyboard shortcut |
| Kirim pesan | Input di bawah chat panel + tombol send / Enter |
| Lihat citation | Badge link di bawah jawaban AI → klik untuk jump ke catatan |
| Chat baru | Tombol "New Chat" di atas chat panel |
| Chat history | List session di atas area chat (Fase 3+) |

### Search & Filter

| Aksi | UI Pattern |
|------|------------|
| Search keyword | Input search di atas main content |
| Filter by folder | Klik folder di sidebar |
| Filter by tag | Klik tag di sidebar |
| Filter by category | Klik kategori di sidebar |
| Clear filter | Tombol "All Notes" di sidebar |

---

## Aturan Visual yang Tidak Boleh Dilanggar

1. **Jangan membuat warna inline** — selalu gunakan CSS variable token
2. **Jangan membuat komponen dari nol** jika shadcn/ui punya equivalent-nya
3. **Semua interaksi harus punya feedback visual** — hover state, focus ring, loading state
4. **Semua aksi destruktif wajib konfirmasi** via `AlertDialog`
5. **Toast notification** untuk feedback setelah aksi berhasil (save, delete, update)
6. **Skeleton loading** untuk semua state yang menunggu data
7. **Empty state** harus informatif — jangan biarkan area kosong tanpa pesan
8. **Spacing konsisten** — gunakan Tailwind spacing scale (`p-4`, `gap-3`, dll), jangan custom pixel
9. **Transisi halus** — gunakan `transition-all duration-200` untuk hover/state changes
10. **Jangan gunakan inline style** — semua styling via Tailwind classes
