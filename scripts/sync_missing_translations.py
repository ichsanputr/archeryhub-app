import os
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.abspath(os.path.join(base_dir, '..'))
locales_dir = os.path.join(app_dir, 'i18n', 'locales')

# Translations dictionary for all missing keys
# format: key -> { 'en': '...', 'id': '...' }
translations = {
    # archer_archers
    "archer_archers.title": { "en": "Archers Directory", "id": "Daftar Akun Pemanah" },
    "archer_archers.subtitle": { "en": "Manage and monitor all registered archer accounts in the platform.", "id": "Kelola dan pantau seluruh data akun pemanah yang terdaftar di sistem." },
    "archer_archers.breadcrumb": { "en": "Archers", "id": "Pemanah" },
    "archer_archers.search_placeholder": { "en": "Search name, email, club, or ID...", "id": "Cari nama, email, klub, atau ID..." },
    "archer_archers.total_archers": { "en": "Total Archers", "id": "Total Pemanah" },
    "archer_archers.total_archers_desc": { "en": "Total registered archer accounts", "id": "Total akun pemanah terdaftar" },
    "archer_archers.total_clubs": { "en": "Registered Clubs", "id": "Klub Terdaftar" },
    "archer_archers.total_clubs_desc": { "en": "Archer club affiliations", "id": "Afiliasi klub pemanah" },
    "archer_archers.active_bow_types": { "en": "Bow Divisions", "id": "Divisi Busur" },
    "archer_archers.active_bow_types_desc": { "en": "Active division categories", "id": "Kategori divisi aktif" },
    "archer_archers.count_unit": { "en": "Archers", "id": "Pemanah" },
    "archer_archers.empty_title": { "en": "No Archers Found", "id": "Pemanah Tidak Ditemukan" },
    "archer_archers.empty_filter_desc": { "en": "No archers match the selected search keywords or filter criteria.", "id": "Tidak ada data pemanah yang cocok dengan kriteria pencarian atau filter yang dipilih." },
    "archer_archers.empty_desc": { "en": "No archer accounts registered on the platform yet.", "id": "Belum ada akun pemanah yang terdaftar di platform." },
    "archer_archers.col_profile": { "en": "Archer Profile", "id": "Profil Pemanah" },
    "archer_archers.col_club": { "en": "Club & Region", "id": "Klub & Domisili" },
    "archer_archers.col_category": { "en": "Division & Gender", "id": "Divisi & Gender" },
    "archer_archers.col_tournaments": { "en": "Total Tournaments", "id": "Total Turnamen" },
    "archer_archers.view_profile": { "en": "Profile", "id": "Profil" },
    "archer_archers.delete_account": { "en": "Delete Archer Account", "id": "Hapus Akun Pemanah" },
    "archer_archers.delete_title": { "en": "Delete Archer Account?", "id": "Hapus Akun Pemanah?" },
    "archer_archers.delete_confirm": { "en": "Yes, Delete Archer", "id": "Ya, Hapus Pemanah" },
    "archer_archers.fetch_error": { "en": "Failed to load archer accounts.", "id": "Gagal memuat data pemanah." },
    "archer_archers.delete_success": { "en": "Archer account deleted successfully.", "id": "Akun pemanah berhasil dihapus." },
    "archer_archers.delete_error": { "en": "Failed to delete archer account.", "id": "Gagal menghapus akun pemanah." },

    # leaderboard_page
    "leaderboard_page.search_placeholder": { "en": "Search archer name, club, or contingent...", "id": "Cari nama pemanah, klub, atau kontingen..." },
    "leaderboard_page.no_matched_title": { "en": "No Matching Participants", "id": "Tidak Ada Peserta yang Cocok" },
    "leaderboard_page.no_matched_desc": { "en": "Try changing your search terms or adjust club/scope filters.", "id": "Coba ubah kata kunci pencarian atau sesuaikan pilihan filter klub/cakupan." },

    # qualification
    "qualification.ten_count": { "en": "10s", "id": "10" },
    "qualification.x_count": { "en": "Xs", "id": "X" },
    "qualification.my_results": { "en": "My Qualification Results", "id": "Hasil Kualifikasi Saya" },

    # registration
    "my_registration.cancel_registration_btn": { "en": "Cancel Registration", "id": "Batalkan Pendaftaran" },
    "registration.my_registration": { "en": "My Registration", "id": "Pendaftaran Saya" },

    # bank accounts
    "organizer.bank_accounts.badge_secondary": { "en": "Secondary account", "id": "Rekening tambahan" },

    # dashboard.org
    "dashboard.title": { "en": "Dashboard", "id": "Dashboard" },
    "dashboard.org.scoring_progress_desc": { "en": "Score entry round progress", "id": "Kemajuan entri skor ronde" },
    "dashboard.org.revenue_trend_title": { "en": "Revenue Trend", "id": "Tren Pendapatan" },
    "dashboard.org.revenue_trend_subtitle": { "en": "Verified revenue trend chart from tournament registrations", "id": "Grafik tren pendapatan terverifikasi dari pendaftaran turnamen" },
    "dashboard.org.hover_chart_hint": { "en": "Hover over bars for details", "id": "Arahkan kursor ke bar untuk melihat rincian" },
    "dashboard.org.archers_unit": { "en": "Athletes", "id": "Atlet" },
    "dashboard.org.no_trend_data": { "en": "No tournament registration data yet", "id": "Belum ada data pendaftaran turnamen" },
    "dashboard.org.quick_actions_desc": { "en": "Organizer primary action shortcuts", "id": "Pintasan aksi utama penyelenggara" },
    "dashboard.org.manage_scorekeepers": { "en": "Manage Scorekeepers", "id": "Kelola Scorekeeper" },
    "dashboard.org.wallet_payouts": { "en": "Wallet & Payouts", "id": "Dompet & Penarikan" },
    "dashboard.org.event_recap_desc": { "en": "Summary of completed tournaments", "id": "Ringkasan turnamen yang telah selesai" },
    "dashboard.org.leaderboard_desc": { "en": "Top scoring archer standings", "id": "Peringkat skor pemanah tertinggi" },
    "navigation.dashboard": { "en": "Dashboard", "id": "Dashboard" },

    # organizer.profile
    "organizer.profile.platform_username_placeholder": { "en": "username / link", "id": "username / tautan" },
    "organizer.profile.platform_channel_placeholder": { "en": "channel_id / link", "id": "id_channel / tautan" },

    # earnings
    "earnings.table_header_category": { "en": "Category / Type", "id": "Kategori / Tipe" },
    "earnings.status_paid": { "en": "Paid", "id": "Lunas" },
    "earnings.status_pending": { "en": "Pending", "id": "Menunggu" },

    # reports
    "dashboard.reports.no_events_performance": { "en": "No tournament performance data found for the selected filter.", "id": "Tidak ada data performa turnamen untuk filter yang dipilih." },

    # tournament creation & management
    "event_create.field_currency": { "en": "Currency", "id": "Mata Uang (Currency)" },
    "payment.title": { "en": "Payment", "id": "Pembayaran" },
    "elimination.my_bracket": { "en": "My Elimination Bracket", "id": "Bagan Eliminasi Saya" },
    "dashboard_event_overview.publish_failed": { "en": "Failed to publish tournament", "id": "Gagal mempublikasikan turnamen" },
    "dashboard_events_page.registration.timeline_subtitle": { "en": "Set opening and closing periods for participant registration.", "id": "Tentukan periode pembukaan dan penutupan pendaftaran peserta." },
    "dashboard_events_page.registration.fee_subtitle": { "en": "Choose tournament registration fee scheme.", "id": "Pilih skema biaya pendaftaran turnamen." },
    "events.categories.configured": { "en": "Categories Configured", "id": "Kategori Dikonfigurasi" },
    "dashboard_events_page.prizes.subtitle": { "en": "Set total tournament prizes and technical handbook attachments.", "id": "Atur total hadiah turnamen dan lampiran buku petunjuk teknis." },
    "dashboard_events_page.location.subtitle": { "en": "Set venue address and navigation map for participants.", "id": "Atur alamat venue dan peta navigasi untuk memudahkan peserta." },
    "dashboard_events_page.media.subtitle": { "en": "Upload main banner and official event posters.", "id": "Unggah banner utama dan poster resmi event Anda." },
    "dashboard_events_page.media.gallery_subtitle": { "en": "Venue facilities and photo documentation.", "id": "Foto dokumentasi atau fasilitas venue turnamen." },

    # common
    "common.add": { "en": "Add", "id": "Tambah" },
    "common.gender_male": { "en": "Male", "id": "Putra" },
    "common.gender_female": { "en": "Female", "id": "Putri" },
    "common.error_loading": { "en": "Failed to load data", "id": "Gagal memuat data" },
    "common.showing": { "en": "Showing", "id": "Menampilkan" },
    "common.from": { "en": "of", "id": "dari" },
    "common.loading": { "en": "Loading...", "id": "Memuat..." },

    # event categories
    "event_categories.toast_cannot_delete_paid": { "en": "Category cannot be deleted because it already has confirmed participants. Deactivate category status instead.", "id": "Kategori tidak dapat dihapus karena telah memiliki peserta lunas. Nonaktifkan status kategori jika pendaftaran telah ditutup." },
    "event_categories.toast_cannot_delete_dep_team": { "en": "This Individual category cannot be deleted because it is required by Team / Mixed Team categories.", "id": "Kategori Individual ini tidak dapat dihapus karena masih menjadi basis skoring kategori Beregu / Beregu Campuran." },
    "event_categories.toast_cannot_delete_has_scores": { "en": "Category cannot be deleted because matches already have qualification scores recorded.", "id": "Kategori tidak dapat dihapus karena pertandingan telah memiliki rekaman skor kualifikasi." },
    "category.detail": { "en": "Category Details", "id": "Detail Kategori" },

    # participants
    "participant.detail.reject_success": { "en": "Payment proof has been rejected", "id": "Bukti pembayaran telah ditolak" },
    "participant.detail.reject_error": { "en": "Failed to reject payment", "id": "Gagal menolak pembayaran" },
    "participant.detail.reject_payment": { "en": "Reject Payment Proof", "id": "Tolak Bukti Bayar" },
    "participant.detail.auto_gateway_title": { "en": "Automatic Payment", "id": "Pembayaran Otomatis" },
    "participant.detail.auto_gateway_desc": { "en": "Online gateway payments are verified automatically by system webhook once completed.", "id": "Metode online gateway ini diverifikasi secara otomatis oleh sistem (webhook) setelah peserta menyelesaikan pembayaran." },
    "participant.detail.reject_modal_title": { "en": "Reject Transfer Proof", "id": "Tolak Bukti Transfer" },
    "participant.detail.reject_modal_desc": { "en": "Enter the rejection reason. Archers will be notified and can re-upload correct proof.", "id": "Masukkan alasan penolakan bukti transfer ini. Alasan akan dikirimkan kepada atlet dan mereka dapat mengunggah ulang bukti bayar yang benar." },
    "participant.detail.reject_placeholder": { "en": "e.g. Blurry receipt / incorrect amount / sender name mismatch...", "id": "Contoh: Bukti transfer buram / nominal tidak sesuai / nama pengirim berbeda..." },
    "participant.detail.confirm_reject": { "en": "Confirm Rejection", "id": "Konfirmasi Tolak" },
    "participant.edit.independent": { "en": "Independent", "id": "Independen" },
    "participant.edit.categories_selected": { "en": "Selected", "id": "Dipilih" },

    # printout & schedule
    "event_printout.err_download_failed": { "en": "Failed to download PDF. Please check API server connection.", "id": "Gagal mengunduh berkas PDF. Pastikan koneksi ke server API aktif." },
    "event_printout.section_schedule": { "en": "Competition Schedule & Program", "id": "Jadwal & Program Pertandingan" },
    "event_qualification.back": { "en": "Back", "id": "Kembali" },
    "reset_event.title": { "en": "Reset Tournament Data", "id": "Reset Data Turnamen" },
    "event_schedule.elim_round_hint": { "en": "Select the tournament elimination stage competing in this session.", "id": "Pilih babak eliminasi turnamen yang bertanding pada sesi ini." },
    "event_schedule.err_load_schedule": { "en": "Failed to fetch tournament schedule data", "id": "Gagal mengambil data jadwal turnamen" },
    "org_targets.map_title": { "en": "Target Butt Allocation Map", "id": "Peta Target Bantalan" },

    # teams
    "event_teams.mixed_team_notice": { "en": "Mixed Team must consist of 1 male archer and 1 female archer from the same club.", "id": "Mixed Team wajib terdiri dari 1 pemanah putra dan 1 pemanah putri dari klub yang sama." },
    "event_teams.toast_mixed_gender_required": { "en": "Mixed Team must consist of 1 male and 1 female archer", "id": "Mixed team wajib terdiri dari 1 pemanah putra dan 1 pemanah putri" },

    # units
    "my_events.tournaments_unit": { "en": "Tournaments", "id": "Turnamen" },
    "subscription.promo.extra": { "en": "Extra Quota", "id": "Kuota Tambahan" },
    "subscription.promo.total_value": { "en": "Total Value", "id": "Nilai Total" },
    "sidebar.community": { "en": "Community", "id": "Komunitas" },
    "sidebar.archers": { "en": "Archers", "id": "Pemanah" },
    "sidebar.management": { "en": "Management", "id": "Manajemen" },
    "sidebar.tournaments": { "en": "Tournaments", "id": "Turnamen" },
    "sidebar.articles": { "en": "Articles", "id": "Artikel" },
    "event_elimination.toast_scoresheet_downloaded": { "en": "Scoresheet PDF downloaded successfully", "id": "Scoresheet PDF berhasil diunduh" },
    "event_elimination.save_end_btn": { "en": "Save End", "id": "Simpan End" },
    "common.error_occurred": { "en": "An Error Occurred Loading Page", "id": "Terjadi Kendala Memuat Halaman" },
    "common.error_desc": { "en": "The page encountered a temporary rendering error during navigation.", "id": "Halaman mengalami kendala rendering sementara saat navigasi." },
    "common.retry": { "en": "Reload Component", "id": "Muat Ulang Komponen" },
    "participant.detail.method_cash": { "en": "Cash", "id": "Tunai (Cash)" },
    "participant.detail.source_invited": { "en": "Direct EO Invitation", "id": "Undangan Langsung EO" },
    "participant.detail.source_organizer_added": { "en": "Added by Organizer", "id": "Ditambahkan Penyelenggara" },
    "participant.detail.source_self_register": { "en": "Self-Registration (Website)", "id": "Mandiri (Website)" },
    "participant.detail.registration_source_label": { "en": "Registration Source", "id": "Sumber Pendaftaran" },
    "participant.detail.category_fallback": { "en": "Category", "id": "Kategori" },
    "participant.detail.back_to_list": { "en": "Back to Participants List", "id": "Kembali ke Daftar Peserta" },
    "event_create.visibility_title": { "en": "Tournament Visibility", "id": "Visibilitas Turnamen" },
    "event_create.visibility_subtitle": { "en": "Choose whether the tournament is listed in the public directory or only accessible via direct link.", "id": "Tentukan apakah turnamen ditampilkan di direktori publik atau hanya via link langsung." },
    "event_create.visibility_external_title": { "en": "Public / Listed", "id": "External / Publik" },
    "event_create.visibility_external_desc": { "en": "Tournament appears on the tournament directory (/tournaments), is publicly discoverable, and indexed by search engines.", "id": "Turnamen muncul di halaman daftar turnamen (/tournaments), dapat diakses publik, dan terindeks oleh search engine." },
    "event_create.visibility_internal_title": { "en": "Private / Unlisted", "id": "Internal / Tersembunyi" },
    "event_create.visibility_internal_desc": { "en": "Tournament page remains active via direct link, but does not appear in the public directory and is excluded from search engine indexing (noindex).", "id": "Halaman turnamen tetap aktif via link langsung, tetapi tidak muncul di daftar turnamen dan tidak diindeks search engine (noindex)." },
    "elimination.status": { "en": "Elimination Status", "id": "Status Eliminasi" },
    "elimination.bracket_path": { "en": "Elimination Bracket Path", "id": "Alur Eliminasi" },
    "elimination.not_reached": { "en": "Not reached elimination stage yet", "id": "Belum mencapai eliminasi" },
    "qualification.qual_rank": { "en": "Qualification Rank", "id": "Peringkat Kualifikasi" },
    "qualification.journey": { "en": "Qualification Track", "id": "Jejak Kualifikasi" },
    "event_elimination.failed_load": { "en": "Failed to Load Elimination Bracket", "id": "Gagal Memuat Bagan Eliminasi" },
    "event_elimination.redirecting": { "en": "Redirecting to elimination page...", "id": "Mengalihkan ke halaman eliminasi..." },

    # settings page
    "settings.title": { "en": "Account Settings", "id": "Pengaturan Akun" },
    "settings.subtitle": { "en": "Manage your account security, password, and theme preferences.", "id": "Kelola keamanan akun, kata sandi, dan preferensi tema tampilan dashboard Anda." },
    "settings.security_title": { "en": "Account Security", "id": "Keamanan Akun" },
    "settings.security_subtitle": { "en": "Manage your email address and password to protect your account access.", "id": "Kelola alamat email dan kata sandi untuk melindungi akses akun Anda." },
    "settings.change_email": { "en": "Change Email Address", "id": "Ubah Alamat Email" },
    "settings.current_email": { "en": "Current Email", "id": "Email Saat Ini" },
    "settings.new_email": { "en": "New Email Address", "id": "Alamat Email Baru" },
    "settings.new_email_placeholder": { "en": "Enter new email address", "id": "Masukkan alamat email baru" },
    "settings.send_otp": { "en": "Send OTP", "id": "Kirim OTP" },
    "settings.email_hint": { "en": "We will send a 6-digit verification code to the new email address.", "id": "Kami akan mengirimkan 6 digit kode verifikasi ke alamat email baru." },
    "settings.otp_sent_to": { "en": "OTP code has been sent to <strong>{email}</strong>", "id": "Kode OTP telah dikirim ke <strong>{email}</strong>" },
    "settings.verification_code": { "en": "Verification Code (OTP)", "id": "Kode Verifikasi (OTP)" },
    "settings.verify_change": { "en": "Verify & Save", "id": "Verifikasi & Simpan" },
    "settings.use_different_email": { "en": "Use Another Email", "id": "Gunakan Email Lain" },
    "settings.change_password": { "en": "Change Password", "id": "Ubah Kata Sandi" },
    "settings.set_password": { "en": "Set Password", "id": "Atur Kata Sandi" },
    "settings.new_password": { "en": "New Password", "id": "Kata Sandi Baru" },
    "settings.confirm_password": { "en": "Confirm New Password", "id": "Konfirmasi Kata Sandi Baru" },
    "settings.theme_title": { "en": "Theme & Appearance", "id": "Tema & Tampilan Dashboard" },
    "settings.theme_subtitle": { "en": "Choose color palettes and visual appearance for your dashboard.", "id": "Pilih kombinasi warna dan tema tampilan sesuai preferensi visual Anda." },
    "settings.tab_security": { "en": "Account Security", "id": "Keamanan Akun" },
    "settings.tab_theme": { "en": "Theme & Appearance", "id": "Tema & Tampilan" },
    "settings.theme_look": { "en": "{name} Theme Look", "id": "Tampilan Tema {name}" },
    "settings.toast_password_mismatch": { "en": "Password confirmation does not match", "id": "Konfirmasi kata sandi tidak cocok" },
    "settings.toast_password_length": { "en": "Password must be at least 6 characters", "id": "Kata sandi minimal 6 karakter" },
    "settings.toast_password_success": { "en": "Password updated successfully!", "id": "Kata sandi berhasil diperbarui!" },
    "settings.toast_password_error": { "en": "Failed to update password", "id": "Gagal memperbarui kata sandi" },
    "settings.toast_otp_sent": { "en": "OTP code has been sent to your new email", "id": "Kode OTP telah dikirim ke email baru Anda" },
    "settings.toast_otp_error": { "en": "Failed to send OTP code", "id": "Gagal mengirim kode OTP" },
    "settings.toast_save_success": { "en": "Email changed successfully!", "id": "Email berhasil diubah!" },
    "settings.toast_verify_error": { "en": "OTP code is invalid or expired", "id": "Kode OTP tidak valid atau kedaluwarsa" },
    "settings.connected_methods": { "en": "Connected Login Methods", "id": "Metode Login Terhubung" },
    "settings.google_login": { "en": "Google Account", "id": "Akun Google" },
    "settings.google_login_desc": { "en": "Sign in quickly using your Google account", "id": "Masuk cepat menggunakan akun Google Anda" },
    "settings.email_password": { "en": "Email & Password", "id": "Email & Password" },
    "settings.email_password_desc": { "en": "Sign in using email address and password", "id": "Masuk menggunakan alamat email dan kata sandi" },
    "settings.connected": { "en": "Connected", "id": "Terhubung" },
    "settings.not_connected": { "en": "Not Connected", "id": "Belum Terhubung" },
    "settings.connect": { "en": "Connect", "id": "Hubungkan" },
    "settings.active": { "en": "Active", "id": "Aktif" },
    "settings.not_active": { "en": "Inactive", "id": "Tidak aktif" }
}

