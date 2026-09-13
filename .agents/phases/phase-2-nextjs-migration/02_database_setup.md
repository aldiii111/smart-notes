# Fase 2 — Database Setup (Supabase)

> Prerequisite: Next.js project sudah terkonfigurasi (`01_migration_plan.md` step 1)
> Output: Supabase database siap dengan schema, RLS, dan client terkonfigurasi

## Supabase Project Setup

### 1. Buat Project

1. Buka [supabase.com](https://supabase.com) → New Project
2. Pilih region terdekat (Singapore — `ap-southeast-1`)
3. Catat `Project URL` dan `anon key`

### 2. Environment Variables

```env
# .env.local (JANGAN commit ke git)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...    # server-only, JANGAN pakai prefix NEXT_PUBLIC_
GEMINI_API_KEY=your_gemini_api_key          # server-only
```

### 3. SQL Schema

Jalankan SQL dari `03_DATA_MODEL.md` Fase 2 di Supabase SQL Editor:
- Table: `folders`, `categories`, `tags`, `notes`, `note_tags`
- Trigger: `update_updated_at`

### 4. Row Level Security (RLS)

Karena ini single-user app dengan auth, RLS dibuat sederhana:

```sql
-- Enable RLS pada semua tabel
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Policy: hanya authenticated user yang bisa akses
-- (single user, jadi cukup cek apakah user sudah login)
CREATE POLICY "Authenticated users can do everything" ON notes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything" ON folders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything" ON tags
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything" ON note_tags
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## Supabase Client Configuration

### Server Client (untuk Server Actions & API Routes)

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
```

### Browser Client (untuk Auth listener & realtime)

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Google OAuth Setup

### 1. Google Cloud Console

1. Buat project di [console.cloud.google.com](https://console.cloud.google.com)
2. Enable "Google Identity" API
3. Buat OAuth 2.0 Client ID
4. Authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`

### 2. Supabase Auth Configuration

1. Di Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Masukkan Client ID dan Client Secret dari Google Cloud Console

### 3. Auth Implementation

```typescript
// src/lib/supabase/auth.ts
import { createSupabaseBrowserClient } from './client'

export async function signInWithGoogle() {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

## Checklist

- [ ] Supabase project terbuat
- [ ] Environment variables terkonfigurasi di `.env.local`
- [ ] SQL schema dijalankan di Supabase SQL Editor
- [ ] RLS diaktifkan pada semua tabel
- [ ] Server client berfungsi (test query dari Server Action)
- [ ] Browser client berfungsi (test dari client component)
- [ ] Google OAuth terkonfigurasi di Google Cloud Console
- [ ] Google provider enabled di Supabase Auth
- [ ] Login flow berfungsi end-to-end
- [ ] Logout berfungsi
- [ ] Auth callback route (`/auth/callback`) berfungsi
