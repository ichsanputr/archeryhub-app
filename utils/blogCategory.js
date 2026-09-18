// Blog Category helper and metadata definitions

export const CATEGORY_DEFINITIONS = [
  {
    slug: 'gear-and-equipment',
    aliases: ['gear-equipment', 'gear', 'equipment', 'archery-equipment', 'bow-types', 'physics-sizing'],
    name: 'Gear & Equipment',
    shortName: 'Gear & Equipment',
    description: 'In-depth breakdowns of bow types, arrows, spine mechanics, cams & let-off, sizing, and gear selection.',
    icon: 'ph:bow-bold',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    heroGradient: 'from-amber-600/30 to-amber-900/10'
  },
  {
    slug: 'rules-and-scoring',
    aliases: ['rules-scoring', 'rules', 'scoring', 'rules-tournaments', 'tournaments'],
    name: 'Rules & Scoring',
    shortName: 'Rules & Scoring',
    description: 'Target scoring, Olympic set system formats, elimination brackets, indoor vs outdoor rules, and tournament procedures.',
    icon: 'ph:target-bold',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
    heroGradient: 'from-sky-600/30 to-sky-900/10'
  },
  {
    slug: 'guides-and-technique',
    aliases: ['guides-technique', 'guides', 'technique', 'training', 'shooting-basics'],
    name: 'Guides & Technique',
    shortName: 'Guides & Technique',
    description: 'Step-by-step shooting guides, form mechanics, anchor points, release execution, and mental performance.',
    icon: 'ph:crosshair-bold',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    heroGradient: 'from-emerald-600/30 to-emerald-900/10'
  }
]

export const categoryToSlug = (categoryName) => {
  if (!categoryName) return ''
  const trimmed = categoryName.trim()
  const matched = CATEGORY_DEFINITIONS.find(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase()
  )
  if (matched) return matched.slug

  return trimmed
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export const getCategoryInfo = (slugOrName) => {
  if (!slugOrName) return null
  const query = slugOrName.trim().toLowerCase()
  
  // Exact slug match
  let found = CATEGORY_DEFINITIONS.find(c => c.slug === query)
  if (found) return found

  // Name match
  found = CATEGORY_DEFINITIONS.find(c => c.name.toLowerCase() === query)
  if (found) return found

  // Alias match
  found = CATEGORY_DEFINITIONS.find(c => c.aliases && c.aliases.includes(query))
  if (found) return found

  // Slugified fallback match
  const generatedSlug = categoryToSlug(slugOrName)
  found = CATEGORY_DEFINITIONS.find(c => c.slug === generatedSlug)
  if (found) return found

  // Dynamic fallback for any unlisted category
  const formattedTitle = slugOrName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\bAnd\b/g, '&')

  return {
    slug: generatedSlug,
    name: formattedTitle,
    shortName: formattedTitle,
    description: `Browse articles and archery scoring resources in ${formattedTitle}.`,
    icon: 'ph:folder-bold',
    badgeClass: 'bg-slate-100 text-navy border-slate-200',
    heroGradient: 'from-slate-700/30 to-slate-900/10'
  }
}
