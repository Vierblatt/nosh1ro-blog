<script setup lang="ts">
import { ref, computed } from 'vue'
import { registerUser } from '../api/admin'
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const passwordError = computed(() => {
  const pw = password.value
  if (!pw) return ''
  if (pw.length < 8) return '密码至少需要8个字符'
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return '密码必须包含字母和数字'
  return ''
})

const confirmError = computed(() => {
  if (!confirmPassword.value) return ''
  if (password.value !== confirmPassword.value) return '两次输入的密码不一致'
  return ''
})

const canSubmit = computed(() => {
  return username.value && email.value && password.value && confirmPassword.value &&
    !passwordError.value && !confirmError.value && !loading.value
})

async function handleRegister() {
  if (!canSubmit.value) return
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const res = await registerUser({
      username: username.value,
      email: email.value,
      password: password.value,
      confirm_password: confirmPassword.value,
    })
    success.value = res.message
  } catch (e: any) {
    error.value = e.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <h1 class="register-title">注册账号</h1>

    <div v-if="success" class="register-success">
      <p>{{ success }}</p>
      <p class="register-success-hint">请查收验证邮件并点击链接完成验证。</p>
      <router-link to="/admin/login" class="register-link">前往登录</router-link>
    </div>

    <form v-else class="register-form" @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="用户名" autocomplete="username" />
      <input v-model="email" type="email" placeholder="邮箱" autocomplete="email" />
      <input v-model="password" type="password" placeholder="密码（8位以上，含字母和数字）" autocomplete="new-password" />
      <p v-if="passwordError" class="field-err">{{ passwordError }}</p>
      <input v-model="confirmPassword" type="password" placeholder="确认密码" autocomplete="new-password" />
      <p v-if="confirmError" class="field-err">{{ confirmError }}</p>
      <button type="submit" :disabled="!canSubmit">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <p v-if="error" class="register-err">{{ error }}</p>
    </form>

    <p class="register-back">
      已有账号？<router-link to="/admin/login">立即登录</router-link>
    </p>
  </div>
</template>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 60px auto 0;
  text-align: center;
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #e6edf3;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.register-form input {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 10px 16px;
  color: #c9d1d9;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.register-form input:focus {
  border-color: #58a6ff;
}

.register-form button {
  background: #238636;
  border: none;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  margin-top: 4px;
}

.register-form button:hover { background: #2ea043; }
.register-form button:disabled { opacity: 0.6; cursor: default; }

.field-err {
  color: #f85149;
  font-size: 12px;
  text-align: left;
  margin: -8px 0 0 4px;
}

.register-err {
  color: #f85149;
  font-size: 13px;
}

.register-success {
  background: #0d1b14;
  border: 1px solid #238636;
  border-radius: 8px;
  padding: 24px;
  color: #7ee787;
}

.register-success p {
  margin: 0 0 8px;
}

.register-success-hint {
  color: #8b949e;
  font-size: 13px;
}

.register-link {
  display: inline-block;
  margin-top: 12px;
  color: #58a6ff;
  text-decoration: none;
  font-size: 14px;
}

.register-link:hover { text-decoration: underline; }

.register-back {
  margin-top: 24px;
  color: #8b949e;
  font-size: 13px;
}

.register-back a {
  color: #58a6ff;
  text-decoration: none;
}

.register-back a:hover { text-decoration: underline; }
</style>
