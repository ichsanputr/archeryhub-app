import os
import re
import json

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.abspath(os.path.join(base_dir, '..'))
locales_dir = os.path.join(app_dir, 'i18n', 'locales')

files = ['common', 'auth', 'dashboard', 'tournaments', 'archers', 'commerce']

def deep_merge(target, source):
    out = dict(target)
    for k, v in source.items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = deep_merge(out[k], v)
        else:
            out[k] = v
    return out

en_data = {}
id_data = {}
en_file_data = {}
id_file_data = {}

for f in files:
    en_path = os.path.join(locales_dir, 'en', f'{f}.json')
    id_path = os.path.join(locales_dir, 'id', f'{f}.json')
    with open(en_path, 'r', encoding='utf-8') as fp:
        en_file_data[f] = json.load(fp)
        en_data = deep_merge(en_data, en_file_data[f])
    with open(id_path, 'r', encoding='utf-8') as fp:
        id_file_data[f] = json.load(fp)
        id_data = deep_merge(id_data, id_file_data[f])

def resolve_key(data, path):
    parts = path.split('.')
    cur = data
    for p in parts:
        if isinstance(cur, dict) and p in cur:
            cur = cur[p]
        else:
            return None
    return cur if isinstance(cur, str) else None

def lookup(data, path):
    r = resolve_key(data, path)
    if r is not None:
        return r
    if path.startswith('dashboard.'):
        r = resolve_key(data, path[len('dashboard.'):])
        if r is not None:
            return r
    else:
        r = resolve_key(data, 'dashboard.' + path)
        if r is not None:
            return r
    return None

# Find all t(key, fallback) in code
scan_dirs = [
    os.path.join(app_dir, 'pages', 'dashboard'),
    os.path.join(app_dir, 'components', 'dashboard'),
    os.path.join(app_dir, 'components', 'layout'),
    os.path.join(app_dir, 'components', 'elimination'),
    os.path.join(app_dir, 'layouts')
]

# Regex patterns
# 1. t('key', 'fallback')
# 2. t('key', { params }, 'fallback')
p_simple = re.compile(r"t\(\s*(['\"][a-zA-Z0-9_\.\-]+['\"])\s*,\s*(['\"][^'\"]*['\"])\s*\)")
p_params = re.compile(r"t\(\s*(['\"][a-zA-Z0-9_\.\-]+['\"])\s*,\s*(\{.*?\})\s*,\s*(['\"][^'\"]*['\"])\s*\)")

all_entries = []

for sdir in scan_dirs:
    for root, _, fnames in os.walk(sdir):
        for fname in fnames:
            if fname.endswith(('.vue', '.ts', '.js')):
                fpath = os.path.join(root, fname)
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                
                for m in p_simple.finditer(content):
                    k = m.group(1).strip("'\"")
                    fb = m.group(2).strip("'\"")
                    all_entries.append((fpath, k, fb, False, m.group(0)))
                
                for m in p_params.finditer(content):
                    k = m.group(1).strip("'\"")
                    fb = m.group(3).strip("'\"")
                    all_entries.append((fpath, k, fb, True, m.group(0)))

print(f"Total t(key, fallback) occurrences found: {len(all_entries)}")

missing_in_en = {}
missing_in_id = {}

for fpath, k, fb, has_params, full_match in all_entries:
    en_val = lookup(en_data, k)
    id_val = lookup(id_data, k)
    
    if en_val is None:
        missing_in_en[k] = fb
    if id_val is None:
        missing_in_id[k] = fb

print(f"Keys missing in EN: {len(missing_in_en)}")
print(f"Keys missing in ID: {len(missing_in_id)}")

with open(os.path.join(app_dir, 'scripts', 'missing_keys_report.json'), 'w', encoding='utf-8') as fp:
    json.dump({
        'missing_in_en': missing_in_en,
        'missing_in_id': missing_in_id
    }, fp, indent=2)

print("Report saved to scripts/missing_keys_report.json")
