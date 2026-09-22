import { defineEventHandler, setResponseHeader } from 'h3'

const HOST = 'archeris.net'
const KEY = '1b3gtpa5u5gnancxwxg7aqv4d6tvzz95'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const BASE_URL = `https://${HOST}`

const STATIC_PAGES = [
  '/',
  '/tournaments',
  '/package',
  '/blog',
  '/docs',
  '/archers',
  '/organizer',
  '/archeris-vs-ianseo',
  '/about-us',
  '/faq',
  '/contact',
  '/terms',
  '/privacy',
  '/disclaimer'
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = (config.apiBaseUrl || config.public.apiBaseUrl || 'http://localhost:8001').replace(/\/+$/, '')
  const urls = new Set<string>()

  // 1. Static Core Pages
  STATIC_PAGES.forEach(page => urls.add(`${BASE_URL}${page}`))

  // 2. Dynamic Blog Articles
  try {
    const articlesRes: any = await $fetch(`${apiBaseUrl}/blog/articles`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)
    const articles = articlesRes?.articles || articlesRes?.data || (Array.isArray(articlesRes) ? articlesRes : [])
    if (Array.isArray(articles)) {
      for (const article of articles) {
        if (article?.slug) {
          urls.add(`${BASE_URL}/blog/${article.slug}`)
        }
      }
    }
  } catch (_) {}

  // 3. Dynamic Tournaments (Exclude Internal)
  try {
    const tournamentsRes: any = await $fetch(`${apiBaseUrl}/tournaments?limit=1000`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)
    const tournaments = tournamentsRes?.tournaments || tournamentsRes?.events || tournamentsRes?.data || (Array.isArray(tournamentsRes) ? tournamentsRes : [])
    if (Array.isArray(tournaments)) {
      for (const t of tournaments) {
        if (t?.visibility === 'internal') continue
        const slug = t?.slug || t?.uuid || t?.id
        if (slug) {
          urls.add(`${BASE_URL}/tournaments/${slug}`)
        }
      }
    }
  } catch (_) {}

  // 5. Dynamic Docs
  try {
    const docsRes: any = await $fetch(`${apiBaseUrl}/docs`, {
      timeout: 3000,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)
    const docs = Array.isArray(docsRes) ? docsRes : (docsRes?.docs || docsRes?.data || [])
    if (Array.isArray(docs)) {
      for (const doc of docs) {
        if (doc?.slug) {
          urls.add(`${BASE_URL}/docs/${doc.slug}`)
        }
      }
    }
  } catch (_) {}

  const urlList = Array.from(urls)
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList
  }

  let response, responseText
  try {
    response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    })
    responseText = await response.text()
  } catch (err: any) {
    setResponseHeader(event, 'Content-Type', 'application/json')
    return { success: false, error: 'Failed to submit to IndexNow', details: err.message }
  }

  setResponseHeader(event, 'Content-Type', 'application/json')
  return {
    success: response.ok,
    status: response.status,
    statusText: response.statusText,
    response: responseText,
    urlCount: urlList.length
  }
})
