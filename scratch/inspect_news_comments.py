with open(r'c:\E\ichsan\startup\archeryhub.id\app\pages\news\[slug].vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'comment' in line.lower() or 'post' in line.lower() or 'get(' in line.lower():
        print(f"{i+1}: {line.strip()}")
