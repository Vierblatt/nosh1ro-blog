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
    <div class="footer-left">
      <span class="status-dot" :class="status" :title="status === 'ok' ? 'API 正常' : status === 'degraded' ? 'API 异常' : '检测中...'" />
      <span>nosh1ro's blog</span>
    </div>
    <div class="footer-right">
      <a href="/api/feed.xml" target="_blank" rel="noopener">RSS</a>
      <span class="sep">|</span>
      <span>Vue 3 + Go</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0 16px;
  margin-top: auto;
  color: var(--vp-c-text-3);
  font-size: 13px;
  border-top: 1px solid var(--vp-c-divider);
}

.footer a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.15s;
}

.footer a:hover {
  color: var(--vp-c-brand);
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sep {
  color: var(--vp-c-divider);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.ok { background: var(--vp-c-green); }
.status-dot.degraded { background: var(--vp-c-red); }
.status-dot.loading { background: var(--vp-c-yellow); }
</style>
