import { defineEventHandler, setHeader } from 'h3'

interface SitemapItem {
  url: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://archeris.net').replace(/\/+$/, '')
  const apiBaseUrl = (config.apiBaseUrl || config.public.apiBaseUrl || 'http://localhost:8001').replace(/\/+$/, '')

  const today = new Date().toISOString().split('T')[0]

  // ── 1. Static Core Pages ──
  const staticItems: SitemapItem[] = [
    { url: `${siteUrl}/`, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { url: `${siteUrl}/tournaments`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { url: `${siteUrl}/package`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/blog`, lastmod: today, changefreq: 'daily', priority: 0.8 },
    { url: `${siteUrl}/docs`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/archers`, lastmod: today, changefreq: 'daily', priority: 0.8 },
    { url: `${siteUrl}/organizer`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/archeris-vs-ianseo`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/about-us`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/faq`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/contact`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/terms`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/disclaimer`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
  ]

  const dynamicItems: SitemapItem[] = []

  // ── 2. Dynamic Blog Articles ──
  try {
    const articlesRes: any = await $fetch(`${apiBaseUrl}/blog/articles`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)

    const articles = articlesRes?.articles || articlesRes?.data || (Array.isArray(articlesRes) ? articlesRes : [])
    if (Array.isArray(articles)) {
      for (const article of articles) {
        if (article?.slug) {
          const modDate = article.updated_at || article.created_at || today
          const cleanDate = typeof modDate === 'string' ? modDate.split('T')[0] : today
          dynamicItems.push({
            url: `${siteUrl}/blog/${article.slug}`,
            lastmod: cleanDate,
            changefreq: 'weekly',
            priority: 0.8
          })
        }
      }
    }
  } catch (_) {}

  // ── 3. Dynamic Tournaments ──
  try {
    const tournamentsRes: any = await $fetch(`${apiBaseUrl}/tournaments`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)

    const tournaments = tournamentsRes?.tournaments || tournamentsRes?.events || tournamentsRes?.data || (Array.isArray(tournamentsRes) ? tournamentsRes : [])
    if (Array.isArray(tournaments)) {
      for (const t of tournaments) {
        const slug = t?.slug || t?.uuid || t?.id
        if (slug) {
          const modDate = t.updated_at || t.start_date || today
          const cleanDate = typeof modDate === 'string' ? modDate.split('T')[0] : today
          dynamicItems.push({
            url: `${siteUrl}/tournaments/${slug}`,
            lastmod: cleanDate,
            changefreq: 'daily',
            priority: 0.9
          })
        }
      }
    }
  } catch (_) {}

  // ── 4. Dynamic Archers Profile ──
  try {
    const archersRes: any = await $fetch(`${apiBaseUrl}/archers`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)

    const archers = archersRes?.archers || archersRes?.data || (Array.isArray(archersRes) ? archersRes : [])
    if (Array.isArray(archers)) {
      for (const archer of archers) {
        const slug = archer?.slug || archer?.username || archer?.id
        if (slug) {
          dynamicItems.push({
            url: `${siteUrl}/archers/${slug}`,
            lastmod: today,
            changefreq: 'weekly',
            priority: 0.7
          })
        }
      }
    }
  } catch (_) {}

  // ── 5. Dynamic Documentation Pages ──
  try {
    const docsRes: any = await $fetch(`${apiBaseUrl}/docs`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)

    const docs = Array.isArray(docsRes) ? docsRes : (docsRes?.docs || docsRes?.data || [])
    if (Array.isArray(docs)) {
      for (const doc of docs) {
        if (doc?.slug) {
          dynamicItems.push({
            url: `${siteUrl}/docs/${doc.slug}`,
            lastmod: today,
            changefreq: 'weekly',
            priority: 0.8
          })
        }
      }
    }
  } catch (_) {}

  const allItems = [...staticItems, ...dynamicItems]

  // ── Generate XML ──
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allItems.map(item => `  <url>
    <loc>${item.url}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
    ${item.changefreq ? `<changefreq>${item.changefreq}</changefreq>` : ''}
    ${item.priority ? `<priority>${item.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return xml
})
