#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audit Missing Translations for Organizer Dashboard Pages
Finds all t('...') calls in Vue files and checks if they exist in JSON translation files
"""
import json
import re
import sys
from pathlib import Path
from collections import defaultdict

# Force UTF-8 output
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Define base paths
APP_DIR = Path(__file__).parent
PAGES_DIR = APP_DIR / 'pages' / 'dashboard' / 'organizer'
LOCALES_DIR = APP_DIR / 'i18n' / 'locales'

# Load translation files
en_files = {}
id_files = {}

# Load from /i18n/locales/
for json_file in (LOCALES_DIR / 'en').glob('*.json'):
    with open(json_file) as f:
        en_files[json_file.stem] = json.load(f)

for json_file in (LOCALES_DIR / 'id').glob('*.json'):
    with open(json_file) as f:
        id_files[json_file.stem] = json.load(f)

# Also load from /locales/ (for pages using useI18n())
LOCALES_ROOT = APP_DIR / 'locales'
if LOCALES_ROOT.exists():
    for lang in ['en', 'id']:
        root_file = LOCALES_ROOT / f'{lang}.json'
        if root_file.exists():
            with open(root_file) as f:
                data = json.load(f)
                en_files[f'{lang}_root'] = data if lang == 'en' else {}
                id_files[f'{lang}_root'] = data if lang == 'id' else {}

def merge_dicts(dicts):
    """Deep merge multiple dicts"""
    result = {}
    for d in dicts:
        for k, v in d.items():
            if k in result and isinstance(result[k], dict) and isinstance(v, dict):
                result[k] = merge_dicts([result[k], v])
            else:
                result[k] = v
    return result

en_messages = merge_dicts(list(en_files.values()))
id_messages = merge_dicts(list(id_files.values()))

def get_nested_value(d, path):
    """Get value from nested dict using dot notation"""
    parts = path.split('.')
    current = d
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return None
    return current if isinstance(current, str) else None

def find_translation_keys_in_vue(vue_file):
    """Extract all t('...') calls from Vue file"""
    with open(vue_file) as f:
        content = f.read()
    
    # Match patterns: t('key'), t("key"), t(\`key\`)
    patterns = [
        r"t\('([^']+)'\)",
        r't\("([^"]+)"\)',
        r't\(`([^`]+)`\)',
    ]
    
    keys = set()
    for pattern in patterns:
        matches = re.findall(pattern, content)
        keys.update(matches)
    
    return keys

# Scan all organizer pages
missing_en = defaultdict(list)
missing_id = defaultdict(list)
all_keys_found = set()

print("\n" + "="*80)
print("AUDIT: Missing Translations in Organizer Dashboard")
print("="*80)

vue_files = sorted(PAGES_DIR.rglob('*.vue'))
print(f"\nScanning {len(vue_files)} Vue files...\n")

for vue_file in vue_files:
    rel_path = vue_file.relative_to(PAGES_DIR)
    keys = find_translation_keys_in_vue(vue_file)
    
    if not keys:
        continue
    
    print(f"\n[FILE] {rel_path}:")
    print(f"   Found {len(keys)} translation keys")
    
    for key in sorted(keys):
        all_keys_found.add(key)
        en_value = get_nested_value(en_messages, key)
        id_value = get_nested_value(id_messages, key)
        
        status = "[OK]"
        if not en_value:
            missing_en[key].append(str(rel_path))
            status = "[MISSING_EN]"
        elif not id_value:
            missing_id[key].append(str(rel_path))
            status = "[MISSING_ID]"
        
        if status != "[OK]":
            print(f"   {status} {key}")

# Summary
print("\n" + "="*80)
print("SUMMARY")
print("="*80)

print(f"\nTotal unique keys found: {len(all_keys_found)}")
print(f"Missing in English: {len(missing_en)}")
print(f"Missing in Indonesian: {len(missing_id)}")

if missing_en:
    print("\n[MISSING_EN] IN ENGLISH:")
    for key in sorted(missing_en.keys()):
        print(f"  - {key}")
        for file in sorted(set(missing_en[key])):
            print(f"    In: {file}")

if missing_id:
    print("\n[MISSING_ID] IN INDONESIAN:")
    for key in sorted(missing_id.keys()):
        print(f"  - {key}")
        for file in sorted(set(missing_id[key])):
            print(f"    In: {file}")

# Generate JSON template for missing keys
if missing_en or missing_id:
    print("\n" + "="*80)
    print("SUGGESTED JSON STRUCTURE")
    print("="*80)
    
    missing_keys = set(missing_en.keys()) | set(missing_id.keys())
    
    # Group by prefix
    grouped = defaultdict(lambda: defaultdict(dict))
    for key in sorted(missing_keys):
        parts = key.split('.')
        if len(parts) >= 2:
            prefix = parts[0]
            subkey = '.'.join(parts[1:])
            grouped[prefix][subkey] = f"[TRANSLATE: {key}]"
    
    for prefix in sorted(grouped.keys()):
        print(f"\n  \"{prefix}\": {{")
        for subkey, value in sorted(grouped[prefix].items()):
            print(f"    \"{subkey}\": \"{value}\",")
        print("  }")

print("\n" + "="*80 + "\n")
