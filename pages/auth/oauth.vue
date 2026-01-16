<template>
  <div class="oauth-container">
    <div class="oauth-card">
      <h1>Login Successful</h1>
      <p>Your authentication was successful. You can now return to the home page.</p>
      <v-btn 
        color="primary" 
        @click="goHome"
        class="mt-4"
      >
        Back to Home
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { setToken } = useAuth()

onMounted(() => {
  const token = new URLSearchParams(window.location.search).get('token')
  if (token) {
    setToken(token)
    // Remove token from URL to prevent leakage
    window.history.replaceState({}, document.title, window.location.pathname)
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.oauth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.oauth-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h1 {
  color: #4caf50;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}
</style>
