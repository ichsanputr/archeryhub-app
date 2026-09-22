import pymysql
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='',
    database='archeris',
    charset='utf8mb4'
)
cursor = conn.cursor(pymysql.cursors.DictCursor)
cursor.execute('SELECT id, slug, title, category, status, read_time, views, excerpt, content, published_at, tags FROM blog_articles ORDER BY id ASC')
articles = cursor.fetchall()

print(f"Total articles in DB: {len(articles)}")
print("=" * 80)

audit_data = []

for a in articles:
    content = a['content'] or ''
    # Clean text
    clean_text = re.sub(r'<[^>]+>', ' ', content)
    words = clean_text.split()
    word_count = len(words)
    
    # Structural elements
    h2_matches = re.findall(r'<h2[^>]*>(.*?)</h2>', content, re.IGNORECASE | re.DOTALL)
    h3_matches = re.findall(r'<h3[^>]*>(.*?)</h3>', content, re.IGNORECASE | re.DOTALL)
    img_matches = re.findall(r'<img[^>]*src=[\'"]([^\'"]+)[\'"]', content, re.IGNORECASE)
    table_matches = re.findall(r'<table\b', content, re.IGNORECASE)
    blockquote_matches = re.findall(r'<blockquote\b', content, re.IGNORECASE)
    ul_matches = re.findall(r'<ul\b', content, re.IGNORECASE)
    ol_matches = re.findall(r'<ol\b', content, re.IGNORECASE)
    callout_matches = re.findall(r'class=[\'"][^\'"]*callout', content, re.IGNORECASE)
    
    # Internal links or links
    link_matches = re.findall(r'<a\s+[^>]*href=[\'"]([^\'"]+)[\'"]', content, re.IGNORECASE)
    internal_links = [l for l in link_matches if l.startswith('/') or 'archeris' in l]
    external_links = [l for l in link_matches if not (l.startswith('/') or 'archeris' in l)]

    # Readability / FAQ / Schema signals
    has_faq = bool(re.search(r'faq|frequently asked|tanya jawab', content, re.IGNORECASE))
    has_intro = bool(re.search(r'<h2>.*?(intro|panduan|overview|pengenalan)', content, re.IGNORECASE))
    has_conclusion = bool(re.search(r'<h2>.*?(conclusion|kesimpulan|penutup|takeaway|ringkasan)', content, re.IGNORECASE))
    
    # Low Value Content Red Flags:
    # 1. Word count < 1000 (Thin content)
    # 2. No visual aids (0 images / diagrams)
    # 3. No structured data (0 tables, 0 callouts/quotes)
    # 4. Low heading hierarchy (< 3 H2s)
    # 5. Missing internal linking (0 internal links)
    # 6. Repetitive / boilerplate phrasing or AI generic style
    
    red_flags = []
    if word_count < 800:
        red_flags.append(f"Thin Content: Only {word_count} words (< 800 words)")
    elif word_count < 1200:
        red_flags.append(f"Borderline Length: {word_count} words (< 1200 target for authoritative pillar)")
        
    if len(img_matches) == 0:
        red_flags.append("No visual aids: 0 images or diagrams embedded")
    elif len(img_matches) < 2:
        red_flags.append(f"Low visual density: Only {len(img_matches)} image for {word_count} words")
        
    if len(table_matches) == 0:
        red_flags.append("No reference tables: Lacks comparison or summary table")
        
    if len(h2_matches) < 3:
        red_flags.append(f"Weak heading structure: Only {len(h2_matches)} H2 headings")
        
    if len(internal_links) == 0:
        red_flags.append("Zero internal links: No cross-linking to other articles, tournament registration, or app features")

    # Score calculation (0 - 100)
    score = 100
    if word_count < 800: score -= 30
    elif word_count < 1200: score -= 15
    if len(img_matches) == 0: score -= 20
    elif len(img_matches) < 2: score -= 10
    if len(table_matches) == 0: score -= 15
    if len(internal_links) == 0: score -= 15
    if len(h2_matches) < 3: score -= 10

    info = {
        'id': a['id'],
        'slug': a['slug'],
        'title': a['title'],
        'category': a['category'],
        'word_count': word_count,
        'h2_count': len(h2_matches),
        'h3_count': len(h3_matches),
        'h2_list': [re.sub(r'<[^>]+>', '', h).strip() for h in h2_matches],
        'img_count': len(img_matches),
        'table_count': len(table_matches),
        'internal_links_count': len(internal_links),
        'external_links_count': len(external_links),
        'has_faq': has_faq,
        'has_conclusion': has_conclusion,
        'score': max(0, score),
        'red_flags': red_flags
    }
    audit_data.append(info)

# Sort by score ascending (lowest quality first)
audit_data.sort(key=lambda x: x['score'])

for item in audit_data:
    status_label = "🔴 LOW VALUE" if item['score'] < 60 else ("🟡 MEDIUM VALUE" if item['score'] < 80 else "🟢 HIGH VALUE")
    print(f"[{status_label}] (Score: {item['score']}/100) ID: {item['id']} | {item['title']}")
    print(f"   Slug: {item['slug']}")
    print(f"   Category: {item['category']} | Words: {item['word_count']} | H2s: {item['h2_count']} | H3s: {item['h3_count']} | Imgs: {item['img_count']} | Tables: {item['table_count']} | Internal Links: {item['internal_links_count']}")
    print(f"   Headings: {', '.join(item['h2_list'][:4])}...")
    if item['red_flags']:
        print("   Flags:")
        for rf in item['red_flags']:
            print(f"     - {rf}")
    print("-" * 80)

print("\n" + "=" * 80)
print("DETAILED CONTENT BREAKDOWN PER ARTICLE:")
print("=" * 80)

for a in articles:
    content = a['content'] or ''
    clean_text = re.sub(r'<[^>]+>', ' ', content)
    words = len(clean_text.split())
    imgs = re.findall(r'<img[^>]*src=[\'"]([^\'"]+)[\'"]', content, re.I)
    tables = re.findall(r'<table', content, re.I)
    callouts = re.findall(r'callout', content, re.I)
    faqs = re.findall(r'faq|frequently asked|pertanyaan yang sering', content, re.I)
    links = re.findall(r'<a\s+[^>]*href=[\'"]([^\'"]+)[\'"]', content, re.I)
    
    # Check mentions of Archeris / CTA
    mentions_archeris = len(re.findall(r'archeris', content, re.I))
    
    print(f"\n[ID {a['id']}] {a['title']}")
    print(f"Slug: {a['slug']} | Category: {a['category']}")
    print(f"Word Count: {words} words | Read Time: {a['read_time']} mins | Views: {a['views']}")
    print(f"Images ({len(imgs)}): {imgs}")
    print(f"Tables: {len(tables)} | Callouts: {len(callouts)} | FAQ Section: {'Yes' if faqs else 'No'}")
    print(f"Links ({len(links)}): {links}")
    print(f"Archeris Brand/Product Mentions: {mentions_archeris} times")

    # Sample beginning and ending paragraph
    p_matches = re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL | re.I)
    if p_matches:
        first_p = re.sub(r'<[^>]+>', '', p_matches[0])[:120].strip()
        last_p = re.sub(r'<[^>]+>', '', p_matches[-1])[:120].strip()
        print(f"Intro snippet: \"{first_p}...\"")
        print(f"Conclusion snippet: \"{last_p}...\"")

