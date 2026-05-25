import json

with open(r'c:\E\ichsan\startup\archeryhub.id\app\i18n\locales\en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

with open(r'c:\E\ichsan\startup\archeryhub.id\app\i18n\locales\id.json', 'r', encoding='utf-8') as f:
    id_data = json.load(f)

def search_json(obj, prefix=""):
    results = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            results.extend(search_json(v, f"{prefix}.{k}" if prefix else k))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            results.extend(search_json(v, f"{prefix}[{i}]"))
    elif isinstance(obj, str):
        if 'indonesia' in obj.lower():
            results.append((prefix, obj))
    return results

print("=== English keys ===")
for k, v in search_json(en):
    print(f"{k}: {v}")

print("\n=== Indonesian keys ===")
for k, v in search_json(id_data):
    print(f"{k}: {v}")
