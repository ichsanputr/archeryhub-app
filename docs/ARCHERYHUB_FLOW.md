# Archeris — Alur Sistem Kompetisi Panahan

> Dokumen ini menjelaskan alur lengkap pengelolaan kompetisi di platform Archeris, mulai dari pembuatan event hingga hasil akhir eliminasi. Dokumen juga memetakan kesesuaian implementasi dengan dokumen referensi IANSEO (`docs.tex`).

---

## Daftar Isi

1. [Konsep Dasar](#1-konsep-dasar)
2. [Struktur Kategori Event](#2-struktur-kategori-event)
3. [Alur Kompetisi Lengkap](#3-alur-kompetisi-lengkap)
4. [Qualification (Babak Kualifikasi)](#4-qualification-babak-kualifikasi)
5. [Elimination (Babak Eliminasi)](#5-elimination-babak-eliminasi)
6. [Kesesuaian dengan Standar IANSEO](#6-kesesuaian-dengan-standar-ianseo)
7. [Fitur Tambahan di Archeris](#7-fitur-tambahan-di-Archeris)
8. [Referensi API](#8-referensi-api)

---

## 1. Konsep Dasar

### Division (Jenis Busur)

Kategori berdasarkan jenis peralatan yang digunakan peserta.

| Kode | Nama |
|------|------|
| Recurve | Busur recurve standar |
| Compound | Busur compound dengan trigger |
| Barebow | Recurve tanpa sight/stabilizer |
| Traditional | Busur tradisional |

> Tersimpan di tabel `ref_bow_types`, direferensikan sebagai `division_uuid` di `event_categories`.

---

### Class / Age Group (Kelas Usia)

Kategori berdasarkan usia atau status peserta.

| Contoh | Keterangan |
|--------|------------|
| Senior | Usia dewasa umum |
| U21 | Under 21 tahun |
| U18 | Under 18 tahun |
| U15 | Under 15 tahun |
| Master | Usia 50+ |
| Cadet | Setara U18 (beberapa federasi) |

> Tersimpan di tabel `ref_age_groups`, direferensikan sebagai `category_uuid` di `event_categories`.

> **Catatan terminologi**: docs.tex IANSEO menyebut ini sebagai "Class". Dalam kode Archeris, field ini disimpan sebagai `category_uuid` yang mereferensikan `ref_age_groups`.

---

### Event Category = Kombinasi Lengkap

Satu **Event Category** di Archeris adalah kombinasi dari 4 dimensi:

```
Event Category = Division + Age Group + Event Type + Gender Division
```

| Field | Tabel Referensi | Contoh Nilai |
|-------|----------------|--------------|
| `division_uuid` | `ref_bow_types` | Recurve, Compound |
| `category_uuid` | `ref_age_groups` | Senior, U18, U15 |
| `event_type_uuid` | `ref_event_types` | Individual, Team, Mixed Team |
| `gender_division_uuid` | `ref_gender_divisions` | Putra, Putri, Campuran |

**Contoh kategori yang terbentuk:**
- Recurve Senior Putra Individual
- Compound U18 Putri Individual
- Recurve Senior Mixed Team
- Compound Senior Putra Team

> **Catatan**: IANSEO (`docs.tex`) hanya menyebut Division + Class (tanpa Gender dan EventType sebagai bagian dari Category). Archeris menambahkan dua dimensi ini agar kategori lebih presisi.

---

## 2. Struktur Kategori Event

### Diagram Relasi

```
event_categories
├── division_uuid         ──→  ref_bow_types      (Recurve, Compound, ...)
├── category_uuid         ──→  ref_age_groups     (Senior, U18, ...)
├── event_type_uuid       ──→  ref_event_types    (Individual, Team, Mixed)
├── gender_division_uuid  ──→  ref_gender_divisions (Putra, Putri, Mixed)
└── max_participants      (kuota, nullable = unlimited)
```

### Pengelolaan oleh Panitia (Organizer)

Panitia mengatur kategori melalui halaman:
`/dashboard/organization/events/[id]/categories`

**Fitur:**
- Tambah / edit / hapus kategori
- Custom nama kategori (override nama otomatis)
- Sistem mencegah penghapusan kategori yang sudah memiliki peserta/sesi/bracket
- Ukuran tim otomatis dihitung: Individual=1, Team=3, Mixed=2

---

## 3. Alur Kompetisi Lengkap

```
┌─────────────────────────────────────────────────────────────────┐
│                      EVENT DIBUAT                               │
│               (Panitia membuat event baru)                      │
└──────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   KONFIGURASI KATEGORI                          │
│   Panitia mendaftarkan kombinasi Division + Class + Gender +    │
│   EventType yang akan dilombakan                                │
└──────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PENDAFTARAN PESERTA                           │
│   Peserta mendaftar ke event, memilih kategori yang sesuai.     │
│   Panitia bisa tambah manual atau via undangan.                 │
└──────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              BABAK KUALIFIKASI (Qualification)                  │
│                                                                 │
│  1. Panitia buat Sesi Kualifikasi (tanggal, jam, ends, anak     │
│     panah per end)                                              │
│  2. Peserta di-assign ke target (auto-assign / manual)          │
│  3. Scorekeeper input skor via app mobile / desktop             │
│  4. Sistem hitung ranking per kategori:                         │
│       Total Skor ↓ → Total 10x ↓ → Total X ↓                   │
└──────────────────────────────┬──────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
        ┌───────────────────┐   ┌──────────────────────┐
        │   ELIMINASI       │   │   ELIMINASI           │
        │   INDIVIDUAL      │   │   TIM / MIXED TIM     │
        │                   │   │                       │
        │  Bracket dibuat   │   │  Bracket dibuat dari  │
        │  dari ranking     │   │  skor agregat tim     │
        │  qualification    │   │  qualification        │
        └─────────┬─────────┘   └──────────┬────────────┘
                  │                         │
                  └───────────┬─────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERTANDINGAN ELIMINASI                       │
│                                                                 │
│  1. Panitia generate bracket (seeding dari ranking qual)        │
│  2. Match dimulai: Peserta A vs B head-to-head                  │
│  3. Scorekeeper input skor per end via mobile / desktop         │
│  4. Pemenang otomatis maju ke ronde berikutnya                  │
│  5. Jika seri → Shoot-off (end khusus no. 99)                   │
│  6. Bracket selesai → Juara ditentukan                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Qualification (Babak Kualifikasi)

### 4.1 Sesi Kualifikasi

Satu event dapat memiliki **banyak sesi kualifikasi** yang berjalan paralel.

| Field | Keterangan |
|-------|------------|
| `session_code` | Kode unik, e.g. `QS-20260203-001` |
| `total_ends` | Jumlah end per sesi (default: 12) |
| `arrows_per_end` | Jumlah anak panah per end (default: 6) |
| `session_date` | Tanggal pelaksanaan |
| `start_time / end_time` | Jam mulai & selesai |

### 4.2 Penugasan Target

Setiap peserta di-assign ke satu target dalam sesi (`qualification_target_assignments`).

```
Peserta ──→ Target Assignment ──→ Qualification Session
              (target_uuid, board_id)
```

**Cara assign:**
- **Auto-assign**: Sistem distribusi otomatis
- **Manual**: Panitia pilih target per peserta
- **Swap**: Panitia tukar posisi target dua peserta

### 4.3 Input Skor

Skor di-input oleh **Scorekeeper** yang ditugaskan per target.

```
Per End → [Arrow 1, Arrow 2, ..., Arrow N]
         ↓
         Nilai: X(10), 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, M(0)
         ↓
         Disimpan di qualification_arrow_scores
         ↓
         Dirangkum di qualification_end_scores (total_score_end, x_count_end, ten_count_end)
```

### 4.4 Ranking Kualifikasi

Ranking dihitung dari **agregasi semua sesi** yang diikuti peserta:

```
Total Skor    = SUM(total_score_end) across all sessions
Total 10x     = SUM(ten_count_end)
Total X       = SUM(x_count_end)

Urutan ranking: Total Skor ↓ → Total 10x ↓ → Total X ↓
```

> Ranking dikelompokkan **per `category_id`** (event_category UUID). Peserta dari kategori berbeda tidak bersaing dalam leaderboard yang sama.

### 4.5 Diagram Tabel Database

```
qualification_sessions
└── qualification_target_assignments (peserta ← → target dalam sesi)
    └── qualification_end_scores (skor total per end per peserta)
        └── qualification_arrow_scores (skor individual per anak panah)
```

---

## 5. Elimination (Babak Eliminasi)

### 5.1 Bracket

Setiap bracket dikonfigurasi oleh panitia:

| Field | Nilai | Keterangan |
|-------|-------|------------|
| `bracket_type` | `individual`, `team`, `mixed_team` | Jenis bracket |
| `format` | `standard`, `recurve_set` | Format penilaian |
| `bracket_size` | 4, 8, 16, 32, 64, 128 | Jumlah peserta |
| `ends_per_match` | int | End per pertandingan |
| `arrows_per_end` | int | Anak panah per end |

### 5.2 Format Penilaian

#### Standard Format
- Akumulasi total skor semua end
- Peserta dengan total skor tertinggi menang
- Cocok untuk: Compound, Barebow, dan sebagian besar kategori

#### Recurve Set Format
- Setiap end diperlakukan sebagai "set"
- Pemenang set mendapat **2 poin**, seri masing-masing **1 poin**
- Pemenang pertandingan: yang pertama mencapai **6 poin** (atau lebih setelah 5 set)
- Jika seri setelah 5 set → **Shoot-off** (end_no = 99)
- Cocok untuk: Recurve Olympic

### 5.3 Proses Generate Bracket

Ketika panitia klik "Buat Bracket":

```
GenerateBracket() dipanggil
│
├─ Ambil ranking kualifikasi kategori terkait
├─ Ambil top-N peserta sesuai bracket_size
├─ Buat elimination_entries (seed 1 = rank 1 qual, dst.)
├─ Simpan qual_total_score, qual_total_x di entries
└─ Generate match tree:
    Seed 1 vs Seed N
    Seed 2 vs Seed N-1
    Seed 3 vs Seed N-2
    ...
    (Standar single-elimination seeding)
```

### 5.4 Penomoran Ronde

Dari bracket_size=16:

| Round | Nama | Jumlah Match |
|-------|------|--------------|
| 1 | Round of 16 | 8 |
| 2 | Perempat Final | 4 |
| 3 | Semi Final | 2 |
| 4 | Final | 1 |

### 5.5 Alur Scoring Pertandingan

```
Match dimulai (status: in_progress)
│
├─ End 1: Scorekeeper input anak panah A & B
├─ End 2: ...
├─ End N: ...
│
├─ [Standard] Total skor A vs B → pemenang ditentukan
├─ [Recurve Set] Hitung poin set → pemenang ditentukan
│
├─ Jika seri → End ke-99 (Shoot-off)
│              Anak panah terdekat ke tengah menang
│
└─ Pemenang otomatis masuk ke match ronde berikutnya
```

### 5.6 Diagram Tabel Database

```
elimination_brackets
└── elimination_entries (peserta/tim yang masuk bracket, dengan seed & skor kual)
└── elimination_matches (setiap pertandingan dalam bracket)
    └── elimination_match_ends (skor per end per sisi A/B)
        └── elimination_match_arrow_scores (skor anak panah individual)
```

### 5.7 Jenis Bracket

#### Individual Elimination
- Setiap peserta bertanding sendiri
- Seeding dari ranking kualifikasi individual

#### Team Elimination
- Tim 3 orang dari klub/negara yang sama
- Skor kualifikasi tim = jumlah skor kualifikasi 3 anggota
- Seeding dari ranking tim kualifikasi

#### Mixed Team Elimination
- Tim 1 pria + 1 wanita dari division yang sama
- Berlomba bersama, skor digabungkan
- Seeding dari ranking mixed team kualifikasi

---

## 6. Kesesuaian dengan Standar IANSEO

Berdasarkan dokumen referensi `docs.tex`:

| Konsep IANSEO | Implementasi Archeris | Status |
|---------------|------------------------|--------|
| **Division** = jenis busur (Recurve, Compound, Barebow) | `ref_bow_types` → `division_uuid` | ✅ Sesuai |
| **Class** = kelas usia (Senior, U15, U18) | `ref_age_groups` → `category_uuid` | ✅ Sesuai (terminologi berbeda: app pakai "category") |
| **Category** = kombinasi Division + Class | `event_categories` (division + category + event_type + gender) | ✅ Sesuai + lebih lengkap |
| **Qualification Round** → menghasilkan ranking | `qualification_sessions` + ranking API | ✅ Sesuai |
| Ranking dihitung per Division + Class | Dikelompokkan per `category_id` | ✅ Sesuai |
| **Individual Elimination** dari ranking kualifikasi | `bracket_type = 'individual'`, seeding dari qual ranking | ✅ Sesuai |
| **Team Elimination** (3 orang, klub/negara sama) | `bracket_type = 'team'`, tim aggregate scores | ✅ Sesuai |
| **Mixed Team Elimination** (1 pria + 1 wanita) | `bracket_type = 'mixed_team'` | ✅ Sesuai |
| 1 Qualification → bisa banyak Elimination | 1 leaderboard jadi seed untuk banyak bracket | ✅ Sesuai |

### Fitur di Luar Scope Dokumen IANSEO

Beberapa fitur Archeris tidak disebutkan dalam `docs.tex` karena merupakan tambahan implementasi:

| Fitur Tambahan | Keterangan |
|----------------|------------|
| **Gender Division** sebagai dimensi kategori | `ref_gender_divisions` (Putra/Putri/Campuran) |
| **Recurve Set Format** | Format penilaian olimpik (2 poin per set, shoot-off jika seri) |
| **Shoot-off** (end_no = 99) | Resolusi seri otomatis dengan end khusus |
| **Multi-session Qualification** | Banyak sesi paralel, skor diakumulasi |
| **Mobile Scoring App** | Scorekeeper input via QR code + mobile app |
| **Auto-assign Target** | Distribusi otomatis peserta ke target |
| **Subscription/Feature Gating** | Akses fitur tertentu tergantung paket organisasi |

---

## 7. Fitur Tambahan di Archeris

### 7.1 Mobile Scoring

Penginputan skor kualifikasi dan eliminasi dapat dilakukan melalui aplikasi mobile:

```
Scorekeeper buka app mobile
│
├─ Scan QR code target → Identifikasi assignment
├─ Lihat daftar anak panah per end
├─ Input nilai tiap anak panah
└─ Submit → Skor tersimpan secara real-time
```

**API Mobile:**
- `GET /mobile/qualification/scoring/cards` â€” Daftar kartu scoring
- `GET /mobile/qualification/scoring/targets` â€” Detail target
- `POST /mobile/qualification/scoring/scores/:assignmentId` â€” Submit skor

### 7.2 Scorekeeper Assignment

Panitia dapat menugaskan scorekeeper ke target tertentu:
- `/dashboard/organization/events/[id]/scorekeeper`
- Scorekeeper hanya dapat input skor untuk target yang ditugaskan

### 7.3 Event Discovery & Registrasi

Atlet dapat:
1. Discover event melalui `/events` (halaman publik)
2. Mendaftar ke event â†’ pilih kategori
3. Membayar via payment gateway (Tripay)
4. Menerima notifikasi status pendaftaran

### 7.4 Scoring Real-time

- Skor kualifikasi terupdate real-time di leaderboard
- Bracket eliminasi menampilkan status match secara live
- Mode `READ ONLY / HANYA BACA` saat pertandingan selesai

---

## 8. Referensi API

### Event & Kategori

```
GET    /events                              â€” Daftar event publik
GET    /events/:id                          â€” Detail event
GET    /events/:id/categories               â€” Daftar kategori event
POST   /events/:id/categories               â€” Buat kategori (auth)
PUT    /events/:id/categories/:categoryId   â€” Edit kategori (auth)
DELETE /events/:id/categories/:categoryId   â€” Hapus kategori (auth)
```

### Kualifikasi

```
GET    /events/:id/qualification/sessions                      â€” Daftar sesi
POST   /events/:id/qualification/sessions                      â€” Buat sesi (auth)
PATCH  /events/:id/qualification/sessions/:sessionId           â€” Edit sesi (auth)
DELETE /events/:id/qualification/sessions/:sessionId           â€” Hapus sesi (auth)
GET    /events/:id/qualification/leaderboard                   â€” Leaderboard kualifikasi
GET    /events/:id/results/qualification?category_id=...       â€” Hasil publik per kategori
```

### Eliminasi

```
GET    /events/:id/elimination/brackets                                         â€” Daftar bracket
POST   /events/:id/elimination/brackets                                         â€” Buat bracket (auth)
GET    /events/:id/elimination/brackets/:bracketId                              â€” Detail bracket
PUT    /events/:id/elimination/brackets/:bracketId                              â€” Edit bracket (auth)
DELETE /events/:id/elimination/brackets/:bracketId                              â€” Hapus bracket (auth)
POST   /events/:id/elimination/brackets/:bracketId/generate                     â€” Generate seeding (auth)
POST   /events/:id/elimination/brackets/:bracketId/matches/:matchId/score       â€” Input skor (auth)
POST   /events/:id/elimination/brackets/:bracketId/matches/:matchId/finish      â€” Selesaikan match (auth)
GET    /events/:id/results/elimination?category_id=...                          â€” Hasil publik per kategori
```

### Peserta

```
GET    /events/:id/participants                     â€” Daftar peserta
GET    /events/:id/participants/export              â€” Export CSV (auth)
POST   /events/:id/participants                     â€” Tambah peserta manual (auth)
PATCH  /events/:id/participants/:participantId      â€” Edit peserta (auth)
DELETE /events/:id/participants/:participantId      â€” Hapus peserta (auth)
```

---

## Ringkasan Diagram Lengkap

```
EVENT
â”‚
â”œâ”€â”€ EVENT CATEGORIES (Division Ã— Age Group Ã— EventType Ã— Gender)
â”‚       â”‚
â”‚       â”œâ”€â”€ QUALIFICATION SESSIONS (sesi bertanggal, banyak per event)
â”‚       â”‚       â”‚
â”‚       â”‚       â”œâ”€â”€ TARGET ASSIGNMENTS (peserta â†’ target)
â”‚       â”‚       â”‚
â”‚       â”‚       â””â”€â”€ END SCORES â†’ ARROW SCORES
â”‚       â”‚               â†“
â”‚       â”‚       QUALIFICATION RANKING (per kategori)
â”‚       â”‚
â”‚       â””â”€â”€ ELIMINATION BRACKETS (bisa banyak, per kategori)
â”‚               â†“ (seeding dari qualification ranking)
â”‚               â”œâ”€â”€ ENTRIES (peserta dengan seed & skor kual)
â”‚               â””â”€â”€ MATCHES (per ronde, per pertandingan)
â”‚                       â””â”€â”€ MATCH ENDS â†’ MATCH ARROW SCORES
â”‚                               â†“
â”‚                       PEMENANG â†’ MAJU RONDE BERIKUTNYA
â”‚
â””â”€â”€ PESERTA (Participants)
        â”œâ”€â”€ Mendaftar ke kategori
        â”œâ”€â”€ Membayar (payment gateway)
        â”œâ”€â”€ Dapat assignment target kualifikasi
        â””â”€â”€ Ikut bracket eliminasi
```

---

*Dokumen dibuat berdasarkan eksplorasi kode sumber Archeris dan referensi dokumen IANSEO (`docs.tex`). Terakhir diupdate: Maret 2026.*

