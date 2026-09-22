"""
Precise i18n Audit for Dashboard Vue Files
===========================================
Strategy: Parse each .vue file at AST-level (via regex-based structured extraction)
and detect ALL user-visible text that is NOT wrapped in a t() call.

Detection targets:
  1. Raw text nodes between tags: >Some text< (not inside {{ }})
  2. Static attribute values: label="...", placeholder="...", title="...", tooltip="..."
  3. Bound attribute string literals: :label="'Some text'" or :placeholder="'text'"
  4. JS string constants assigned to reactive display vars (basic)
  5. t() calls using keys that DON'T exist in either en locale files

Output: grouped by file, with line number, type of issue, and the actual text.
"""

import os
import re
import json
from pathlib import Path

# ────────────────────────────────────────────────────────────────────────────
# CONFIG
# ────────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent.parent  # → app/

DASHBOARD_DIRS = [
    BASE_DIR / 'pages' / 'dashboard',
    BASE_DIR / 'components' / 'dashboard',
    BASE_DIR / 'components' / 'elimination',
    BASE_DIR / 'components' / 'layout',
]

LOCALE_DIR_EN = BASE_DIR / 'i18n' / 'locales' / 'en'

OUTPUT_FILE = BASE_DIR / 'scripts' / 'audit_i18n_report.json'
REPORT_FILE = BASE_DIR / 'scripts' / 'audit_i18n_report.txt'

# Attributes that should carry translated text
TRANSLATABLE_ATTRS = {
    'label', 'placeholder', 'title', 'tooltip', 'hint',
    'description', 'header', 'message', 'text', 'caption',
    'no-data-text', 'empty-text', 'helper-text', 'error-message',
    'confirm-text', 'cancel-text', 'ok-text', 'submit-text',
}

# Minimum text length to report (skip single letters, numbers, punctuation)
MIN_TEXT_LENGTH = 2

# Patterns that are definitely NOT user-visible text (skip these)
SKIP_PATTERNS = [
    re.compile(r'^[0-9\s.,:/\-+%#@!?|&*()[\]{}<>~^`"\';]+$'),  # pure symbols/numbers
    re.compile(r'^(true|false|null|undefined|none)$', re.I),     # JS keywords
    re.compile(r'^https?://'),                                    # URLs
    re.compile(r'^\s*$'),                                          # whitespace
    re.compile(r'^[\w-]+$'),  # single identifier word (class name, id, etc.)
    re.compile(r'^\{.*\}$'),  # object/expression already
    re.compile(r'^\$[\w.]+'),  # variable ref
    re.compile(r'^[A-Z_]{2,}$'),  # ALL_CAPS constants (enum keys)
    re.compile(r'^\d+(\.\d+)?(%|px|rem|em|vh|vw)?$'),  # pure dimension values
    re.compile(r'^#[0-9a-fA-F]{3,6}$'),  # hex colors
    re.compile(r'^\w+[-_]\w+$'),  # kebab-case/snake_case identifiers (likely slugs)
]

# Words that indicate the text is actually a translated value (skip from raw text scan)
# These are common in `t('key', 'FallbackText')` — the fallback is inside t()
INSIDE_T_CALL_SKIP = True

# ────────────────────────────────────────────────────────────────────────────
# LOAD ALL EN LOCALE KEYS
# ────────────────────────────────────────────────────────────────────────────

def flatten_keys(obj, prefix=''):
    keys = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            full_key = f"{prefix}.{k}" if prefix else k
            keys.add(full_key)
            keys.update(flatten_keys(v, full_key))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            keys.update(flatten_keys(item, f"{prefix}.{i}"))
    return keys

def load_en_keys():
    all_keys = set()
    if LOCALE_DIR_EN.exists():
        for json_file in LOCALE_DIR_EN.glob('*.json'):
            try:
                with open(json_file, encoding='utf-8') as f:
                    data = json.load(f)
                all_keys.update(flatten_keys(data))
            except Exception as e:
                print(f"  [WARN] Could not load {json_file}: {e}")
    return all_keys

EN_KEYS = load_en_keys()

# ────────────────────────────────────────────────────────────────────────────
# HELPERS
# ────────────────────────────────────────────────────────────────────────────

def is_skippable(text: str) -> bool:
    text = text.strip()
    if len(text) < MIN_TEXT_LENGTH:
        return True
    for pattern in SKIP_PATTERNS:
        if pattern.match(text):
            return True
    return False


