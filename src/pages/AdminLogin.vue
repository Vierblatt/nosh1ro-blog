<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/admin'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) return
  error.value = ''
  loading.value = true
  try {
    await login(username.value, password.value)
    router.push('/admin')
  } catch {
    error.value = '用户名或密码错误'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <h1 class="login-title">管理登录</h1>
    <form class="login-form" @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="用户名" autocomplete="username" />
      <input v-model="password" type="password" placeholder="密码" autocomplete="current-password" @keydown.enter="handleLogin" />
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p v-if="error" class="login-err">{{ error }}</p>
    </form>
    <p class="login-back">
      <router-link to="/">&larr; 返回首页</router-link>
    </p>
    <p class="login-register">
      还没有账号？<router-link to="/register">立即注册</router-link>
    </p>
  </div>
</template>

<style scoped>
.login-page {
  max-width: 360px;
  margin: 80px auto 0;
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #e6edf3;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-form input {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 10px 16px;
  color: #c9d1d9;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.login-form input:focus {
  border-color: #58a6ff;
}

.login-form button {
  background: #238636;
  border: none;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.login-form button:hover { background: #2ea043; }
.login-form button:disabled { opacity: 0.6; cursor: default; }

.login-err {
  color: #f85149;
  font-size: 13px;
}

.login-back {
  margin-top: 24px;
}

.login-back a {
  color: #58a6ff;
  text-decoration: none;
  font-size: 13px;
}

.login-back a:hover {
  text-decoration: underline;
}

.login-register {
  margin-top: 12px;
  color: #8b949e;
  font-size: 13px;
}

.login-register a {
  color: #58a6ff;
  text-decoration: none;
}

.login-register a:hover {
  text-decoration: underline;
}
</style>
