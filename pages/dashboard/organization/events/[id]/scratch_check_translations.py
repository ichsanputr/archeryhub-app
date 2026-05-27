import json

en_path = r"C:\E\ichsan\startup\archeryhub.id\app\i18n\locales\en.json"
id_path = r"C:\E\ichsan\startup\archeryhub.id\app\i18n\locales\id.json"

new_en = {
    "archer": "Archer",
    "event": "Event",
    "checkin_time": "Check-in Date/Time",
    "reference": "Reference",
    "user": "User",
    "amount": "Amount",
    "method": "Method",
    "status": "Status",
    "date": "Date",
    "event_name": "Event Name",
    "event_dates": "Event Dates",
    "categories_count": "Categories Count",
    "registrants_capacity": "Registrants / Capacity",
    "quota_fill_rate": "Quota Fill Rate"
}

new_id = {
    "archer": "Pemanah",
    "event": "Event",
    "checkin_time": "Tanggal/Waktu Check-in",
    "reference": "Referensi",
    "user": "Pengguna",
    "amount": "Jumlah",
    "method": "Metode",
    "status": "Status",
    "date": "Tanggal",
    "event_name": "Nama Event",
    "event_dates": "Tanggal Event",
    "categories_count": "Jumlah Kategori",
    "registrants_capacity": "Pendaftar / Kapasitas",
    "quota_fill_rate": "Tingkat Keterisian Kuota"
}

for path, translation_map in [(en_path, new_en), (id_path, new_id)]:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    reports = data.setdefault("dashboard", {}).setdefault("reports", {})
    for k, v in translation_map.items():
        reports[k] = v
        
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

print("Report headers translations added successfully.")
