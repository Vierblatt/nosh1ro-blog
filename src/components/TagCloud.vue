<script setup lang="ts">
defineProps<{ tags: string[]; selected: string[] }>()
const emit = defineEmits<{ (e: 'toggle', tag: string): void }>()
</script>

<template>
  <div class="tag-cloud" v-if="tags.length">
    <button
      v-for="t in tags"
      :key="t"
      class="tag-btn"
      :class="{ active: selected.includes(t) }"
      @click="emit('toggle', t)"
    >
      {{ t }}
    </button>
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.tag-btn {
  font-size: 12px;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 3px 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.tag-btn:hover {
  background: rgba(52, 81, 178, 0.2);
}

.tag-btn.active {
  background: var(--vp-c-brand);
  color: #fff;
}
</style>
