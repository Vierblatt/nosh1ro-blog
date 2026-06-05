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
  margin-bottom: 24px;
}

.tag-btn {
  font-size: 12px;
  color: #58a6ff;
  background: rgba(88, 166, 255, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(88, 166, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tag-btn:hover {
  background: rgba(88, 166, 255, 0.2);
}

.tag-btn.active {
  background: #1f6feb;
  color: #fff;
  border-color: #1f6feb;
}
</style>
