<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Teleport to="body">
    <button v-if="visible" class="back-to-top" @click="scrollTop" title="回到顶部">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a.75.75 0 0 1-.75-.75V4.66L5.53 8.28a.75.75 0 0 1-1.06-1.06l5.25-5.25a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1-1.06 1.06l-3.72-3.62v12.59A.75.75 0 0 1 10 18z" clip-rule="evenodd"/>
      </svg>
    </button>
  </Teleport>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 100;
  box-shadow: var(--vp-shadow-2);
}

.back-to-top:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}
</style>
