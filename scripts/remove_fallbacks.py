import os
import re

base_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.abspath(os.path.join(base_dir, '..'))

scan_dirs = [
    os.path.join(app_dir, 'pages', 'dashboard'),
    os.path.join(app_dir, 'components', 'dashboard'),
    os.path.join(app_dir, 'components', 'layout'),
    os.path.join(app_dir, 'components', 'elimination'),
    os.path.join(app_dir, 'layouts')
]

def strip_fallback_from_content(content):
    # Pattern 1: t(KEY, PARAMS, FALLBACK) where PARAMS is {...}
    # Matches: t('key', { ... }, 'fallback') or $t('key', { ... }, 'fallback')
    pattern_params = re.compile(
        r"(\$?[tT]\(\s*['\"][a-zA-Z0-9_\.\-]+['\"]\s*,\s*\{.*?\}\s*),\s*(?:'[^'\\]*(?:\\.[^'\\]*)*'|\"[^\"\\]*(?:\\.[^\"\\]*)*\")\s*\)",
        re.DOTALL
    )
    content = pattern_params.sub(r"\1)", content)

    # Pattern 2: t(KEY, FALLBACK) where FALLBACK is a string literal (single or double quoted with escapes)
    # Matches: t('key', 'fallback') or $t('key', 'fallback')
    pattern_simple = re.compile(
        r"(\$?[tT]\(\s*['\"][a-zA-Z0-9_\.\-]+['\"])\s*,\s*(?:'[^'\\]*(?:\\.[^'\\]*)*'|\"[^\"\\]*(?:\\.[^\"\\]*)*\")\s*\)",
        re.DOTALL
    )
    content = pattern_simple.sub(r"\1)", content)

    # Pattern 3: multi-line fallback where fallback is across newlines:
    # t('key',
    #   'fallback')
    pattern_multiline = re.compile(
        r"(\$?[tT]\(\s*['\"][a-zA-Z0-9_\.\-]+['\"])\s*,\s*\n\s*(?:'[^'\\]*(?:\\.[^'\\]*)*'|\"[^\"\\]*(?:\\.[^\"\\]*)*\")\s*\)",
        re.DOTALL
    )
    content = pattern_multiline.sub(r"\1)", content)

    return content

total_files_modified = 0
total_replacements = 0

pattern_check = re.compile(
    r"\$?[tT]\(\s*['\"][a-zA-Z0-9_\.\-]+['\"]\s*,\s*(?:'[^'\\]*(?:\\.[^'\\]*)*'|\"[^\"\\]*(?:\\.[^\"\\]*)*\")\s*\)",
    re.DOTALL
)

for sdir in scan_dirs:
    for root, _, fnames in os.walk(sdir):
        for fname in fnames:
            if fname.endswith(('.vue', '.ts', '.js')):
                fpath = os.path.join(root, fname)
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                
                count_before = len(pattern_check.findall(content))
                if count_before > 0:
                    new_content = strip_fallback_from_content(content)
                    count_after = len(pattern_check.findall(new_content))
                    replaced = count_before - count_after
                    if new_content != content:
                        with open(fpath, 'w', encoding='utf-8') as fp:
                            fp.write(new_content)
                        total_files_modified += 1
                        total_replacements += replaced
                        rel_path = os.path.relpath(fpath, app_dir).replace('\\', '/')
                        print(f"Updated {rel_path}: removed {replaced} fallbacks (remaining: {count_after})")

print(f"\nBatch processing complete!")
print(f"Total files modified: {total_files_modified}")
print(f"Total fallbacks removed: {total_replacements}")
