# App Middleware Documentation

All auth logic lives in **one server middleware** (SSR-only). There are no route middlewares.

---

## Avatar URL di header (LandingHeader): dari mana?

**Alur singkat:** `avatar_url` yang dipakai di header (dan `useAuth().user`) berasal dari **payload JWT** yang di-decode di server middleware, atau dari hasil **login/register/callback/fetchUser** (API).

1. **Saat login** (email atau Google): API (Go) baca user dari DB → `utils.MaskMediaURL(avatar_url)` → hasil dimasukkan ke JWT (claim `avatar`) dan response login.
2. **Setiap request ke Nuxt:** `server/middleware/auth.global.ts` baca cookie `auth_token` → decode JWT → set **`event.context.user`** (termasuk `avatar_url`). Tidak ada plugin auth; **global state `auth.user`** tidak diisi otomatis — isi via **`useAuth().fetchUser()`** di layout/page bila perlu.
3. **LandingHeader.vue** pakai `useAuth().user` → `user.avatar_url` di `<img :src="user.avatar_url">`. Jika user belum di-fetch, panggil `fetchUser()` (mis. di layout atau `onMounted`).

**Kenapa di local bisa dapat URL prod (`https://api.archeris.net/...`)?**

- URL itu ditentukan oleh **API yang mengeluarkan JWT** (saat login), lewat **`API_BASE_URL`** di env API.
- Jika frontend local memakai **API production** (`apiBaseUrl = https://api.archeris.net`), maka saat login request ke API prod → JWT dibuat oleh API prod → `avatar` di JWT = `MaskMediaURL(...)` dengan `API_BASE_URL` prod → **wajar dapat URL prod**.
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

### Bagaimana global state user terisi (tanpa plugin auth)

- **Tidak ada plugin auth** (`auth.client.js` dan `auth.server.ts` sudah dihapus).
- **`useState('auth.user', () => null)`** di `useAuth()` — state awal null.
- State terisi hanya bila:
  - **Login/register/callback** set `user.value` dari response API, atau
  - **Pemanggilan eksplisit** `useAuth().fetchUser()` (GET /user) — mis. di layout atau `onMounted` di halaman yang butuh user.
- **Server middleware** hanya set **`event.context.user`** (dari JWT) untuk redirect; tidak mengisi `useState('auth.user')`.

Ringkas: **Tidak ada auto-fill.** Panggil **`fetchUser()`** di layout atau halaman yang perlu menampilkan user (mis. header).

---

## API endpoint untuk profile user (sudah ada & oke)

- **GET /api/v1/user/profile**
  - **Lokasi:** `api/main.go` → `user := api.Group("/user")`, `user.Use(middleware.AuthMiddleware())`, `user.GET("/profile", handler.GetUserProfile(db))`
  - **Auth:** `AuthMiddleware()` — token dari header `Authorization: Bearer <token>` atau cookie **`auth_token`**
  - **Handler:** `api/handler/user.go` → `GetUserProfile` → baca `user_id` & `user_type` dari context (JWT), query ke tabel archers/organizations/clubs/sellers, return `uuid`, `email`, `full_name`, `user_type`, `avatar_url`, `logo_url`, `has_password` (avatar_url & logo_url sudah di-mask pakai `utils.MaskMediaURL`)
  - **Response:** 200 + JSON user, atau 401 jika tidak/token invalid, atau 404 jika user tidak ketemu

- **GET /api/v1/user** (untuk `useAuth().fetchUser()`)
  - **Handler:** `api/handler/auth_Archeris.go` → `GetCurrentUser` — return lebih banyak field (username, slug, phone, bio, achievements, dll)
  - Juga pakai `AuthMiddleware()` and cookie `auth_token`

Keduanya sudah ada; panggil dari client (atau server) sesuai kebutuhan.

---

## Removed files (migrated into the single file above)

| Old file | Role (before migration) |
|----------|---------------------------|
| `middleware/auth.global.ts` | Route middleware: protect dashboard/profile/register/payment; redirect to login. |
| `middleware/redirect-auth.global.ts` | Route middleware: redirect logged-in users from `/auth/*` to `/dashboard`. |
| `server/middleware/auth.ts` | Server middleware: decode JWT and set `event.context.user`. |
| `server/middleware/auth.global.js` | Server middleware: placeholder; set `event.context.user = null`. |

All of that behavior is now handled in `server/middleware/auth.global.ts` on the server only.
iddleware/auth.global.js` | Server middleware: placeholder; set `event.context.user = null`. |

All of that behavior is now handled in `server/middleware/auth.global.ts` on the server only.


