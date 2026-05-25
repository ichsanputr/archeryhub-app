with open(r'c:\E\ichsan\startup\archeryhub.id\app\pages\news\index.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'script' in line or 'api.get' in line or 'useasyncdata' in line.lower() or 'articles' in line.lower() or 'fetch' in line.lower():
        print(f"{i+1}: {line.strip()}")
