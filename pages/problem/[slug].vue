<script setup>
/* global definePageMeta */
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useAsyncData } from '#app'
import { useHead } from '#app'
import { showError } from '#app'
import { getEditorConfigForPlatform } from '~/data/platforms/editor'
import { useRuntimeConfig } from '#app'
import { useAuth } from '#imports'
import { useToast } from '~/composables/useToast'
import { useLoginPrompt } from '~/composables/useLoginPrompt'
import { useApi } from '~/composables/useApi'
import { getPlatformContent } from '~/data/platforms'
import Problem from '~/components/problem/Problem.vue'
import { Icon } from '@iconify/vue'

// Define component name to fix linter error
defineOptions({
  name: 'ProblemDetail'
})

// Use a layout without the AppHeader to avoid duplication
definePageMeta({
  layout: 'problem'
})

const route = useRoute()

// Validate route parameters
if (!route.params.slug || typeof route.params.slug !== 'string') {
  throw showError({
    statusCode: 404,
    statusMessage: 'Problem Not Found',
    error: 'Invalid problem slug.'
  })
}

// State for selected platform
const selectedPlatformId = ref(null)
const showPlatformDropdown = ref(false)

// Function to change selected platform
const selectPlatform = async (platformId) => {
  selectedPlatformId.value = platformId

  // Get the template from API for the selected platform
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
    const platform = availablePlatforms.find(p => p.platform_id === platformId)

    if (!platform) {
      console.error('Platform not found:', platformId)
      return
    }

    // Use platform name (lowercase) for the API call
    const response = await get(`/public/problem/${route.params.slug}/template?platform=${platform.platform_name}`, {
      baseURL: apiBaseUrl
    })

    if (response?.template?.code_template) {
      code.value = response.template.code_template
    }
  } catch (error) {
    console.error('Error fetching template:', error)

    throw showError({
      statusCode: 404,
      statusMessage: 'Problem Not Found',
      error: 'The problem you are looking for does not exist.'
    })
  }
}

// Helper function to get current platform name
const getCurrentPlatformName = () => {
  if (!selectedPlatformId.value || !availablePlatforms || !Array.isArray(availablePlatforms)) {
    return 'python'
  }

  const template = availablePlatforms.find(t => t && t.platform_id === selectedPlatformId.value)
  return template?.platform_name || 'python'
}

// Function to select platform and close dropdown
const selectPlatformAndClose = async (platformId) => {
  showPlatformDropdown.value = false
  await selectPlatform(platformId)
}

// Comment functions
const submitComment = async () => {
  if (!newComment.value.trim() || !user.value) return

  isSubmittingComment.value = true
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
    const response = await post(`/user/problem/${route.params.slug}/comments`, {
      content: newComment.value.trim()
    }, {
      baseURL: apiBaseUrl
    })

    // Add the new comment to the list (modify source data)
    if (!problemData.value.comments) {
      problemData.value.comments = []
    }
    problemData.value.comments.unshift({
      id: response.id,
      content: newComment.value.trim(),
      username: user.value.username || user.value.name || 'Anonymous',
      avatar_url: user.value.avatar_url,
      created_at: new Date().toISOString()
    })

    newComment.value = ''

    const toast = useToast()
    toast.success('Comment posted successfully!', 3000)
  } catch (error) {
    console.error('Error posting comment:', error)
    const toast = useToast()
    toast.error('Failed to post comment. Please try again.', 3000)
  } finally {
    isSubmittingComment.value = false
  }
}

// Load problems and categories for drawer
const loadProblemsAndCategories = async () => {
  if (isLoadingProblems.value) return

  isLoadingProblems.value = true
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

    // Load categories first
    console.log('🔍 Loading categories from:', `${apiBaseUrl}/public/category`)
    const categoriesResponse = await get('/public/category', { baseURL: apiBaseUrl })
    console.log('📦 Categories API response:', categoriesResponse)
    categories.value = categoriesResponse?.categories || []
    console.log('✅ Categories assigned to ref:', categories.value)
    console.log('📊 Categories count:', categories.value.length)

    // Load problems based on selected category (if any)
    await loadProblemsByCategory()
  } catch (error) {
    console.error('❌ Error loading problems and categories:', error)
  } finally {
    isLoadingProblems.value = false
  }
}

