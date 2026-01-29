\u003ctemplate\u003e
\u003cdiv class=\"space-y-6\"\u003e
\u003c!-- Results Section --\u003e
\u003cdiv v-if=\"results \u0026\u0026 results.length \u003e 0\" class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
gap-6\"\u003e
\u003cdiv v-for=\"(file, index) in results\" :key=\"index\"
class=\"bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/30 transition-all
group\"\u003e
\u003cdiv class=\"flex items-start gap-4\"\u003e
\u003cdiv class=\"w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0
group-hover:scale-110 transition-transform\"\u003e
\u003cIcon :icon=\"getFileIcon(file.url)\" class=\"text-2xl text-primary\" /\u003e
\u003c/div\u003e
\u003cdiv class=\"flex-1 min-w-0\"\u003e
\u003ch3 class=\"font-bold text-navy text-sm mb-1 truncate\" :title=\"file.name || getFileName(file.url)\"\u003e
{{ file.name || getFileName(file.url) }}
\u003c/h3\u003e
\u003cp v-if=\"file.size\" class=\"text-xs text-gray-500 mb-3\"\u003e{{ formatFileSize(file.size) }}\u003c/p\u003e
\u003ca :href=\"file.url\" target=\"_blank\" rel=\"noopener noreferrer\"
class=\"inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors\"\u003e
\u003cIcon icon=\"ph:download-simple\" class=\"text-lg\" /\u003e
Lihat / Unduh
\u003c/a\u003e
\u003c/div\u003e
\u003c/div\u003e
\u003c/div\u003e
\u003c/div\u003e

\u003c!-- Empty State --\u003e
\u003cdiv v-else class=\"bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center\"\u003e
\u003cdiv class=\"w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6\"\u003e
\u003cIcon icon=\"ph:trophy\" class=\"text-5xl text-gray-400\" /\u003e
\u003c/div\u003e
\u003ch3 class=\"text-xl font-bold text-navy mb-2\"\u003eHasil Belum Tersedia\u003c/h3\u003e
\u003cp class=\"text-gray-500 max-w-md mx-auto\"\u003e
Hasil lomba akan dipublikasikan setelah event selesai. Silakan cek kembali nanti.
\u003c/p\u003e
\u003c/div\u003e
\u003c/div\u003e
\u003c/template\u003e

\u003cscript setup\u003e
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
eventId: {
type: String,
required: true
}
})

const config = useRuntimeConfig()
const results = ref([])
const isLoading = ref(false)

const fetchResults = async () =\u003e {
isLoading.value = true
try {
const response = await $fetch(`${config.public.apiBaseUrl}/events/${props.eventId}`)
if (response?.data || response) {
const eventData = response?.data || response
const pageSettings = eventData.page_settings ? JSON.parse(eventData.page_settings) : {}
results.value = pageSettings.results || []
}
} catch (error) {
console.error('Failed to fetch results:', error)
results.value = []
} finally {
isLoading.value = false
}
}

const getFileIcon = (url) =\u003e {
if (!url) return 'ph:file'
const ext = url.split('.').pop()?.toLowerCase()
if (ext === 'pdf') return 'ph:file-pdf'
if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'ph:file-image'
return 'ph:file'
}

const getFileName = (url) =\u003e {
if (!url) return 'Unknown'
return url.split('/').pop() || 'Unknown'
}

const formatFileSize = (bytes) =\u003e {
if (!bytes) return ''
const k = 1024
const sizes = ['B', 'KB', 'MB', 'GB']
const i = Math.floor(Math.log(bytes) / Math.log(k))
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onMounted(() =\u003e {
fetchResults()
})
\u003c/script\u003e
