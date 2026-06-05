<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchHealth } from '../api/public'

const status = ref<'ok' | 'degraded' | 'loading'>('loading')

onMounted(async () => {
  try {
    const h = await fetchHealth()
    status.value = h.db === 'connected' ? 'ok' : 'degraded'
  } catch {
    status.value = 'degraded'
  }
})
</script>

<template>
  <footer class="footer">
    <span class="status-dot" :class="status" />
    <span v-if="status === 'ok'" class="status-text">API 正常</span>
    <span v-else-if="status === 'degraded'" class="status-text">API 异常</span>
    <span v-else class="status-text">检测中...</span>
    <span class="sep">·</span>
    <a href="/api/feed.xml" target="_blank" rel="noopener">RSS</a>
    <span class="sep">·</span>
    <span>Vue 3 + Go · Cloudflare · Ubuntu</span>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding-top: 32px;
  color: #484f58;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.footer a {
  color: #58a6ff;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.sep {
  color: #30363d;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.ok { background: #3fb950; }
.status-dot.degraded { background: #f85149; }
.status-dot.loading { background: #d29922; }

.status-text {
  color: #8b949e;
}
</style>