// Load problems by category using API endpoint
const loadProblemsByCategory = async () => {
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

    // Use selected category if available
    const categorySlug = selectedCategory.value

    if (categorySlug) {
      // Fetch problems by category using the same endpoint as category page
      const payload = {
        search: '',
        difficulty: '',
        sort: 'latest',
        limit: 100, // Load more problems for drawer
        offset: 0
      }

      const response = await post(`/public/problem/category/${categorySlug}`, payload, {
        baseURL: apiBaseUrl
      })

      allProblems.value = response?.problems || []
    } else {
      // Fetch all problems when no category selected
      const problemsResponse = await post('/public/problem', {}, { baseURL: apiBaseUrl })
      allProblems.value = problemsResponse?.problems || []
    }
  } catch (error) {
    console.error('Error loading problems by category:', error)
    allProblems.value = []
  }
}

// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}



const platformEditor = computed(() => getEditorConfigForPlatform(currentPlatform.value))

const code = ref('')
const testResults = ref(null)
const isSubmitLoading = ref(false)
const showShareDialog = ref(false)
const showProblemsListDrawer = ref(false)
const showRelatedDrawer = ref(false)
// Start with loader hidden for SSR, will show briefly on client if needed
const loaderVisible = ref(false)

// Problems list and categories for drawer
const allProblems = ref([])
const isLoadingProblems = ref(false)
const categories = ref([])
const selectedCategory = ref(null)

// Comments and related problems data - computed from SSR data for immediate availability
const comments = computed(() => Array.isArray(problemData.value?.comments) ? problemData.value.comments : [])
const relatedProblems = computed(() => Array.isArray(problemData.value?.relatedProblems) ? problemData.value.relatedProblems : [])
const newComment = ref('')
const isSubmittingComment = ref(false)

const { user, login, fetchUser } = useAuth()
const isSaving = ref(false)
const { showSaveLoginPrompt } = useLoginPrompt()
const { get, post, delete: del } = useApi()

// Track problem visit on client side
const trackProblemVisit = async () => {
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
    const problemSlug = route.params.slug

    // Hit the API to track visit (fire-and-forget, don't wait for response)
    post(`/public/problem/${problemSlug}/visit`, {}, {
      baseURL: apiBaseUrl
    }).catch(error => {
      // Silently handle errors to not affect user experience
      console.warn('Failed to track problem visit:', error)
    })
  } catch (error) {
    console.warn('Error tracking problem visit:', error)
  }
}

// Handler to open problems list drawer - fetches data first
const handleOpenProblemsListDrawer = async () => {
  console.log('🚪 Opening problems list drawer...')

  // Set default category to current problem's category if not already set
  if (!selectedCategory.value && currentProblem.value?.category_slug) {
    selectedCategory.value = currentProblem.value.category_slug
  }

  try {
    console.log('📊 Current categories state:', {
      exists: !!categories.value,
      length: categories.value?.length || 0,
      value: categories.value
    })

    if (!categories.value || categories.value.length === 0) {
      // Load categories and problems (function manages its own loading state)
      console.log('⏳ Loading categories and problems...')
      await loadProblemsAndCategories()
    } else {
      // Categories already loaded, reload problems based on selected category
      console.log('♻️ Reloading problems only (categories already loaded)')
      isLoadingProblems.value = true
      await loadProblemsByCategory()
      isLoadingProblems.value = false
    }
  } catch (error) {
    console.error('❌ Error loading problems for drawer:', error)
    isLoadingProblems.value = false
  }

  // Open the drawer after data is loaded
  console.log('✅ Opening drawer. Final categories:', categories.value)
  showProblemsListDrawer.value = true
}

// Watch for category changes to reload problems
watch(selectedCategory, async (newCategory) => {
  // Reload if drawer is open (regardless of whether category is set)
  if (showProblemsListDrawer.value) {
    isLoadingProblems.value = true
    try {
      await loadProblemsByCategory()
    } catch (error) {
      console.error('Error reloading problems after category change:', error)
    } finally {
      isLoadingProblems.value = false
    }
  }
})

