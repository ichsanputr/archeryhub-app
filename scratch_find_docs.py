import os

api_dir = r"C:\E\ichsan\startup\archeryhub.id\api"
target_string = "data/docs"

results = []
for root, dirs, files in os.walk(api_dir):
    for file in files:
        if file.endswith(('.go', '.js', '.json')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if target_string in content:
                        results.append(path.replace('\\', '/'))
            except Exception:
                pass

for r in results:
    print(r)
