import os
import re
import json

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
for f in files:
    with open(os.path.join(locales_dir, 'en', f'{f}.json'), encoding='utf-8') as fp:
        en_data = deep_merge(en_data, json.load(fp))
    with open(os.path.join(locales_dir, 'id', f'{f}.json'), encoding='utf-8') as fp:
        id_data = deep_merge(id_data, json.load(fp))

def resolve(data, path):
    parts = path.split('.')
    cur = data
    for p in parts:
        if isinstance(cur, dict) and p in cur:
            cur = cur[p]
        else:
            return None
    return cur if isinstance(cur, str) else None

def lookup(data, path):
    r = resolve(data, path)
    if r is not None:
        return r
    if path.startswith('dashboard.'):
        r = resolve(data, path[10:])
        if r is not None:
            return r
    else:
        r = resolve(data, 'dashboard.' + path)
        if r is not None:
            return r
    return None

scan_dirs = [
    os.path.join(app_dir, 'pages', 'dashboard'),
    os.path.join(app_dir, 'components', 'dashboard'),
    os.path.join(app_dir, 'components', 'layout'),
    os.path.join(app_dir, 'components', 'elimination'),
    os.path.join(app_dir, 'layouts')
]

key_regex = re.compile(r'(?:\b|\$)[tT]\(\s*[\'"]([^\'"\r\n]+)[\'"]')

all_keys = set()
for sdir in scan_dirs:
    for root, _, fnames in os.walk(sdir):
        for fname in fnames:
            if fname.endswith(('.vue', '.ts', '.js')):
                with open(os.path.join(root, fname), encoding='utf-8') as fp:
                    content = fp.read()
                for m in key_regex.finditer(content):
                    all_keys.add(m.group(1))

missing_en = []
missing_id = []
for k in sorted(all_keys):
    if '${' in k or '+' in k or ' ' in k or not '.' in k:
        continue
    if lookup(en_data, k) is None:
        missing_en.append(k)
    if lookup(id_data, k) is None:
        missing_id.append(k)

print(f"Total distinct keys found: {len(all_keys)}")
print(f"Missing in EN: {len(missing_en)}")
if missing_en:
    for k in missing_en:
        print(f"  EN missing: {k}")
print(f"Missing in ID: {len(missing_id)}")
if missing_id:
    for k in missing_id:
        print(f"  ID missing: {k}")
