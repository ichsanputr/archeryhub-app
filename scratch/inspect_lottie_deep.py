import json

lottie_path = r'c:\E\ichsan\startup\archeryhub.id\app\public\loader-lottie.json'

with open(lottie_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

colors = []

def find_colors_deep(obj, path=""):
    if isinstance(obj, dict):
        # In Lottie, fill is 'fl' and stroke is 'st'
        # Their color property is 'c' which has 'k' as the value (either static or animated)
        if obj.get('ty') in ['fl', 'st']:
            c = obj.get('c')
            if isinstance(c, dict) and 'k' in c:
                colors.append((path + f"/{obj.get('ty')}/c", c['k']))
        for k, v in obj.items():
            find_colors_deep(v, f"{path}/{k}")
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            find_colors_deep(item, f"{path}[{i}]")

find_colors_deep(data)

print(f"Deep search found {len(colors)} shape colors:")
for path, col in colors:
    print(f"{path}: {col}")