def looks_like_user_text(text: str) -> bool:
    """Returns True if the text is likely user-visible natural language."""
    text = text.strip()
    if is_skippable(text):
        return False
    # Must contain at least one letter
    if not re.search(r'[a-zA-ZÀ-ÿ\u0100-\u017E\u0180-\u024F\u0250-\u02AF]', text):
        return False
    return True


def remove_t_calls(text: str) -> str:
    """Remove t('...') and $t('...') calls so fallbacks inside don't trigger."""
    # Remove: t('key', 'Fallback text') or $t('key')
    text = re.sub(r'\$?t\s*\([^)]*\)', '__T_CALL__', text)
    return text


def extract_line_number(content_before_pos: str) -> int:
    return content_before_pos.count('\n') + 1


# ────────────────────────────────────────────────────────────────────────────
# EXTRACTION: Raw text nodes
# ────────────────────────────────────────────────────────────────────────────

def extract_raw_text_nodes(template: str, orig_lines: list) -> list:
    """
    Find raw text between > and < that is NOT inside {{ }} interpolation.
    i.e.:  >Some hardcoded text<  (not  >{{ t('key') }}<)
    """
    issues = []

    # Pattern: capture text between > and <, but skip pure whitespace
    # Allow multiline captures only if short (single-line preferred)
    pattern = re.compile(r'>([^<>{}]{2,})<', re.MULTILINE)

    for m in pattern.finditer(template):
        raw = m.group(1).strip()
        if not looks_like_user_text(raw):
            continue
        # Skip if it looks like a mustache-only line
        if '{{' in raw or '}}' in raw:
            continue
        # Skip if entirely inside a comment
        # Approximate line number
        line_no = template[:m.start()].count('\n') + 1
        issues.append({
            'type': 'raw_text',
            'line': line_no,
            'text': raw,
            'context': m.group(0)[:100],
        })

    return issues


# ────────────────────────────────────────────────────────────────────────────
# EXTRACTION: Static attribute values
# ────────────────────────────────────────────────────────────────────────────

def extract_static_attrs(template: str) -> list:
    """
    Find: label="Some Text" or placeholder="Enter name" etc.
    NOT :label="someVar" (dynamic)
    NOT :label="t('key')" (translated dynamic)
    """
    issues = []

    # Static: label="..." (no leading colon/v-bind:)
    # Ensure NOT preceded by : or v-bind:
    for attr in TRANSLATABLE_ATTRS:
        # Match `attr="value"` where attr is NOT preceded by : or v-bind
        # Negative lookbehind for : or v-bind:
        pattern = re.compile(
            r'(?<![:\w])' + re.escape(attr) + r'\s*=\s*"([^"]{2,})"',
            re.IGNORECASE
        )
        for m in pattern.finditer(template):
            val = m.group(1).strip()
            if not looks_like_user_text(val):
                continue
            line_no = template[:m.start()].count('\n') + 1
            issues.append({
                'type': f'static_attr:{attr}',
                'line': line_no,
                'text': val,
                'context': m.group(0)[:100],
            })

    return issues


# ────────────────────────────────────────────────────────────────────────────
# EXTRACTION: Bound attribute string literals
# ────────────────────────────────────────────────────────────────────────────

def extract_bound_string_literals(template: str) -> list:
    """
    Find: :label="'Some Text'" or :placeholder="'Enter...'"
    These are bound attrs but still hardcoded strings.
    NOT: :label="t('key')" or :label="someVariable"
    """
    issues = []

    for attr in TRANSLATABLE_ATTRS:
        # Match: :attr="'...'" or v-bind:attr="'...'"
        pattern = re.compile(
            r'(?::' + re.escape(attr) + r'|v-bind:' + re.escape(attr) + r')\s*=\s*"\'([^\']{2,})\'"',
            re.IGNORECASE
        )
        for m in pattern.finditer(template):
            val = m.group(1).strip()
            if not looks_like_user_text(val):
                continue
            line_no = template[:m.start()].count('\n') + 1
            issues.append({
                'type': f'bound_literal:{attr}',
                'line': line_no,
                'text': val,
                'context': m.group(0)[:100],
            })

        # Also: :attr="\"Some Text\""  (double-quotes inside)
        pattern2 = re.compile(
            r'(?::' + re.escape(attr) + r'|v-bind:' + re.escape(attr) + r')\s*=\s*\'([^\']{2,})\'',
            re.IGNORECASE
        )
        for m in pattern2.finditer(template):
            val = m.group(1).strip()
            if not looks_like_user_text(val):
                continue
            line_no = template[:m.start()].count('\n') + 1
            issues.append({
                'type': f'bound_literal2:{attr}',
                'line': line_no,
                'text': val,
                'context': m.group(0)[:100],
            })

    return issues