// Problems are now fetched from API based on selected category
// No need for client-side filtering

// Auto-refresh user data when component mounts (useful after login redirect)
if (import.meta.client && !user.value) {
  fetchUser()
}

// Handle sign in redirect to preserve current path
const handleSignInRedirect = async () => {
  try {
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_redirect_path', currentPath)
    }
    await login(currentPath)
  } catch (error) {
    console.error('Sign in error:', error)
  }
}

// Toggle save problem functionality
async function toggleSaveProblem(slug) {
  if (!user.value) {
    console.log('User not authenticated')
    throw new Error('User not authenticated')
  }

  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const isCurrentlySaved = savedStatusData.value?.saved || false

  if (isCurrentlySaved) {
    // Remove saved problem
    await del(`${apiBaseUrl}/user/saved-problem/${slug}`)
  } else {
    // Save problem
    await post(`${apiBaseUrl}/user/saved-problem`, {
      slug: slug
    })
  }
}

const attempts = ref(0)
const startTime = ref(null)
const isResultSaved = ref(false)
const currentTime = ref(Date.now())
const isSolutionAccepted = ref(false)
let timerIntervalId = null

// Computed property for elapsed time
const elapsedTime = computed(() => {
  if (!startTime.value) return { hours: 0, minutes: 0, seconds: 0 }

  const elapsedMs = currentTime.value - startTime.value
  const hours = Math.floor(elapsedMs / 3600000)
  const minutes = Math.floor((elapsedMs % 3600000) / 60000)
  const seconds = Math.floor((elapsedMs % 60000) / 1000)

  return { hours, minutes, seconds }
})

// Theme always defaults to dark (no localStorage persistence)
const theme = ref('dark')

