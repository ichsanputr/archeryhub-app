// Archery Hub / Archeris Documentation Translator Utility
// Supports English (en) and Indonesian (id)

export function translateText(text, locale, slug = '') {
  return text;
}

export function translateDoc(doc, locale) {
  if (!doc) return doc;

  return {
    ...doc,
    readTime: doc.readTime ? doc.readTime.replace('menit', locale === 'en' ? 'min' : 'menit').replace('hari', locale === 'en' ? 'days' : 'hari') : ''
  };
}
