// Blog Category helper and metadata definitions

export const CATEGORY_DEFINITIONS = [
  {
    slug: 'scoring-rules-and-guides',
    aliases: ['scoring-rules-guides', 'scoring-rules', 'scoring'],
    name: 'Scoring Rules & Guides',
    shortName: 'Scoring Rules',
    description: 'Master target ring values, line-cut judgments, arrow score calculation, and World Archery scoring rulebooks.',
    icon: 'ph:target-bold',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    heroGradient: 'from-amber-600/30 to-amber-900/10'
  },
  {
    slug: 'technology-and-innovation',
    aliases: ['technology-innovation', 'technology', 'tech'],
    name: 'Technology & Innovation',
    shortName: 'Technology',
    description: 'Explore cloud scorekeeping, real-time leaderboard synchronization, digital archery tournament management, and electronic targets.',
    icon: 'ph:cpu-bold',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
    heroGradient: 'from-sky-600/30 to-sky-900/10'
  },
  {
    slug: 'tournament-strategy',
    aliases: ['strategy', 'tournaments'],
    name: 'Tournament Strategy',
    shortName: 'Tournament Strategy',
    description: 'Tactics for qualification rounds, elimination match play, set system pacing, mental game, and single-arrow shoot-offs.',
    icon: 'ph:trophy-bold',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    heroGradient: 'from-emerald-600/30 to-emerald-900/10'
  },
  {
    slug: 'club-management',
    aliases: ['management', 'clubs'],
    name: 'Club Management',
    shortName: 'Club Management',
    description: 'Best practices for archery clubs, practice session tracking, athlete handicap calculation, and member engagement.',
    icon: 'ph:users-three-bold',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    heroGradient: 'from-indigo-600/30 to-indigo-900/10'
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
