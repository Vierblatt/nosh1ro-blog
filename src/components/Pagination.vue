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
      上一页
    </button>
    <span class="page-info">{{ page }} / {{ Math.ceil(total / size) }}</span>
    <button
      :disabled="page * size >= total"
      @click="emit('page', page + 1)"
    >
      下一页
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px 0 16px;
}

.pagination button {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #30363d;
  border-color: #58a6ff;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}

.page-info {
  color: #8b949e;
  font-size: 14px;
}
</style>
