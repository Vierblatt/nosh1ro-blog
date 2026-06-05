import { ref } from 'vue'
import { isLoggedIn, logout as apiLogout, getSettings } from '../api/admin'
import type { BlogSettings } from '../types/post'

export function useAuth() {
  const loggedIn = ref(isLoggedIn())

  function checkAuth() {
    loggedIn.value = isLoggedIn()
  }

  function logout() {
    apiLogout()
    loggedIn.value = false
  }

  return { loggedIn, checkAuth, logout }
}

export function useSettings() {
  const settings = ref<BlogSettings>({ title: 'nosh1ro', subtitle: '' })
  const loading = ref(false)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      settings.value = await getSettings()
    } catch {
      error.value = '加载设置失败'
    } finally {
      loading.value = false
    }
  }

  return { settings, loading, error, load }
}
