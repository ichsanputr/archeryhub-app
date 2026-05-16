import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    article: defineCollection({
      type: 'page',
      source: 'article/**/*.md'
    })
  }
})