function setThemeClass(val) {
  if (typeof window !== 'undefined') {
    if (val === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// Apply theme class on client side only (no localStorage)
watch(theme, (val) => {
  setThemeClass(val)
}, { immediate: true })

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const monacoTheme = computed(() => (theme.value === 'dark' ? 'vs-dark' : 'vs-light'))

// Fetch problem, comments, and related problems from API on SSR
const { data: problemData, error: problemError } = await useAsyncData(`problem-${route.params.slug}`, async () => {
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

    // Fetch problem data
    const response = await get(`/public/problem/${route.params.slug}`, {
      baseURL: apiBaseUrl
    })

    if (!response) {
      throw new Error('Problem not found')
    }

    // Fetch comments and related problems concurrently
    const [commentsResponse, relatedResponse] = await Promise.allSettled([
      get(`/public/problem/${route.params.slug}/comments`, {
        baseURL: apiBaseUrl
      }),
      get(`/public/problem/${route.params.slug}/related`, {
        baseURL: apiBaseUrl
      })
    ])

    return {
      ...response,
      comments: commentsResponse.status === 'fulfilled' ? commentsResponse.value?.comments || [] : [],
      relatedProblems: relatedResponse.status === 'fulfilled' ? relatedResponse.value?.problems || [] : []
    }
  } catch (error) {
    console.error('Error fetching problem data:', error)
    throw error
  }
})

if (problemError.value) {
  throw showError({
    statusCode: 404,
    statusMessage: 'Problem Not Found',
    error: 'The problem you are looking for does not exist.'
  })
}

// Computed flags for language-specific problems (category is a programming language)
const languagePlatformId = computed(() => problemData.value?.language_platform_id || null)
const isLanguageProblem = computed(() => {
  const id = languagePlatformId.value
  // Check if it's a valid UUID (not "0" or null)
  return id && id !== '0' && id !== 0
})

// Static platform data - all problems support all platforms
const availablePlatforms = [
  { platform_id: '550e8400-e29b-41d4-a716-446655440003', platform_name: 'python', platform_version: 'v3.8.1', compiler_options: 'v3.8.1', code_template: '# Write your solution here\ndef solution():\n    pass' },
  { platform_id: 'd4e3f2a1-b5c6-4d7e-8f90-1a2b3c4d5e6f', platform_name: 'javascript', platform_version: 'Node.js 12.14.0', compiler_options: 'Node.js 12.14.0', code_template: '// Write your solution here\nfunction solution() {\n    \n}' },
  { platform_id: '9ab8c7d6-e5f4-4a3b-8c9d-0f1e2d3c4b5a', platform_name: 'typescript', platform_version: 'v3.7.4', compiler_options: 'v3.7.4', code_template: '// Write your solution here\nfunction solution(): any {\n    \n}' },
  { platform_id: 'a2f0b1c0-9d3e-4b8a-83f6-6c9f6e2a1d3b', platform_name: 'java', platform_version: 'OpenJDK 13.0.1', compiler_options: 'v17', code_template: 'public class Solution {\n    public void solution() {\n        // Write your solution here\n    }\n}' },
  { platform_id: '5c7d2e1f-3a4b-4c5d-9e8f-b1c2d3e4f5a6', platform_name: 'php', platform_version: 'v7.4.1', compiler_options: 'v7.4.1', code_template: '<?php\n// Write your solution here\nfunction solution() {\n    \n}' },
  { platform_id: '550e8400-e29b-41d4-a716-446655440002', platform_name: 'rust', platform_version: 'v1.40.0', compiler_options: 'v1.70.0', code_template: '// Write your solution here\nfn solution() {\n    \n}' }
]

// Initialize first platform with API template
const initializeFirstPlatform = async () => {
  if (!selectedPlatformId.value && availablePlatforms.length > 0) {
    // If this problem is language-specific, lock to that platform ID
    let firstPlatform = availablePlatforms[0]
    if (languagePlatformId.value) {
      const langPlatform = availablePlatforms.find(p => p.platform_id === languagePlatformId.value)
      if (langPlatform) {
        firstPlatform = langPlatform
      }
    }

    selectedPlatformId.value = firstPlatform.platform_id

    // Set default template first as fallback
    code.value = firstPlatform.code_template

    // Then try to fetch template from API
    try {
      const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
      const response = await get(`/public/problem/${route.params.slug}/template?platform=${firstPlatform.platform_name}`, {
        baseURL: apiBaseUrl
      })

      if (response?.template?.code_template) {
        code.value = response.template.code_template
      }
    } catch (error) {
      console.error('Error fetching initial template:', error)
      // Keep the fallback template that was already set
    }
  }
}

// Determine platform: use selected platform or default to python
const currentPlatform = computed(() => {
  if (selectedPlatformId.value) {
    const platforms = availablePlatforms
    const template = platforms.find(t => t.platform_id === selectedPlatformId.value)
    if (template) {
      return template.platform_name.toLowerCase()
    }
  }
  return 'python'
})

// Watch for problem data changes (backup initialization if onMounted failed)
watch(problemData, async (newData) => {
  if (newData && !selectedPlatformId.value) {
    // This should rarely run since we initialize in onMounted, but serves as backup
    await initializeFirstPlatform()
  }
}, { immediate: true })

// Computed properties to extract data from the flattened API response
const currentProblem = computed(() => {
  if (!problemData.value) return null

  return {
    id: problemData.value.id,
    slug: problemData.value.slug,
    title: problemData.value.title || '',
    content: problemData.value.content || problemData.value.description || '',
    difficulty: problemData.value.difficulty || 'Medium',
    category_id: problemData.value.category_id,
    category_name: problemData.value.category_name || '',
    category_slug: problemData.value.category_slug || '',
    visited: problemData.value.visited || 0,
    created_at: problemData.value.created_at
  }
})

// Check if problem is saved (only when user is logged in)
const { data: savedStatusData, refresh } = await useAsyncData(`saved-status-${route.params.slug}`, async () => {
  // Don't make API call if user is not logged in
  if (!user.value) {
    return { saved: false }
  }

  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
    const response = await get(`${apiBaseUrl}/user/saved-problem/check/${route.params.slug}`)
    return response || { saved: false }
  } catch (error) {
    console.error('Error checking saved status:', error)
    return { saved: false }
  }
}, {
  server: false // Only run on client side since it requires authentication
})

function onCodeChange(value) {
  code.value = value
}

async function handleSave() {
  if (!user.value) {
    showSaveLoginPrompt()
    return
  }

  isSaving.value = true
  try {
    // Check if problem was saved before the toggle
    const wasSaved = savedStatusData.value?.saved || false

    await toggleSaveProblem(route.params.slug)

    // Refresh the saved status data
    await refresh()

    // Show success toast only when problem is saved
    if (!wasSaved) {
      const toast = useToast()
      toast.success('Problem saved successfully!', 3000)
    }
  } catch (error) {
    console.error('Error saving problem:', error)

    // Show error toast
    const toast = useToast()
    toast.error('Failed to save problem. Please try again.', 3000)
  } finally {
    isSaving.value = false
  }
}

// Calculate score based on various factors
function calculateScore(executionTime, difficulty, attempts) {
  let baseScore = 100

  // Deduct points based on execution time
  const timeDeduction = Math.min(20, Math.floor(executionTime / 10)) // Max 20 points deduction
  baseScore -= timeDeduction

  // Deduct points based on attempts
  const attemptDeduction = Math.min(25, (attempts - 1) * 5) // 5 points per attempt, max 25
  baseScore -= attemptDeduction

  // Difficulty multiplier
  const difficultyMultiplier = {
    'Easy': 1.0,
    'Medium': 1.1,
    'Hard': 1.2
  }

  baseScore *= difficultyMultiplier[difficulty] || 1.0

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(baseScore)))
}

