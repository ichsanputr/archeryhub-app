interface Product {
  name: string
  category: string
  url: string
  logo: string
}

export const useDownbaduSearch = () => {
  const searchQuery = ref('')
  const searchResults = ref<Product[]>([])
  const isSearching = ref(false)

  // Dummy product data for search
  const dummyProducts = [
    { name: 'AWS Snowball', category: 'Cloud Storage', url: '/products/aws-snowball', logo: 'https://picsum.photos/48' },
    { name: 'OpenLayers', category: 'Maps / B2B SaaS', url: '/products/openlayers', logo: 'https://picsum.photos/48' },
    { name: 'Testlemon', category: 'Developer Tools', url: '/products/testlemon', logo: 'https://picsum.photos/48' },
    { name: 'IP Defender', category: 'Legal / Intellectual Property', url: '/products/ip-defender', logo: 'https://picsum.photos/48' },
    { name: 'Flagright', category: 'API / Fintech', url: '/products/flagright', logo: 'https://picsum.photos/48' },
    { name: 'FlexiQuiz', category: 'Education', url: '/products/flexiquiz', logo: 'https://picsum.photos/48' },
    { name: 'Agiliron', category: 'eCommerce', url: '/products/agiliron', logo: 'https://picsum.photos/48' },
    { name: 'CobbleStone Software', category: 'Contract Management', url: '/products/cobblestone', logo: 'https://picsum.photos/48' },
    { name: 'PlexTrac', category: 'Security / Pentest', url: '/products/plextrac', logo: 'https://picsum.photos/48' },
    { name: 'Cacoo', category: 'Design / Collaboration', url: '/products/cacoo', logo: 'https://picsum.photos/48' },
    { name: 'GitHub', category: 'Developer Tools', url: '/products/github', logo: 'https://picsum.photos/48' },
    { name: 'Slack', category: 'Communication', url: '/products/slack', logo: 'https://picsum.photos/48' },
    { name: 'Trello', category: 'Project Management', url: '/products/trello', logo: 'https://picsum.photos/48' },
    { name: 'Notion', category: 'Productivity', url: '/products/notion', logo: 'https://picsum.photos/48' },
    { name: 'Figma', category: 'Design Tools', url: '/products/figma', logo: 'https://picsum.photos/48' },
  ]

  const performSearch = (query: string) => {
    searchQuery.value = query
    
    if (!query || query.length < 2) {
      searchResults.value = []
      return
    }

    isSearching.value = true

    // Simulate search delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase()
      searchResults.value = dummyProducts
        .filter(product => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 8) // Limit to 8 results
      
      isSearching.value = false
    }, 200)
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch
  }
}
