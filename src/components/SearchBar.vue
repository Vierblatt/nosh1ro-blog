<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{ (e: 'search', value: string): void }>()
const input = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

watch(input, (val) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    emit('search', val)
  }, 300)
})
</script>

<template>
  <div class="search-bar">
    <svg class="search-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.156a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/>
    </svg>
    <input
      v-model="input"
      type="text"
      placeholder="搜索文章..."
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  margin-bottom: 24px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #484f58;
}

.search-input {
  width: 100%;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 10px 16px 10px 38px;
  color: #c9d1d9;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #58a6ff;
}

.search-input::placeholder {
  color: #484f58;
}
</style>
