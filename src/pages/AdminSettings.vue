<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSettings, updateSettings } from '../api/admin'

const title = ref('')
const subtitle = ref('')
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const s = await getSettings()
    title.value = s.title
    subtitle.value = s.subtitle
  } catch {
    error.value = '加载设置失败'
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    await updateSettings({ title: title.value, subtitle: subtitle.value })
    success.value = '保存成功'
  } catch {
    error.value = '保存失败'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="settings">
    <h1>博客设置</h1>

    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="error && !title" class="status-msg">{{ error }}</div>
    <form v-else class="settings-form" @submit.prevent="save">
      <label>
        <span>博客标题</span>
        <input v-model="title" type="text" />
      </label>
      <label>
        <span>副标题</span>
        <input v-model="subtitle" type="text" />
      </label>
      <button type="submit" :disabled="saving">
        {{ saving ? '保存中...' : '保存' }}
      </button>
      <p v-if="success" class="msg-success">{{ success }}</p>
      <p v-if="error && title" class="msg-error">{{ error }}</p>
    </form>

    <p class="back-link">
      <router-link to="/admin">&larr; 返回管理</router-link>
    </p>
  </div>
</template>

<style scoped>
.settings {
  padding: 24px 0;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #e6edf3;
  margin-bottom: 24px;
}

.status-msg {
  text-align: center;
  padding: 48px 0;
  color: #8b949e;
  font-size: 16px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 480px;
}

.settings-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-form label span {
  font-size: 13px;
  color: #8b949e;
  font-weight: 500;
}

.settings-form input {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 10px 16px;
  color: #c9d1d9;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.settings-form input:focus {
  border-color: #58a6ff;
}

.settings-form button {
  align-self: flex-start;
  background: #238636;
  border: none;
  color: #fff;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.settings-form button:hover { background: #2ea043; }
.settings-form button:disabled { opacity: 0.6; cursor: default; }

.msg-success { color: #3fb950; font-size: 13px; }
.msg-error { color: #f85149; font-size: 13px; }

.back-link { margin-top: 32px; }
.back-link a {
  color: #58a6ff;
  text-decoration: none;
  font-size: 13px;
}
.back-link a:hover { text-decoration: underline; }
</style>
