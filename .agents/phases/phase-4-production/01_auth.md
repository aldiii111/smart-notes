# Fase 4 — Authentication Polish

> Prerequisite: Fase 3 selesai sepenuhnya
> Output: Auth flow yang polished dan production-ready

## Scope

Fase 4 bukan penambahan fitur baru yang besar, melainkan **polish dan hardening** dari semua yang sudah dibangun.

### Auth Polish

| Item | Detail |
|------|--------|
| Login page UI | Halaman login yang clean dengan branding app |
| Session management | Auto-refresh token, handle expired session gracefully |
| Protected routes | Middleware yang redirect ke login jika belum auth |
| Loading states | Skeleton saat checking auth status |
| Error handling | Pesan error yang jelas jika OAuth gagal |
| Logout flow | Logout dari semua tab (broadcast channel) |

### Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect ke login jika belum auth
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect ke home jika sudah auth tapi akses /login
  if (session && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/callback).*)'],
}
```

## Checklist

- [ ] Login page dengan UI yang polished
- [ ] OAuth error handling yang informatif
- [ ] Session auto-refresh berfungsi
- [ ] Middleware redirect berfungsi
- [ ] Loading skeleton saat auth check
- [ ] Logout berfungsi di semua tab
