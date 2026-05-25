with open(r'c:\E\ichsan\startup\archeryhub.id\app\assets\css\main.css', 'r', encoding='utf-8') as f:
    main_css = f.read()

with open(r'c:\E\ichsan\startup\archeryhub.id\app\assets\css\theme.css', 'r', encoding='utf-8') as f:
    theme_css = f.read()

print("main.css has --color-primary:", "--color-primary" in main_css)
print("theme.css has --color-primary:", "--color-primary" in theme_css)

# Let's print occurrences in theme.css or main.css
for line in theme_css.split('\n'):
    if 'primary' in line:
        print("theme.css:", line.strip())
