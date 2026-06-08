<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function onScroll() {
  const h = document.documentElement.scrollHeight - window.innerHeight
  progress.value = h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: progress + '%' }" />
  </div>
</template>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: transparent;
  z-index: 200;
}

.progress-fill {
  height: 100%;
  background: var(--vp-c-brand);
  transition: width 0.15s linear;
}
</style>
