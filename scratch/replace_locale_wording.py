import json

# Define the paths to the locale files
en_path = r'c:\E\ichsan\startup\archeryhub.id\app\i18n\locales\en.json'
id_path = r'c:\E\ichsan\startup\archeryhub.id\app\i18n\locales\id.json'
kr_path = r'c:\E\ichsan\startup\archeryhub.id\app\i18n\locales\kr.json'

# Load English
with open(en_path, 'r', encoding='utf-8') as f:
    en = json.load(f)

# Load Indonesian
with open(id_path, 'r', encoding='utf-8') as f:
    id_data = json.load(f)

# Helper to set nested dict values
def set_nested(d, path, val):
    keys = path.split('.')
    curr = d
    for key in keys[:-1]:
        if key not in curr:
            curr[key] = {}
        curr = curr[key]
    curr[keys[-1]] = val

# English Updates
set_nested(en, 'home.hero.description', "Archeris.net is an integrated archery event management platform designed specifically to ease tournament management, real-time scoring, and the development of the archery sports ecosystem.")
set_nested(en, 'home.meta_title', "Archeris.net - Archery Management Platform")
set_nested(en, 'home.meta_desc', "Archeris.net - Integrated archery management platform for tournaments, real-time scoring, and professional athlete development.")
set_nested(en, 'archers.title', "Discover Inspiration & Archers")
set_nested(en, 'archers.seo_title', "Archery Community – Archeris.net")
set_nested(en, 'archers.seo_desc', "Discover and explore profiles of talented archers. View their achievements, clubs, and dedication on Archeris.net.")
set_nested(en, 'subscription_page.tripay_desc', "Payments via Bank Transfer (BCA, Mandiri, BNI, BRI), QRIS, GoPay, OVO, DANA, etc.")
set_nested(en, 'events_page.description', "Join prestigious archery tournaments. From club level to world level, all available in one platform.")
set_nested(en, 'products_page.description', "Discover quality equipment from trusted clubs and organizations.")
set_nested(en, 'auth.login.title', "Elevate <br /> Archery")
set_nested(en, 'auth.register.title', "Join the largest archery community.")
set_nested(en, 'auth.register.subtitle', "Join the largest archery community.")
set_nested(en, 'auth.register.desktop_desc', "Join the largest archery community to manage clubs, track scores, and participate in tournaments.")

# Indonesian Updates
set_nested(id_data, 'home.hero.description', "Archeris.net adalah platform manajemen turnamen panahan terpadu yang dirancang khusus untuk memudahkan pengelolaan event, skoring real-time, dan pengembangan ekosistem olahraga panahan.")
set_nested(id_data, 'home.meta_title', "Archeris.net - Platform Manajemen Panahan")
set_nested(id_data, 'home.meta_desc', "Archeris.net - Platform manajemen panahan terpadu untuk turnamen, scoring real-time, dan pengembangan atlet profesional.")
set_nested(id_data, 'archers.title', "Temukan Inspirasi & Koneksi Pemanah")
set_nested(id_data, 'archers.seo_title', "Komunitas Pemanah – Archeris.net")
set_nested(id_data, 'archers.seo_desc', "Temukan dan jelajahi profil pemanah berbakat. Lihat prestasi, klub, dan dedikasi mereka di Archeris.net.")
set_nested(id_data, 'subscription_page.tripay_desc', "Pembayaran via Bank Transfer (BCA, Mandiri, BNI, BRI), QRIS, GoPay, OVO, DANA, dll.")
set_nested(id_data, 'events_page.description', "Ikuti berbagai turnamen panahan bergengsi dari tingkat klub hingga internasional, semua tersedia dalam satu platform.")
set_nested(id_data, 'products_page.description', "Temukan peralatan berkualitas dari berbagai klub dan organisasi terpercaya.")
set_nested(id_data, 'event_detail.about_tournament_desc', "Open Championship 2024 adalah ajang panahan bergengsi yang mempertemukan talenta terbaik.")
set_nested(id_data, 'auth.login.title', "Tingkatkan <br /> Olahraga Panahan")
set_nested(id_data, 'auth.register.title', "Bergabunglah dengan komunitas panahan terbesar.")
set_nested(id_data, 'auth.register.subtitle', "Bergabunglah dengan komunitas panahan terbesar.")
set_nested(id_data, 'auth.register.desktop_desc', "Bergabunglah dengan komunitas panahan terbesar untuk mengelola klub, melacak skor, dan berpartisipasi dalam turnamen.")

# Write back files
with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

with open(id_path, 'w', encoding='utf-8') as f:
    json.dump(id_data, f, indent=2, ensure_ascii=False)

print("Locale files updated successfully!")
