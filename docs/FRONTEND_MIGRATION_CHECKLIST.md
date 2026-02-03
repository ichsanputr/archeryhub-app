# Frontend Dashboard Migration Checklist

## ✅ Completed Updates

### 1. Components Updated
- **AssignmentManager.vue**: Updated to use new API structure with target_uuid
- **ScoringInput.vue**: Converted to use arrows array format for saving/loading scores

### 2. Helper Functions Created
- **utils/qualificationHelpers.js**: Complete set of helper functions for new API

---

## ⚠️ Required Updates

### 1. Event Overview Dashboard (`pages/dashboard/events/[id]/overview.vue`)

**Issue**: Currently expects `target_number` field on participants
```javascript
// ❌ Current code (lines 522-526, 549, 662, 668)
const groupedTargets = computed(() => {
    const targets = {}
    participants.value.forEach(p => {
        if (!p.target_number) return  // ❌ Field doesn't exist anymore
        if (!targets[p.target_number]) {
            targets[p.target_number] = []
        }
        targets[p.target_number].push(p)
    })
    return targets
})
```

**Fix Required**:
```javascript
// ✅ New approach
import { fetchSessionAssignments, enhanceParticipantsWithTargets } from '~/utils/qualificationHelpers'

const assignments = ref([])
const enhancedParticipants = computed(() => {
    return enhanceParticipantsWithTargets(participants.value, assignments.value)
})

const groupedTargets = computed(() => {
    const targets = {}
    assignments.value.forEach(assignment => {
        const targetKey = assignment.target_name || `Target ${assignment.target_number}`
        if (!targets[targetKey]) {
            targets[targetKey] = []
        }
        targets[targetKey].push(assignment)
    })
    return targets
})

// Add to fetchEventDetails
const fetchEventDetails = async () => {
    isLoading.value = true
    try {
        const [eventRes, categoriesRes, participantsRes] = await Promise.all([
            get(`/events/${route.params.id}`),
            get(`/events/${route.params.id}/categories`),
            get(`/events/${route.params.id}/participants`)
        ])
        
        // Fetch assignments for all sessions
        if (categoriesRes?.categories) {
            const allAssignments = []
            for (const category of categoriesRes.categories) {
                const sessions = await fetchQualificationSessions(category.uuid)
                for (const session of sessions) {
                    const sessionAssignments = await fetchSessionAssignments(session.uuid)
                    allAssignments.push(...sessionAssignments)
                }
            }
            assignments.value = allAssignments
        }
        
        event.value = eventRes
        eventCategories.value = categoriesRes?.categories || []
        participants.value = participantsRes?.participants || []
        
        if (event.value) {
            setEvent(event.value)
        }
    } catch (error) {
        console.error('Failed to fetch event management data:', error)
    } finally {
        isLoading.value = false
    }
}
```

**Update Alerts**:
```javascript
const alerts = computed(() => {
    const alertList = []
    // Count participants without assignments
    const participantsWithoutTarget = participants.value.filter(p => {
        return !assignments.value.some(a => 
            a.archer_uuid === p.archer_id || a.archer_uuid === p.uuid
        )
    }).length
    
    if (participantsWithoutTarget > 0) {
        alertList.push({
            id: 1,
            type: 'info',
            icon: 'ph:user-plus',
            title: 'Peserta Belum Diatur',
            message: `${participantsWithoutTarget} peserta belum memiliki nomor bantalan.`
        })
    }
    return alertList
})
```

---

### 2. Participant Detail Page (`pages/dashboard/events/[id]/participants/[participantId]/index.vue`)

**Issue**: Line 324 references `participant.value?.target_number`

