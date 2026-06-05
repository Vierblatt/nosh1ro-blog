<script setup lang="ts">
defineProps<{ count?: number }>()
</script>

<template>
  <div class="skeleton-card" v-for="n in (count || 3)" :key="n">
    <div class="sk-date" />
    <div class="sk-title" />
    <div class="sk-line" />
    <div class="sk-line short" />
  </div>
</template>

<style scoped>
.skeleton-card {
  padding: 20px 0;
  border-bottom: 1px solid #21262d;
}

.sk-date {
  width: 80px;
  height: 13px;
  background: #21262d;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: shimmer 1.5s infinite;
}

.sk-title {
  width: 60%;
  height: 20px;
  background: #21262d;
  border-radius: 4px;
  margin-bottom: 10px;
  animation: shimmer 1.5s infinite;
  animation-delay: 0.1s;
}

.sk-line {
  width: 100%;
  height: 14px;
  background: #21262d;
  border-radius: 4px;
  margin-bottom: 8px;
  animation: shimmer 1.5s infinite;
  animation-delay: 0.2s;
}

.sk-line.short {
  width: 70%;
}

@keyframes shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>