async function submitCode() {
  isSubmitLoading.value = true
  attempts.value++

  try {
    const userCode = code.value
    const problemSlug = route.params.slug

    // Get the selected platform info - we need platform_id for the new API
    if (!selectedPlatformId.value) {
      console.log('No platform selected')
      throw new Error('No platform selected')
    }

    // Find the current platform template to get the language configuration
    const platforms = availablePlatforms
    const currentTemplate = platforms.find(t => t.platform_id === selectedPlatformId.value)
    if (!currentTemplate) {
      console.log('Platform template not found')
      throw new Error('Platform template not found')
    }

    // Prepare the payload for the new platform-agnostic API
    const payload = {
      platform_id: selectedPlatformId.value,
      answer_fn: userCode
    }

    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

    // Determine API endpoint based on login status
    const isLoggedIn = user.value && user.value.id
    const endpoint = isLoggedIn ? `/user/problem/submit/${problemSlug}` : `/public/problem/submit/${problemSlug}`

    // If logged in, include additional required fields for user endpoint
    if (isLoggedIn) {
      const timeSpentMs = Date.now() - startTime.value
      const timeSpentSeconds = Math.round(timeSpentMs / 1000)

      // Map platform UUID to Judge0 language_id (integer)
      const platformToLanguageMap = {
        '550e8400-e29b-41d4-a716-446655440003': 71, // Python
        'd4e3f2a1-b5c6-4d7e-8f90-1a2b3c4d5e6f': 63, // JavaScript
        '9ab8c7d6-e5f4-4a3b-8c9d-0f1e2d3c4b5a': 74, // TypeScript
        'a2f0b1c0-9d3e-4b8a-83f6-6c9f6e2a1d3b': 62, // Java
        '5c7d2e1f-3a4b-4c5d-9e8f-b1c2d3e4f5a6': 68, // PHP
        '550e8400-e29b-41d4-a716-446655440002': 73  // Rust
      }

      const languageId = platformToLanguageMap[selectedPlatformId.value]
      if (!languageId) {
        throw new Error('Unsupported platform for submission')
      }

      // User endpoint requires language_id as integer
      payload.language_id = languageId
      payload.attempt = attempts.value
      payload.time_spent = timeSpentSeconds
    }

    const response = await post(endpoint, payload, {
      baseURL: apiBaseUrl
    })

    // Handle the new API response format
    const statusId = response.status?.id
    const statusDescription = response.status?.description || 'Unknown status'

    // Judge0 status codes:
    // 1: In Queue, 2: Processing, 3: Accepted, 4: Wrong Answer, 5: Time Limit Exceeded
    // 6: Compilation Error, 7: Runtime Error (SIGSEGV), 8: Runtime Error (SIGXFSZ)
    // 9: Runtime Error (SIGFPE), 10: Runtime Error (SIGABRT), 11: Runtime Error (NZEC)
    // 12: Runtime Error (Other), 13: Internal Error, 14: Exec Format Error
    const isAccepted = statusId === 3 // Accepted
    const isWrongAnswer = statusId === 4 // Wrong Answer
    const isCompileError = statusId === 6 // Compilation Error
    const isRuntimeError = [5, 7, 8, 9, 10, 11, 12].includes(statusId) // Various runtime errors

    if (isAccepted) {
      testResults.value = {
        status: 'success',
        statusDescription: statusDescription,
        output: response.stdout || 'Your solution passed all test cases!',
        stderr: response.stderr || null,
        compile_output: response.compile_output || null,
        executionTime: parseFloat(response.time) || 0,
        from: 'submit'
      }

      // Mark as accepted to disable submit button
      isSolutionAccepted.value = true

      // Stop timer on success
      if (timerIntervalId) {
        clearInterval(timerIntervalId)
        timerIntervalId = null
      }
    } else {
      // Handle different types of errors
      let output = ''
      let stderr = response.stderr || null

      if (isWrongAnswer) {
        output = response.stdout || 'Wrong Answer: Your solution produces incorrect output for some test cases.'
      } else if (isCompileError) {
        output = response.compile_output || 'Compilation failed. Please check your syntax.'
      } else if (isRuntimeError) {
        output = response.stderr || 'Runtime error occurred during execution.'
      } else {
        output = response.stdout || response.message || 'Submission failed. Please try again.'
      }

      testResults.value = {
        status: 'error',
        statusDescription: statusDescription,
        output: output,
        stderr: stderr,
        compile_output: response.compile_output || null,
        executionTime: parseFloat(response.time) || 0,
        from: 'submit'
      }
    }
  } catch (error) {
    console.error('Error submitting code:', error)
    testResults.value = {
      status: 'error',
      statusDescription: 'Submission failed',
      output: error.data?.message || error.message || 'Failed to submit solution. Please try again.',
      stderr: null,
      compile_output: null,
      executionTime: null,
      from: 'submit'
    }
  } finally {
    isSubmitLoading.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (showPlatformDropdown.value && !event.target.closest('.platform-dropdown')) {
    showPlatformDropdown.value = false
  }
}

// Timer functionality
onMounted(async () => {
  // Ensure dark theme is applied on client mount
  setThemeClass('dark')

  // Track problem visit (fire-and-forget)
  trackProblemVisit()

  // Initialize first platform and fetch its template
  await initializeFirstPlatform()

  // Initialize start time
  startTime.value = Date.now()

  // Start timer interval
  timerIntervalId = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)

  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside)

  // Initialize AdSense for header ad
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.warn('AdSense header ad error:', err)
    }
  }

  // Cleanup interval on component unmount
  onUnmounted(() => {
    if (timerIntervalId) {
      clearInterval(timerIntervalId)
      timerIntervalId = null
    }
    document.removeEventListener('click', handleClickOutside)
  })
})

