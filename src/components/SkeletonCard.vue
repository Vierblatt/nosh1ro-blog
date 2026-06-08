<script setup lang="ts">
defineProps<{ count?: number }>()
</script>

<template>
  <div class="skeleton-card" v-for="n in (count || 3)" :key="n">
    <div class="sk-date" />
    <div class="sk-body">
      <div class="sk-title" />
      <div class="sk-line" />
      <div class="sk-line short" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sk-date {
  width: 90px;
  height: 14px;
  background: var(--vp-c-bg-mute);
  border-radius: 4px;
  flex-shrink: 0;
  animation: shimmer 1.5s infinite;
}

.sk-body {
  flex: 1;
}

.sk-title {
  width: 50%;
  height: 18px;
  background: var(--vp-c-bg-mute);
  border-radius: 4px;
  margin-bottom: 10px;
  animation: shimmer 1.5s infinite;
  animation-delay: 0.1s;
}

.sk-line {
  width: 100%;
  height: 13px;
  background: var(--vp-c-bg-mute);
  border-radius: 4px;
  margin-bottom: 8px;
  animation: shimmer 1.5s infinite;
  animation-delay: 0.2s;
}

.sk-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>
