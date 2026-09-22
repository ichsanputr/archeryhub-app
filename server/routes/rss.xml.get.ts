import { defineEventHandler, setResponseHeader } from 'h3'

interface RssItem {
  title: string
  link: string
  description: string
  pubDate: string
  guid?: string
  category?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://archeris.net').replace(/\/+$/, '')
  const apiBaseUrl = (config.apiBaseUrl || config.public.apiBaseUrl || 'http://localhost:8001').replace(/\/+$/, '')

  const items: RssItem[] = []

  // 1. Dynamic Blog Articles
  try {
    const articlesRes: any = await $fetch(`${apiBaseUrl}/blog/articles`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)

    const articles = articlesRes?.articles || articlesRes?.data || (Array.isArray(articlesRes) ? articlesRes : [])
    if (Array.isArray(articles)) {
      for (const article of articles) {
        if (article?.slug) {
          const pubDate = article.created_at || article.updated_at || new Date().toISOString()
          items.push({
            title: article.title || 'Blog Article',
            link: `${siteUrl}/blog/${article.slug}`,
            guid: `${siteUrl}/blog/${article.slug}`,
            description: article.excerpt || article.summary || article.description || article.title || '',
            category: article.category || 'Archery',
            pubDate: new Date(pubDate).toUTCString()
          })
        }
      }
    }
  } catch (_) {}

  // 2. Dynamic Tournaments
  try {
    const tournamentsRes: any = await $fetch(`${apiBaseUrl}/tournaments`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)

    const tournaments = tournamentsRes?.tournaments || tournamentsRes?.events || tournamentsRes?.data || (Array.isArray(tournamentsRes) ? tournamentsRes : [])
    if (Array.isArray(tournaments)) {
      for (const t of tournaments) {
        if (t?.visibility === 'internal') continue
        const slug = t?.slug || t?.uuid || t?.id
        if (slug) {
          const pubDate = t.created_at || t.start_date || new Date().toISOString()
          items.push({
            title: `Tournament: ${t.name || 'Archery Tournament'}`,
            link: `${siteUrl}/tournaments/${slug}`,
            guid: `${siteUrl}/tournaments/${slug}`,
            description: t.description || t.location || `Archery championship event: ${t.name}`,
            category: 'Tournament',
            pubDate: new Date(pubDate).toUTCString()
          })
        }
      }
    }
  } catch (_) {}

  // 3. Dynamic Documentation
  try {
    const docsRes: any = await $fetch(`${apiBaseUrl}/docs`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)

    const docs = Array.isArray(docsRes) ? docsRes : (docsRes?.docs || docsRes?.data || [])
    if (Array.isArray(docs)) {
      for (const doc of docs) {
        if (doc?.slug) {
          const pubDate = doc.updated_at || doc.created_at || new Date().toISOString()
          items.push({
            title: `Guide: ${doc.title || doc.slug}`,
            link: `${siteUrl}/docs/${doc.slug}`,
            guid: `${siteUrl}/docs/${doc.slug}`,
            description: doc.description || doc.excerpt || `Archeris documentation: ${doc.title}`,
            category: 'Documentation',
            pubDate: new Date(pubDate).toUTCString()
          })
        }
      }
    }
  } catch (_) {}

  // Sort by date (descending)
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Archeris - Digital Archery Scoring &amp; Tournament Platform</title>
    <link>${siteUrl}</link>
    <description>Latest archery tournaments, scoring updates, articles, and guides from Archeris.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid>${item.guid || item.link}</guid>
      <description><![CDATA[${item.description}]]></description>
      ${item.category ? `<category><![CDATA[${item.category}]]></category>` : ''}
      <pubDate>${item.pubDate}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return rss
})