# ────────────────────────────────────────────────────────────────────────────
# EXTRACTION: Button/tag text that contains direct text (no {{ }})
# ────────────────────────────────────────────────────────────────────────────

def extract_button_tag_text(template: str) -> list:
    """
    Buttons, badges, labels, tabs with hardcoded text content (not {{ t('key') }}).
    E.g.: <UButton>Submit</UButton>  or  <span>Aktif</span>
    """
    issues = []

    # Tags likely to contain user-visible labels
    tag_names = r'(?:UButton|UBadge|UTab|ULabel|span|p|h[1-6]|td|th|li|button|label|strong|em|b|small)'
    pattern = re.compile(
        r'<' + tag_names + r'(?:\s[^>]*)?>([^<>{}]{2,})</',
        re.IGNORECASE
    )

    for m in pattern.finditer(template):
        raw = m.group(1).strip()
        if not looks_like_user_text(raw):
            continue
        line_no = template[:m.start()].count('\n') + 1
        issues.append({
            'type': 'tag_text',
            'line': line_no,
            'text': raw,
            'context': m.group(0)[:100],
        })

    return issues


# ────────────────────────────────────────────────────────────────────────────
# EXTRACTION: Missing t() keys (key used but not in EN locale)
# ────────────────────────────────────────────────────────────────────────────

def extract_missing_keys(script: str, template: str) -> list:
    """
    Find all t('some.key') calls and check if the key exists in EN locale.
    """
    issues = []
    combined = template + '\n' + script

    # Match t('key') or t("key") or $t('key')
    pattern = re.compile(r'\$?t\s*\(\s*[\'"]([^\'"]+)[\'"]\s*(?:,[^)]+)?\s*\)')

    for m in pattern.finditer(combined):
        key = m.group(1)
        if key not in EN_KEYS:
            # Check parent in combined content
            line_no = combined[:m.start()].count('\n') + 1
            issues.append({
                'type': 'missing_key',
                'line': line_no,
                'text': key,
                'context': m.group(0)[:100],
            })

    return issues


# ────────────────────────────────────────────────────────────────────────────
# EXTRACTION: JS/TS script - string assignments to display vars
# ────────────────────────────────────────────────────────────────────────────

def extract_script_hardcoded(script: str) -> list:
    """
    Find things like:
      const label = 'Semua Kategori'
      { label: 'Aktif', value: 'active' }
      options: [{ text: 'Filter', ... }]
    These often feed select/dropdown options with untranslated text.
    """
    issues = []

    # Pattern: label/text/title/placeholder: 'Some Text'  or  = 'Some Text'
    pattern = re.compile(
        r'(?:label|text|title|placeholder|header|description|name|option|tab|caption)\s*:\s*[\'"]([^\'"]{2,})[\'"]',
        re.IGNORECASE
    )

    for m in pattern.finditer(script):
        val = m.group(1).strip()
        if not looks_like_user_text(val):
            continue
        # Skip if it's inside a t() call
        surrounding = script[max(0, m.start()-20):m.end()+20]
        if 't(' in surrounding or '$t(' in surrounding:
            continue
        line_no = script[:m.start()].count('\n') + 1
        issues.append({
            'type': 'script_string',
            'line': line_no,
            'text': val,
            'context': m.group(0)[:100],
        })

    return issues


# ────────────────────────────────────────────────────────────────────────────
# MAIN: Scan a single .vue file
# ────────────────────────────────────────────────────────────────────────────