watch(() => route.params.slug, async () => {
  await nextTick()
})

// SEO AND META TAGS
const siteUrl = useRuntimeConfig().public.siteUrl || ''
const thumbnailUrl = `${siteUrl}/generated-problem-thumbnails/${route.params.slug}.png`

useHead(() => {
  if (!currentProblem.value || !currentProblem.value.title) {
    return {
      title: 'Problem - BudiBadu Coding Challenge',
      meta: [
        { name: 'description', content: 'Loading problem...' }
      ]
    }
  }

  const problemTitle = currentProblem.value.title || 'Unknown Problem'
  const problemDifficulty = currentProblem.value.difficulty || 'Medium'
  const problemCategory = currentProblem.value.category_name || ''
  const problemContent = currentProblem.value.content || ''

  // Add platform name to title if it's a language-specific problem
  let title = `${problemTitle} Problem`
  if (isLanguageProblem.value && problemCategory) {
    title = `${problemTitle} ${problemCategory} Answer`
  }
  const description = problemContent
    ? problemContent.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : `Practice ${problemTitle} problem. ${problemDifficulty} difficulty level.`

  const keywords = [
    'coding',
    'programming',
    'algorithm',
    'practice',
    'multi-language',
    problemTitle.toLowerCase(),
    problemDifficulty.toLowerCase(),
    problemCategory.toLowerCase()
  ].filter(Boolean).join(', ')

  const ogImageAlt = `${problemTitle} - Problem thumbnail`
  const ogUrl = `${siteUrl}/problem/${route.params.slug}`

  return {
    title,
    script: [
      {
        children: `
          // Apply dark mode immediately before hydration to prevent flash
          if (typeof document !== 'undefined') {
            document.documentElement.classList.add('dark');
          }
        `,
        type: 'text/javascript',
        tagPosition: 'head'
      }
    ],
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: 'BudiBadu' },
      { name: 'robots', content: 'index, follow' },

      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: 'BudiBadu' },
      { property: 'og:url', content: ogUrl },
      { property: 'og:image', content: thumbnailUrl },
      { property: 'og:image:width', content: '1280' },
      { property: 'og:image:height', content: '720' },
      { property: 'og:image:alt', content: ogImageAlt },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: thumbnailUrl },
      { name: 'twitter:image:alt', content: ogImageAlt },

      // Additional meta tags
      { name: 'article:section', content: 'Programming' },
      { name: 'article:tag', content: keywords },
      { name: 'article:published_time', content: new Date().toISOString() },
      { name: 'article:modified_time', content: new Date().toISOString() }
    ],
    link: [
      {
        rel: 'canonical',
        href: `https://budibadu.com${route.path}`
      }
    ]
  }
})
</script>

