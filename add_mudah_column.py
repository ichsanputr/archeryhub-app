"""
Adds a 'Mudah?' column (Ya/Tidak) to qa_test_cases.csv.

Criteria:
  Ya    = test can be done standalone with minimal setup
           (page load, UI visibility, form validation, navigation, public content)
  Tidak = test requires cross-module state / prior actions
           (must register first, must have payment, must have qualification scores,
            must have bracket created, must be logged-in as specific role,
            must have event data already populated, etc.)
"""
import csv
import re

INPUT  = 'qa_test_cases.csv'
OUTPUT = 'qa_test_cases.csv'

# Keywords that strongly suggest a standalone / easy test
EASY_PATTERNS = [
    r'tampil', r'muncul', r'bisa dibaca', r'responsive', r'rapi',
    r'gambar', r'banner', r'logo', r'warna', r'tema',
    r'tombol.*berfungsi', r'link.*bisa', r'bisa dibuka',
    r'navigasi', r'menu', r'sidebar', r'breadcrumb',
    r'halaman.*dimuat', r'tidak.*error 404', r'tanpa.*server error',
    r'form.*validasi', r'input.*angka', r'format.*masuk akal',
    r'pesan.*jelas', r'redirect.*login', r'diarahkan.*login',
    r'share', r'bagikan', r'whatsapp',
    r'google maps', r'lokasi',
    r'info.*kategori', r'pilihan kategori.*sesuai',
    r'filter.*kategori',
    r'search', r'cari',
    r'pagination',
    r'logout', r'login.*berfungsi', r'login.*form',
    r'register.*form', r'form.*pendaftaran.*berfungsi',
    r'countdown.*berjalan', r'timer',
    r'tooltip', r'preview',
    r'404', r'not found',
    r'loading.*spinner', r'skeleton',
    r'dark mode', r'light mode',
    r'faq', r'panduan teknis.*tampil',
    r'tab.*tampil', r'tab.*jadwal',
    r'deadline.*tampil', r'nonaktif.*deadline',
    r'pdf.*tampil', r'pdf.*dibuka',
]

# Keywords that strongly suggest a hard / cross-module test
HARD_PATTERNS = [
    r'setelah.*daftar', r'setelah.*bayar', r'setelah.*pembayaran',
    r'setelah.*kualifikasi', r'setelah.*eliminasi', r'setelah.*sinkron',
    r'sinkron.*data', r'sinkronisasi', r'sync',
    r'skor.*kualifikasi', r'hasil.*kualifikasi', r'leaderboard',
    r'ranking', r'peringkat.*skor',
    r'bracket', r'eliminasi.*bracket', r'babak.*eliminasi',
    r'tim.*terbentuk', r'anggota tim', r'komposisi tim', r'manajemen tim',
    r'upload.*bukti', r'bukti.*bayar',
    r'virtual account', r'nomor va', r'qr code.*scan',
    r'invoice', r'tagihan.*sesuai',
    r'status.*pembayaran.*sinkron', r'penyedia.*pembayaran',
    r'batalkan.*pendaftaran', r'slot.*terhapus',
    r'sudah.*pernah daftar', r'peserta.*sudah',
    r'konfirmasi.*panitia', r'acc.*panitia',
    r'export', r'cetak', r'print',
    r'notifikasi.*terkirim', r'email.*terkirim',
    r'penempatan.*bantalan', r'pengundian', r'seeding',
    r'scorekeeper', r'live scoring', r'input skor',
    r'additional end', r'tie', r'shoot-off',
    r'hasil.*akhir', r'pemenang', r'juara',
    r'laporan', r'rekap',
    r'webhook', r'callback',
    r'multi.*device', r'simultaneous',
    r'ulang daftar', r'registrasi ulang',
    r're-register',
    r'cocok.*data.*dashboard', r'sinkron.*dashboard',
    r'peserta.*terdaftar.*tampil.*cocok',
    r'detail transaksi.*tampil lengkap',
    r'rincian biaya.*sesuai',
    r'data.*tersimpan',
    r'file.*tersimpan',
    r'profil.*tersimpan', r'berhasil.*disimpan',
    r'berhasil.*dikirim', r'berhasil.*dibuat',
    r'daftar.*event.*muncul',
    r'event.*saya',
    r'tombol bayar.*aktif',
    r'pembayaran manual',
    r'histori',
]

easy_re  = [re.compile(p, re.IGNORECASE) for p in EASY_PATTERNS]
hard_re  = [re.compile(p, re.IGNORECASE) for p in HARD_PATTERNS]

def classify(url: str, test: str) -> str:
    text = (url + ' ' + test).lower()

    hard_hits = sum(1 for r in hard_re  if r.search(text))
    easy_hits = sum(1 for r in easy_re  if r.search(text))

    # URL-level signals
    # Public event pages (no /dashboard) and static pages are generally easier
    is_dashboard = '/dashboard' in url
    is_payment   = '/payment' in url
    is_register  = '/register' in url

    # Hard wins if any hard keyword found
    if hard_hits > 0:
        return 'Tidak'

    # Dashboard pages without hard keywords can still be easy if they're
    # purely visual / navigation checks
    if easy_hits > 0:
        return 'Ya'

    # Default: dashboard pages tend to require auth + data → Tidak
    if is_dashboard or is_payment or is_register:
        return 'Tidak'

    return 'Ya'


with open(INPUT, newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

header = rows[0]
if 'Mudah?' not in header:
    # Insert after column index 2 (after Test column)
    header.insert(2, 'Mudah?')
    data_rows = rows[1:]
    new_data = []
    for row in data_rows:
        if len(row) < 2:
            row.insert(2, '')
        else:
            val = classify(row[0], row[1])
            row.insert(2, val)
        new_data.append(row)
    final = [header] + new_data
else:
    col_idx = header.index('Mudah?')
    data_rows = rows[1:]
    new_data = []
    for row in data_rows:
        if len(row) < 2:
            pass
        else:
            val = classify(row[0], row[1])
            if len(row) > col_idx:
                row[col_idx] = val
            else:
                row.insert(col_idx, val)
        new_data.append(row)
    final = [header] + new_data

with open(OUTPUT, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerows(final)

# Print summary
ya    = sum(1 for r in final[1:] if len(r) > 2 and r[2] == 'Ya')
tidak = sum(1 for r in final[1:] if len(r) > 2 and r[2] == 'Tidak')
print(f"Done. Total: {len(final)-1} rows | Ya: {ya} | Tidak: {tidak}")
print(f"Header: {final[0]}")
print("Sample rows:")
for r in final[1:6]:
    print(f"  [{r[2]}] {r[1][:70]}")
