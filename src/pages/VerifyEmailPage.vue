<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { verifyEmail } from '../api/admin'

const route = useRoute()
const state = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) {
    state.value = 'error'
    message.value = '缺少验证令牌'
    return
  }
  try {
    const res = await verifyEmail(token)
    state.value = 'success'
    message.value = res.message
  } catch (e: unknown) {
    state.value = 'error'
    message.value = (e instanceof Error ? e.message : null) || '验证失败，链接可能已过期'
  }
})
</script>

<template>
  <div class="verify-page">
    <div v-if="state === 'loading'" class="verify-loading">
      <p>正在验证邮箱...</p>
    </div>
    <div v-else-if="state === 'success'" class="verify-box verify-success-box">
      <h1 class="verify-icon">&#10003;</h1>
      <p class="verify-msg">{{ message }}</p>
      <router-link to="/admin/login" class="verify-link">前往登录</router-link>
    </div>
    <div v-else class="verify-box verify-error-box">
      <h1 class="verify-icon verify-icon-err">&#10007;</h1>
      <p class="verify-msg">{{ message }}</p>
      <router-link to="/" class="verify-link">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.verify-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
  padding: 0 20px;
}

.verify-loading {
  color: var(--vp-c-text-2);
  font-size: 16px;
}

.verify-box {
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  max-width: 420px;
  width: 100%;
}

.verify-success-box {
  background: var(--vp-c-green-soft);
  border: 1px solid var(--vp-c-green);
}

.verify-error-box {
  background: var(--vp-c-red-soft);
  border: 1px solid var(--vp-c-red);
}

.verify-icon {
  font-size: 48px;
  margin: 0 0 16px;
  color: var(--vp-c-green);
}

.verify-icon-err {
  color: var(--vp-c-red);
}

.verify-msg {
  color: var(--vp-c-text-1);
  font-size: 16px;
  margin: 0 0 20px;
}

.verify-link {
  display: inline-block;
  background: var(--vp-c-brand);
  color: #fff;
  padding: 10px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.verify-link:hover { background: var(--vp-c-brand-light); }
</style>
