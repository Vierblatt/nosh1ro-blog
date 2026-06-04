<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Post } from '../types/post'
import { parseMarkdown } from '../utils/markdown'

const props = defineProps<{ post: Post }>()
const password = ref('')
const rawContent = ref('')
const error = ref(false)
const loading = ref(false)
const unlocked = ref(false)
const htmlContent = computed(() => parseMarkdown(rawContent.value))
const enc = props.post.encryption!

async function decrypt() {
  if (!password.value) return
  error.value = false
  loading.value = true
  try {
    const encoder = new TextEncoder()
    const salt = Uint8Array.from(atob(enc.salt), c => c.charCodeAt(0))
    const nonce = Uint8Array.from(atob(enc.nonce), c => c.charCodeAt(0))
    const ciphertext = Uint8Array.from(atob(enc.ciphertext), c => c.charCodeAt(0))
    const km = await crypto.subtle.importKey('raw', encoder.encode(password.value), 'PBKDF2', false, ['deriveKey'])
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, key, ciphertext)
    rawContent.value = new TextDecoder().decode(plain)
    unlocked.value = true
  } catch {
    error.value = true
    password.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="post-section encrypted">
    <time>{{ post.date }}</time>
    <h2 class="post-title">🔒 {{ post.title }}</h2>

    <div v-if="!unlocked" class="lock-box">
      <p>这篇文章已加密，输入密码查看</p>
      <div class="pw-row">
        <input v-model="password" type="password" placeholder="密码" @keydown.enter="decrypt" />
        <button @click="decrypt" :disabled="loading">{{ loading ? '解密中...' : '解锁' }}</button>
      </div>
      <p v-if="error" class="pw-err">密码错误</p>
    </div>

    <div v-else class="post-body" v-html="htmlContent" />
    <hr />
  </section>
</template>
