import json

kr_path = r'c:\E\ichsan\startup\archeryhub.id\app\i18n\locales\kr.json'

with open(kr_path, 'r', encoding='utf-8') as f:
    kr = json.load(f)

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

found = search_json(kr)
print(f"Found {len(found)} occurrences in kr.json:")
for k, v in found:
    print(f"{k}: {v}")
