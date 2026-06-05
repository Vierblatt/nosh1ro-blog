<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Post } from '../types/post'
import { verifyPost } from '../api'
import { parseMarkdown } from '../utils/markdown'

const props = defineProps<{ post: Post }>()

const password = ref('')
const rawContent = ref('')
const error = ref(false)
const loading = ref(false)
const unlocked = ref(false)
const htmlContent = computed(() => parseMarkdown(rawContent.value))

async function decrypt() {
  if (!password.value) return
  error.value = false
  loading.value = true
  try {
    rawContent.value = await verifyPost(props.post.id, password.value)
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
    <div class="post-meta">
      <time>{{ post.date }}</time>
      <span v-if="post.category" class="post-category">{{ post.category }}</span>
    </div>
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
