import os
import re

dirs = ['pages/dashboard', 'components/dashboard', 'components/layout', 'components/elimination', 'layouts']
found = []

# Pattern matching \bt('key', 'fallback') or \b$t('key', 'fallback')
pattern = re.compile(r"(?:\b|\$)[tT]\(\s*(['\"][a-zA-Z0-9_\.\-]+['\"])\s*,\s*(['\"][^'\"]*['\"])\s*\)")

for d in dirs:
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith(('.vue', '.ts', '.js')):
                path = os.path.join(root, f).replace('\\', '/')
                with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                
                matches = pattern.findall(content)
                if matches:
                    found.append((path, len(matches), matches))

print(f"Total files with t(key, fallback): {len(found)}")
print(f"Total occurrences: {sum(x[1] for x in found)}")
for p, count, m in found:
    print(f"{p}: {count} occurrences (sample: t({m[0][0]}, {m[0][1]}))")
