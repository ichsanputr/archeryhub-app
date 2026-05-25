import json

lottie_path = r'c:\E\ichsan\startup\archeryhub.id\app\public\loader-lottie.json'

with open(lottie_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Lottie files store colors in various ways, typically:
# 1. Shape fill/stroke colors: {"ty": "fl", "c": {"k": [r, g, b, a]}} or similar
# Let's write a helper to traverse the JSON and find keys that represent colors.
colors_found = []

def traverse(obj, path=""):
    if isinstance(obj, dict):
        # A color property in Lottie usually has "a": 0 or 1, and "k": [r, g, b, a] or similar, and its parent is "c" (color) or "g" (gradient)
        if "k" in obj and isinstance(obj["k"], list) and len(obj["k"]) >= 3 and all(isinstance(x, (int, float)) for x in obj["k"][:3]):
            # Check if this might be a color. Often parent key is "c"
            if path.endswith("/c") or path.endswith("/g") or "color" in path.lower():
                colors_found.append((path, obj["k"]))
        for k, v in obj.items():
            traverse(v, f"{path}/{k}")
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            traverse(item, f"{path}[{i}]")

traverse(data)

print(f"Total potential colors found: {len(colors_found)}")
for path, color in colors_found[:30]:
    print(f"{path}: {color}")