**Fix Required**:
```javascript
// Add at top
import { fetchSessionAssignments } from '~/utils/qualificationHelpers'

const participantAssignment = ref(null)

const targetNumberText = computed(() => {
    if (!participantAssignment.value) return 'Belum Ditentukan'
    return `${participantAssignment.value.target_name || 'Target ' + participantAssignment.value.target_number}${participantAssignment.value.target_position}`
})

// Update fetchParticipant to also fetch assignment
const fetchParticipant = async () => {
    isLoading.value = true
    try {
        const found = await get(`/events/${eventId}/participants/${participantId}`)
        if (found) {
            participant.value = found
            // Populate form
            form.category_id = found.category_id
            form.status = found.status || 'Menunggu Acc'
            form.payment_status = found.payment_status || 'belum_lunas'
            form.payment_amount = found.payment_amount || 0
            form.payment_proof_urls = found.payment_proof_urls ? found.payment_proof_urls.split(',') : []
            
            // Fetch target assignment
            if (found.category_id) {
                const sessions = await fetchQualificationSessions(found.category_id)
                for (const session of sessions) {
                    const assignments = await fetchSessionAssignments(session.uuid)
                    const foundAssignment = assignments.find(a => 
                        a.archer_uuid === found.archer_id || a.archer_uuid === found.uuid
                    )
                    if (foundAssignment) {
                        participantAssignment.value = foundAssignment
                        break
                    }
                }
            }
        }
        // ... rest of the function
    }
}
```

---

### 3. Add Participant Page (`pages/dashboard/events/[id]/participants/add.vue`)

**Issue**: Line 312 has `target_number: ''` in form

**Fix Required**:
Remove the field or convert it to assignment-based logic. Targets should be assigned via the Assignment Manager, not during participant creation.

```javascript
// ❌ Remove this from form
const form = reactive({
    category_id: '',
    status: 'Menunggu Acc',
    payment_status: 'belum_lunas',
    payment_amount: 0,
    target_number: '',  // ❌ Remove this
    payment_proof_urls: []
})

// ✅ After participant is created, use Assignment Manager to assign targets
```

---

### 4. Results/Leaderboard Pages

**Pages**:
- `pages/dashboard/events/[id]/results.vue`
- `pages/dashboard/events/leaderboard.vue`

**Current State**: Using dummy/hardcoded data

**Fix Required**: Integrate with new leaderboard API

```javascript
import { fetchQualificationLeaderboard, fetchQualificationSessions } from '~/utils/qualificationHelpers'

const leaderboard = ref([])
const selectedSession = ref(null)
const sessions = ref([])

const loadLeaderboard = async () => {
    if (!selectedSession.value) return
    
    try {
        const data = await fetchQualificationLeaderboard(selectedSession.value.uuid)
        leaderboard.value = data
    } catch (error) {
        console.error('Failed to load leaderboard:', error)
    }
}

const loadSessions = async (categoryId) => {
    try {
        sessions.value = await fetchQualificationSessions(categoryId)
        if (sessions.value.length > 0) {
            selectedSession.value = sessions.value[0]
            await loadLeaderboard()
        }
    } catch (error) {
        console.error('Failed to load sessions:', error)
    }
}

onMounted(() => {
    // Load sessions for first category
    if (categories.value.length > 0) {
        loadSessions(categories.value[0].uuid)
    }
})
```

---

### 5. Qualification Dashboard (`pages/dashboard/events/[id]/qualification.vue`)

**Current State**: Static mockup UI

**Fix Required**: Make it functional with real data

```vue
<template>
  <div class="bg-background-light min-h-screen">
    <!-- Session Selector -->
    <div class="p-6">
      <select v-model="selectedSession" @change="loadSessionData" class="...">
        <option v-for="session in sessions" :key="session.uuid" :value="session.uuid">
          {{ session.name }}
        </option>
      </select>
    </div>

    <!-- Assignment Manager Component -->
    <AssignmentManager 
      v-if="selectedSession"
      :session-id="selectedSession" 
      :category-id="categoryId"
      @updated="loadSessionData"
    />

    <!-- Scoring Input Component -->
    <ScoringInput 
      v-if="selectedSession"
      :session-id="selectedSession"
    />

    <!-- Live Leaderboard -->
    <div class="leaderboard">
      <div v-for="entry in leaderboard" :key="entry.uuid">
        {{ entry.rank }}. {{ entry.archer_name }} - {{ entry.total_score }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchQualificationSessions, fetchQualificationLeaderboard } from '~/utils/qualificationHelpers'
import AssignmentManager from '~/components/qualification/AssignmentManager.vue'
import ScoringInput from '~/components/qualification/ScoringInput.vue'

const route = useRoute()
const categoryId = ref(route.params.categoryId) // Need to get from route or selection

const sessions = ref([])
const selectedSession = ref(null)
const leaderboard = ref([])

const loadSessions = async () => {
    sessions.value = await fetchQualificationSessions(categoryId.value)
    if (sessions.value.length > 0) {
        selectedSession.value = sessions.value[0].uuid
        await loadSessionData()
    }
}

const loadSessionData = async () => {
    leaderboard.value = await fetchQualificationLeaderboard(selectedSession.value)
}

onMounted(() => {
    loadSessions()
})
</script>
```