<template>
  <div>
    <!-- Unified Problem Component (Responsive) -->
    <Problem v-if="currentProblem" :currentProblem="currentProblem" :theme="theme" :code="code"
      :testResults="testResults" :isSubmitLoading="isSubmitLoading" :showShareDialog="showShareDialog"
      :showProblemsListDrawer="showProblemsListDrawer" :showRelatedDrawer="showRelatedDrawer" :allProblems="allProblems"
      :isLoadingProblems="isLoadingProblems" :categories="categories" :selectedCategory="selectedCategory"
      :isSaving="isSaving" :savedStatusData="savedStatusData" :selectedPlatformId="selectedPlatformId"
      :showPlatformDropdown="showPlatformDropdown" :availablePlatforms="availablePlatforms" :elapsedTime="elapsedTime"
      :isSolutionAccepted="isSolutionAccepted" :platformEditor="platformEditor" :monacoTheme="monacoTheme"
      :comments="comments" :relatedProblems="relatedProblems" :newComment="newComment"
      :isSubmittingComment="isSubmittingComment" :user="user" :attempts="attempts" :isResultSaved="isResultSaved"
      :getPlatformContent="getPlatformContent" :getEditorConfigForPlatform="getEditorConfigForPlatform"
      :getCurrentPlatformName="getCurrentPlatformName" :formatDate="formatDate" :calculateScore="calculateScore"
      :isLanguageProblem="isLanguageProblem"
      @update:showShareDialog="showShareDialog = $event"
      @update:showProblemsListDrawer="showProblemsListDrawer = $event"
      @update:showRelatedDrawer="showRelatedDrawer = $event" @update:selectedCategory="selectedCategory = $event"
      @update:showPlatformDropdown="showPlatformDropdown = $event" @update:newComment="newComment = $event"
      @handleSave="handleSave" @toggleTheme="toggleTheme" @submitCode="submitCode"
      @selectPlatformAndClose="selectPlatformAndClose" @onCodeChange="onCodeChange" @submitComment="submitComment"
      @openProblemsListDrawer="handleOpenProblemsListDrawer" @handleSignInRedirect="handleSignInRedirect" />

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <Icon :ssr="true" icon="ph:spinner" class="w-8 h-8 text-yellow-500 animate-spin" />
    </div>

    <!-- Loading Transition (client-only) -->
    <ClientOnly>
      <transition name="fade">
        <div v-if="loaderVisible"
          class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#18181b] transition-colors duration-300">
          <Icon :ssr="true" icon="ph:spinner" class="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      </transition>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* Fade transition for loader */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
