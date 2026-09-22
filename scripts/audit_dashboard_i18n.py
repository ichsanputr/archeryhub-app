import os
import re
import json

dashboard_dirs = [
    'app/pages/dashboard',
    'app/components/dashboard',
    'app/components/elimination',
    'app/components/layout'
]

ID_INDICATORS = [
    r'\bSimpan\b', r'\bBatal\b', r'\bHapus\b', r'\bTambah\b', r'\bKembali\b', r'\bUbah\b',
    r'\bKelola\b', r'\bLihat\b', r'\bUnduh\b', r'\bUnggah\b', r'\bCari\b', r'\bSemua\b',
    r'\bTurnamen\b', r'\bPemanah\b', r'\bKategori\b', r'\bPeserta\b', r'\bBantalan\b',
    r'\bSelesai\b', r'\bBerlangsung\b', r'\bKualifikasi\b', r'\bEliminasi\b', r'\bJadwal\b',
    r'\bPengaturan\b', r'\bPendapatan\b', r'\bKeuangan\b', r'\bRekening\b', r'\bLaporan\b',
    r'\bRingkasan\b', r'\bTidak ada\b', r'\bBelum ada\b', r'\bBerhasil\b', r'\bGagal\b',
    r'\bMasuk\b', r'\bDaftar\b', r'\bKlub\b', r'\bWaktu\b', r'\bTanggal\b', r'\bBiaya\b'
]

compiled_patterns = [re.compile(p, re.IGNORECASE) for p in ID_INDICATORS]

results = []
total_files_scanned = 0

for base_dir in dashboard_dirs:
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.vue'):
                total_files_scanned += 1
                filepath = os.path.join(root, file).replace('\\', '/')
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                # Extract template
                template_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
                if not template_match:
                    continue
                template = template_match.group(1)

                # Remove HTML comments
                template = re.sub(r'<!--.*?-->', '', template, flags=re.DOTALL)

                # Remove t(...) translation helper calls (so we don't match fallbacks inside t('...', 'Fallback'))
                # We want to catch purely hardcoded text or un-translated attributes
                cleaned = re.sub(r"t\([^)]*\)", '', template)

                file_issues = []
                lines = cleaned.split('\n')
                for idx, line in enumerate(lines, 1):
                    line_clean = line.strip()
                    if not line_clean:
                        continue
                    # Ignore script/style/import lines
                    if line_clean.startswith('//') or line_clean.startswith('/*') or line_clean.startswith('*'):
                        continue
                    
                    for pattern in compiled_patterns:
                        match = pattern.search(line_clean)
                        if match:
                            file_issues.append({
                                'line': idx,
                                'matched_word': match.group(0),
                                'snippet': line_clean[:120]
                            })
                            break

                if file_issues:
                    results.append({
                        'file': filepath,
                        'issues_count': len(file_issues),
                        'issues': file_issues
                    })

print(f"Total dashboard files scanned: {total_files_scanned}")
print(f"Total files with hardcoded Indonesian text: {len(results)}")
print(f"Total hardcoded instances found: {sum(r['issues_count'] for r in results)}")

output_path = 'app/scratch_audit_results.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump({
        'summary': {
            'total_scanned': total_files_scanned,
            'files_with_issues': len(results),
            'total_instances': sum(r['issues_count'] for r in results)
        },
        'files': results
    }, f, indent=2)

print(f"Detailed audit saved to {output_path}")
