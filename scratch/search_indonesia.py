import os
import re

target_dir = r'c:\E\ichsan\startup\archeryhub.id\app'
matches = []

for root, dirs, files in os.walk(target_dir):
    # Skip node_modules and .nuxt
    if 'node_modules' in root or '.nuxt' in root or '.git' in root or '.output' in root:
        continue
    for file in files:
        if file.endswith(('.json', '.ts', '.vue', '.md')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                if 'indonesia' in content.lower():
                    # Find all lines containing "indonesia"
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if 'indonesia' in line.lower():
                            relpath = os.path.relpath(filepath, target_dir)
                            matches.append((relpath, i+1, line.strip()))
            except Exception as e:
                pass

print(f"Found {len(matches)} occurrences of 'Indonesia':")
for relpath, line_no, text in matches[:40]:
    print(f"{relpath}:{line_no}: {text}")
