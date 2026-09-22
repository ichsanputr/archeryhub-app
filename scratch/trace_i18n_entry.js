async function main() {
  const res = await fetch('https://archeris.net/_nuxt/sPQs-b1S.js');
  const text = await res.text();
  console.log('Entry length:', text.length);
  const i18nIdx = text.indexOf('createI18n');
  if (i18nIdx !== -1) {
    console.log('createI18n snippet:', text.slice(Math.max(0, i18nIdx - 100), i18nIdx + 300));
  } else {
    console.log('No createI18n in entry.');
  }

  // Find all matches for locale or messages in entry
  const messagesIdx = text.indexOf('messages:');
  console.log('messages: index:', messagesIdx);
  if (messagesIdx !== -1) {
    console.log('messages snippet:', text.slice(Math.max(0, messagesIdx - 100), messagesIdx + 200));
  }
}

main().catch(console.error);