def scan_vue_file(filepath: Path) -> dict:
    with open(filepath, encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Extract <template>, <script>, separate
    template_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    script_match = re.search(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)

    template = template_match.group(1) if template_match else ''
    script = script_match.group(1) if script_match else ''

    # Remove HTML comments from template
    template_clean = re.sub(r'<!--.*?-->', '', template, flags=re.DOTALL)

    # Remove t() calls from template before scanning raw text / attrs
    # This prevents fallback strings inside t() from being reported
    template_no_t = remove_t_calls(template_clean)

    issues = []

    # 1. Raw text nodes
    issues += extract_raw_text_nodes(template_no_t, [])

    # 2. Static attribute values
    issues += extract_static_attrs(template_no_t)

    # 3. Bound string literals in attrs
    issues += extract_bound_string_literals(template_no_t)

    # 4. Button / tag text
    issues += extract_button_tag_text(template_no_t)

    # 5. Script hardcoded label/text strings
    issues += extract_script_hardcoded(script)

    # 6. Missing translation keys
    issues += extract_missing_keys(script, template_clean)

    # Deduplicate by (type, line, text)
    seen = set()
    deduped = []
    for issue in issues:
        key = (issue['type'], issue['line'], issue['text'])
        if key not in seen:
            seen.add(key)
            deduped.append(issue)

    # Sort by line number
    deduped.sort(key=lambda x: x['line'])

    return {
        'file': str(filepath.relative_to(BASE_DIR.parent)).replace('\\', '/'),
        'total_issues': len(deduped),
        'issues': deduped,
    }


# ────────────────────────────────────────────────────────────────────────────
# MAIN: Walk all dashboard dirs
# ────────────────────────────────────────────────────────────────────────────

def run_audit():
    print("=" * 70)
    print("  ARCHERYHUB.ID — Dashboard i18n Precise Audit")
    print("=" * 70)
    print(f"  Loaded {len(EN_KEYS)} EN locale keys from {LOCALE_DIR_EN}")
    print()

    all_results = []
    total_files = 0

    for base_dir in DASHBOARD_DIRS:
        if not base_dir.exists():
            print(f"  [SKIP] Directory not found: {base_dir}")
            continue
        for vue_file in sorted(base_dir.rglob('*.vue')):
            total_files += 1
            result = scan_vue_file(vue_file)
            if result['total_issues'] > 0:
                all_results.append(result)

    # Sort by most issues first
    all_results.sort(key=lambda x: x['total_issues'], reverse=True)

    # ── Summary ──
    total_issues = sum(r['total_issues'] for r in all_results)
    files_with_issues = len(all_results)

    print(f"  Files scanned   : {total_files}")
    print(f"  Files with issues: {files_with_issues}")
    print(f"  Total issues     : {total_issues}")
    print()

    # ── Write JSON output ──
    json_output = {
        'summary': {
            'total_files_scanned': total_files,
            'files_with_issues': files_with_issues,
            'total_issues': total_issues,
            'en_keys_loaded': len(EN_KEYS),
        },
        'files': all_results,
    }
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(json_output, f, indent=2, ensure_ascii=False)

    # ── Write human-readable TXT report ──
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write("ARCHERYHUB.ID — Dashboard i18n Audit Report\n")
        f.write("=" * 70 + "\n")
        f.write(f"Files scanned    : {total_files}\n")
        f.write(f"Files with issues: {files_with_issues}\n")
        f.write(f"Total issues     : {total_issues}\n")
        f.write(f"EN keys loaded   : {len(EN_KEYS)}\n")
        f.write("=" * 70 + "\n\n")

        for r in all_results:
            f.write(f"\n{'─' * 70}\n")
            f.write(f"FILE: {r['file']}  ({r['total_issues']} issues)\n")
            f.write(f"{'─' * 70}\n")

            # Group by type
            by_type = {}
            for issue in r['issues']:
                t_type = issue['type']
                by_type.setdefault(t_type, []).append(issue)

            for t_type, type_issues in sorted(by_type.items()):
                type_labels = {
                    'raw_text': '[RAW]     Raw hardcoded text between tags',
                    'tag_text': '[TAG]     Hardcoded text inside common tags',
                    'missing_key': '[MISSING] t() key missing from EN locale',
                    'script_string': '[SCRIPT]  Hardcoded string in <script>',
                }
                for prefix in ['static_attr:', 'bound_literal:', 'bound_literal2:']:
                    if t_type.startswith(prefix):
                        attr = t_type[len(prefix):]
                        type_labels[t_type] = f'[ATTR]    Hardcoded {attr}= attribute'

                label = type_labels.get(t_type, f'[OTHER]   {t_type}')
                f.write(f"\n  {label} ({len(type_issues)} occurrences):\n")
                for issue in type_issues:
                    f.write(f"    Line {issue['line']:4d}: {issue['text'][:80]}\n")
                    if issue.get('context') and issue['context'] != issue['text']:
                        ctx = issue['context'][:90].replace('\n', ' ').strip()
                        f.write(f"             ↳ {ctx}\n")

        f.write("\n" + "=" * 70 + "\n")
        f.write("END OF REPORT\n")

    print(f"  [JSON] output : {OUTPUT_FILE}")
    print(f"  [TXT]  report : {REPORT_FILE}")
    print()
    print("  Top 10 files with most issues:")
    for r in all_results[:10]:
        print(f"    [{r['total_issues']:3d}] {r['file']}")


if __name__ == '__main__':
    run_audit()
