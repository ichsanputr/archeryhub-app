# App Middleware Documentation

All auth logic lives in **one server middleware** (SSR-only). There are no route middlewares.

---

## Avatar URL di header (LandingHeader): dari mana?

**Alur singkat:** `avatar_url` yang dipakai di header (dan `useAuth().user`) **bukan** dari API call tiap request, tapi dari **payload JWT** yang di-decode di server middleware.

1. **Saat login** (email atau Google): request ke **API (Go)** → API baca user dari DB → panggil `utils.MaskMediaURL(avatar_url)` → **`MaskMediaURL` pakai env `API_BASE_URL`** di API (`api/utils/media.go`). Hasilnya (URL penuh) dimasukkan ke JWT (claim `avatar`) dan ke response login.
2. **Setiap request ke Nuxt:** `server/middleware/auth.global.ts` baca cookie `auth_token` → decode JWT → set `event.context.user` (termasuk `avatar_url: payload.avatar`). Plugin `auth.server.ts` mengisi `useState('auth.user')` dari context → payload HTML → client.
3. **LandingHeader.vue** pakai `useAuth().user` → `user.avatar_url` dipakai di `<img :src="user.avatar_url">`. Tidak ada masking di frontend; URL persis dari JWT.

**Kenapa di local bisa dapat URL prod (`https://api.archeryhub.id/...`)?**

- URL itu ditentukan oleh **API yang mengeluarkan JWT** (saat login), lewat **`API_BASE_URL`** di env API.
- Jika frontend local memakai **API production** (`apiBaseUrl = https://api.archeryhub.id`), maka saat login request ke API prod → JWT dibuat oleh API prod → `avatar` di JWT = `MaskMediaURL(...)` dengan `API_BASE_URL` prod → **wajar dapat URL prod**.
- Jika ingin URL **local** saat dev: jalankan API **lokal** dengan `API_BASE_URL=http://localhost:8001` di `api/.env`, arahkan Nuxt ke API lokal, lalu **login lagi** agar dapat JWT baru yang berisi avatar URL local.

---

## Single file: `server/middleware/auth.global.ts`

**Path:** `app/server/middleware/auth.global.ts`  
**Type:** Nitro/H3 server middleware (global — runs on every request to the Nuxt server)  
**Runs:** Server only (SSR). No client-side auth checks.

### What it does (in order)

1. **Skip non-page requests**  
   Returns immediately for URLs that are not app pages (e.g. `/_nuxt/*`, `/__nuxt/*`), so assets and internal Nitro routes are not touched.

2. **Resolve user from JWT**  
   - Reads the `auth_token` cookie.  
   - Decodes the JWT payload (no signature verification; backend is trusted).  
   - Sets `event.context.user` with: `id`, `email`, `full_name`, `avatar_url`, `role`, `user_type`.  
   - If no token or invalid payload, sets `event.context.user = null`.

3. **Auth pages (`/auth/*`)**  
   If the user is logged in, redirects to `/dashboard` (302).  
   So logged-in users never see login/register.

4. **Public routes**  
   No redirect for: `/`, `/tournaments`, `/about`.

5. **Protected routes**  
   If the path is protected and there is no user, redirects to:
   - `/auth/login?redirect=<encoded full URL>`
   - Protected paths: `/dashboard`, `/profile`, any `/register` (except under `/auth`), any `/payment`.

### Protected vs public

- **Protected:** `/dashboard`, `/profile`, paths containing `/register` (except `/auth/...`), paths containing `/payment`.  
- **Public:** `/`, `/auth/*`, `/tournaments`, `/about`.  
- Everything else is not treated as protected; no redirect.

### Flow

```
HTTP Request
    │
    ▼
server/middleware/auth.global.ts
    │
    ├─ Skip non-page (_nuxt, __nuxt, etc.)
    ├─ Decode auth_token cookie → event.context.user
    ├─ /auth/* + user → redirect /dashboard
    ├─ public route → continue
    ├─ protected + no user → redirect /auth/login?redirect=...
    └─ else → continue
    │
    ▼
  Page / API
```

### Bagaimana global state user terisi (tanpa hit API)

1. **Server:** Setiap request masuk → `server/middleware/auth.global.ts` jalan → baca cookie `auth_token`, decode JWT → set **`event.context.user`**.
2. **SSR:** Plugin **`plugins/auth.server.ts`** jalan (server-only) → baca `useRequestEvent()?.context?.user` → set **`useState('auth.user', () => user)`**. Nilai ini ikut di-serialize ke payload HTML.
3. **Client:** Saat hydration, **`useState('auth.user')`** di `useAuth()` dapat nilai dari payload (sama dengan yang di server). Jadi **tidak ada panggilan API** untuk isi user; cukup dari payload.
4. **`plugins/auth.client.js`** memanggil `initializeAuth()`; karena `user` sudah ada dari payload, `fetchUser()` tidak dipanggil.

Ringkas: **Middleware → event.context.user → plugin server isi useState → payload → client.** User global state terisi tanpa hit API.

---

## Removed files (migrated into the single file above)

| Old file | Role (before migration) |
|----------|---------------------------|
| `middleware/auth.global.ts` | Route middleware: protect dashboard/profile/register/payment; redirect to login. |
| `middleware/redirect-auth.global.ts` | Route middleware: redirect logged-in users from `/auth/*` to `/dashboard`. |
| `server/middleware/auth.ts` | Server middleware: decode JWT and set `event.context.user`. |
| `server/middleware/auth.global.js` | Server middleware: placeholder; set `event.context.user = null`. |

All of that behavior is now handled in `server/middleware/auth.global.ts` on the server only.
