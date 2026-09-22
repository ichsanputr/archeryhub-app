import os
import re
import json

dashboard_dir = 'pages/dashboard'
results = []

for root, dirs, files in os.walk(dashboard_dir):
    for f in files:
        if f.endswith('.vue'):
            path = os.path.join(root, f).replace('\\', '/')
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                code = fp.read()
            
            uses_dashboard_i18n = 'useDashboardI18n' in code
            uses_vue_i18n = 'useI18n' in code
            
            tmpl = ''
            m = re.search(r'<template>(.*?)</template>', code, re.DOTALL)
            if m:
                tmpl = m.group(1)
            
            # Strip comments
            tmpl_clean = re.sub(r'<!--.*?-->', '', tmpl, flags=re.DOTALL)
            
            # Check for Indonesian text outside t(...)
            no_t = re.sub(r't\([^)]*\)', '', tmpl_clean)
            no_tags = re.sub(r'<[^>]+>', ' ', no_t)
            
            # Count common Indonesian words
            id_words = re.findall(r'\b(pengaturan|keamanan|kata sandi|ubah|batal|simpan|hapus|tambah|kembali|kelola|lihat|unduh|unggah|cari|semua|turnamen|pemanah|kategori|peserta|bantalan|selesai|berlangsung|kualifikasi|eliminasi|jadwal|pendapatan|keuangan|rekening|laporan|ringkasan|tidak ada|belum ada|berhasil|gagal|masuk|daftar|klub|waktu|tanggal|biaya)\b', no_tags, re.IGNORECASE)
            
            # Check fallbacks inside t('...', '...')
            fallbacks = re.findall(r"t\(\s*['\"][^'\"]+['\"]\s*,\s*['\"]([^'\"]+)['\"]", tmpl_clean)
            id_fallbacks = [fb for fb in fallbacks if re.search(r'\b(pengaturan|keamanan|kata sandi|ubah|batal|simpan|hapus|tambah|kembali|kelola|lihat|unduh|unggah|cari|semua|turnamen|pemanah|kategori|peserta|bantalan|selesai|berlangsung|kualifikasi|eliminasi|jadwal|pendapatan|keuangan|rekening|laporan|ringkasan|tidak ada|belum ada|berhasil|gagal|masuk|daftar|klub|waktu|tanggal|biaya)\b', fb, re.IGNORECASE)]

            results.append({
                'path': path,
                'uses_dashboard_i18n': uses_dashboard_i18n,
                'uses_vue_i18n': uses_vue_i18n,
                'hardcoded_id_count': len(id_words),
                'hardcoded_samples': list(set([w.lower() for w in id_words])),
                'id_fallback_count': len(id_fallbacks),
                'id_fallback_samples': id_fallbacks[:5]
            })

print(f"Total dashboard pages scanned: {len(results)}")
dashboard_i18n_pages = [r for r in results if r['uses_dashboard_i18n']]
vue_i18n_pages = [r for r in results if r['uses_vue_i18n']]
neither_pages = [r for r in results if not r['uses_dashboard_i18n'] and not r['uses_vue_i18n']]

print(f"Using useDashboardI18n: {len(dashboard_i18n_pages)}")
print(f"Using useI18n (vue-i18n): {len(vue_i18n_pages)}")
print(f"Using NEITHER (no translation setup): {len(neither_pages)}")

with_hardcoded = [r for r in results if r['hardcoded_id_count'] > 0]
print(f"Pages with raw hardcoded Indonesian text: {len(with_hardcoded)}")

with_id_fallbacks = [r for r in results if r['id_fallback_count'] > 0]
print(f"Pages with Indonesian fallbacks inside t(): {len(with_id_fallbacks)}")

print("\n--- Top pages with raw hardcoded Indonesian text ---")
for r in sorted(with_hardcoded, key=lambda x: x['hardcoded_id_count'], reverse=True)[:15]:
    print(f"{r['path']}: {r['hardcoded_id_count']} words -> {', '.join(r['hardcoded_samples'][:6])}")

print("\n--- Pages with NEITHER useI18n nor useDashboardI18n ---")
for r in neither_pages:
    print(f"{r['path']} (raw ID words: {r['hardcoded_id_count']})")

with open('scripts/dashboard_audit_full.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
