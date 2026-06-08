<script setup lang="ts">
defineProps<{ page: number; total: number; size: number }>()
const emit = defineEmits<{ (e: 'page', p: number): void }>()
</script>

<template>
  <div class="pagination" v-if="total > size">
    <button
      :disabled="page <= 1"
      @click="emit('page', page - 1)"
    >
      &larr; 上一页
    </button>
    <span class="page-info">{{ page }} / {{ Math.ceil(total / size) }}</span>
    <button
      :disabled="page * size >= total"
      @click="emit('page', page + 1)"
    >
      下一页 &rarr;
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px 0 8px;
}

.pagination button {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 7px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.15s;
}

.pagination button:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.pagination button:disabled {
  opacity: 0.35;
  cursor: default;
}

.page-info {
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
</style>