---

## 📝 Additional Considerations

### 1. Session Management UI
Create a new page or modal for managing qualification sessions:
- Create new session
- Edit session details (name, time, total_ends, arrows_per_end)
- Activate/complete session
- View session participants

### 2. Target Management Integration
The targets page (`pages/dashboard/events/[id]/targets.vue`) is already correct and uses the new API. Ensure it's linked properly in navigation.

### 3. Real-time Updates
Consider adding WebSocket or polling for live scoring updates:
```javascript
// Example polling
const pollInterval = ref(null)

const startLiveUpdates = () => {
    pollInterval.value = setInterval(async () => {
        if (selectedSession.value) {
            leaderboard.value = await fetchQualificationLeaderboard(selectedSession.value)
        }
    }, 5000) // Update every 5 seconds
}

const stopLiveUpdates = () => {
    if (pollInterval.value) {
        clearInterval(pollInterval.value)
        pollInterval.value = null
    }
}

onMounted(() => startLiveUpdates())
onUnmounted(() => stopLiveUpdates())
```

### 4. Error Handling
Add proper error handling for all API calls with user-friendly messages:
```javascript
try {
    await updateEndScore(assignmentId, scoreData)
    toast.success('Skor berhasil disimpan')
} catch (error) {
    if (error.response?.status === 404) {
        toast.error('Assignment tidak ditemukan')
    } else if (error.response?.status === 400) {
        toast.error('Data skor tidak valid')
    } else {
        toast.error('Gagal menyimpan skor')
    }
    console.error('Score update failed:', error)
}
```

### 5. Loading States
Add loading indicators for all data fetching operations:
```javascript
const isLoadingAssignments = ref(false)
const isLoadingScores = ref(false)
const isLoadingLeaderboard = ref(false)

// Use in templates
<div v-if="isLoadingLeaderboard" class="loading-spinner">
  Memuat data...
</div>
```

---

## 🎯 Priority Order

1. **HIGH PRIORITY**
   - [ ] Fix `overview.vue` to use new assignment structure
   - [ ] Update `participants/[participantId]/index.vue` target display
   - [ ] Make `qualification.vue` functional with real components

2. **MEDIUM PRIORITY**
   - [ ] Update results/leaderboard pages with real API data
   - [ ] Remove `target_number` from add participant form
   - [ ] Add session management UI

3. **LOW PRIORITY**
   - [ ] Add real-time updates
   - [ ] Enhance error handling
   - [ ] Add comprehensive loading states

---

## 🧪 Testing Plan

After implementing changes:

1. **Create New Event**
   - Add event targets
   - Create qualification sessions
   - Assign participants to targets
   - Verify overview shows correct assignments

2. **Score Input**
   - Input scores using ScoringInput component
   - Verify scores save correctly with arrow details
   - Check leaderboard updates in real-time

3. **View Assignments**
   - Verify groupedTargets computed property works
   - Check participant detail page shows target info
   - Ensure overview alerts work correctly

4. **Delete Operations**
   - Delete assignment → verify scores cascade delete
   - Delete participant → verify all related data removed
   - Delete target → verify validation prevents if assigned

---

## 📚 Reference

- Migration Guide: `/app/docs/QUALIFICATION_SCHEMA_MIGRATION.md`
- Helper Functions: `/app/utils/qualificationHelpers.js`
- API Documentation: Backend `api/handler/qualification.go` and `api/handler/target.go`
