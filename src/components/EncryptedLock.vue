<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ loading: boolean; error: string }>()
const emit = defineEmits<{ (e: 'unlock', password: string): void }>()

const password = ref('')

function submit() {
  if (!password.value || props.loading) return
  emit('unlock', password.value)
  password.value = ''
}
</script>

<template>
  <div class="lock-box">
    <p>这篇文章已加密，输入密码查看</p>
    <div class="pw-row">
      <input
        v-model="password"
        type="password"
        placeholder="密码"
        @keydown.enter="submit"
      />
      <button @click="submit" :disabled="loading">
        {{ loading ? '解密中...' : '解锁' }}
      </button>
    </div>
    <p v-if="error" class="pw-err">{{ error }}</p>
  </div>
</template>

<style scoped>
.lock-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius);
  padding: 24px;
  text-align: center;
  margin-bottom: 16px;
}

.lock-box p {
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}

.pw-row {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pw-row input {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  width: 220px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.pw-row input:focus {
  border-color: var(--vp-c-brand);
}

.pw-row button {
  background: var(--vp-c-green);
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: background 0.2s;
  white-space: nowrap;
}

.pw-row button:hover { filter: brightness(1.1); }
.pw-row button:disabled { opacity: 0.6; cursor: default; }

.pw-err {
  color: var(--vp-c-red) !important;
  margin-top: 8px;
  font-size: 13px;
}
</style>
