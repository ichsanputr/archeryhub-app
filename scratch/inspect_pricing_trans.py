import sys

# Set stdout to utf-8
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\E\ichsan\startup\archeryhub.id\app\pages\pricing.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'features' in line.lower() or 'pricing' in line.lower() or 't(' in line.lower() or 'tm(' in line.lower():
        if len(line.strip()) < 120:
            print(f"{i+1}: {line.strip()}")