def set_nested_value(data, path, val):
    parts = path.split('.')
    cur = data
    for p in parts[:-1]:
        if p not in cur or not isinstance(cur[p], dict):
            cur[p] = {}
        cur = cur[p]
    cur[parts[-1]] = val

# Target files mapping for key prefixes
# Determine which file should hold which key
def get_target_file(key):
    if key.startswith('archer_archers.'):
        return 'archers'
    elif key.startswith(('leaderboard_page.', 'my_registration.', 'qualification.', 'registration.', 'event_', 'events.', 'category.', 'participant.', 'org_targets.')):
        return 'tournaments'
    elif key.startswith(('earnings.', 'subscription.', 'payment.', 'organizer.bank_accounts.')):
        return 'commerce'
    elif key.startswith(('settings.', 'auth.')):
        return 'auth'
    elif key.startswith(('common.', 'navigation.', 'sidebar.', 'my_events.')):
        return 'common'
    else:
        return 'dashboard'

# Load files
en_files = {}
id_files = {}
for f in ['common', 'auth', 'dashboard', 'tournaments', 'archers', 'commerce']:
    with open(os.path.join(locales_dir, 'en', f'{f}.json'), 'r', encoding='utf-8') as fp:
        en_files[f] = json.load(fp)
    with open(os.path.join(locales_dir, 'id', f'{f}.json'), 'r', encoding='utf-8') as fp:
        id_files[f] = json.load(fp)

# Insert all translations
for key, trans in translations.items():
    tf = get_target_file(key)
    set_nested_value(en_files[tf], key, trans['en'])
    set_nested_value(id_files[tf], key, trans['id'])

# Save back to files
for f in ['common', 'auth', 'dashboard', 'tournaments', 'archers', 'commerce']:
    with open(os.path.join(locales_dir, 'en', f'{f}.json'), 'w', encoding='utf-8') as fp:
        json.dump(en_files[f], fp, indent=2, ensure_ascii=False)
    with open(os.path.join(locales_dir, 'id', f'{f}.json'), 'w', encoding='utf-8') as fp:
        json.dump(id_files[f], fp, indent=2, ensure_ascii=False)

print("Successfully synced and updated all missing translations in en and id JSON files.")
