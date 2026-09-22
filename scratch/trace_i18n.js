async function main() {
  const res = await fetch('https://archeris.net/');
  const html = await res.text();
  
  const matches = [...html.matchAll(/\/_nuxt\/[a-zA-Z0-9_\-]+\.js/g)].map(m => m[0]);
  const uniqueScripts = [...new Set(matches)];
  console.log('Client JS scripts loaded count:', uniqueScripts.length);
  
  for (const script of uniqueScripts) {
    const sRes = await fetch('https://archeris.net' + script);
    const text = await sRes.text();
    const hasHero = text.includes('home.hero');
    const hasRunning = text.includes('Running Directly');
    const hasNav = text.includes('nav.features');
    const hasTournaments = text.includes('Tournaments');
    if (hasHero || hasRunning || hasNav || hasTournaments) {
      console.log(`Script ${script}: hasHero=${hasHero}, hasRunning=${hasRunning}, hasNav=${hasNav}, hasTournaments=${hasTournaments}`);
    }
  }
}

main().catch(console.error);
