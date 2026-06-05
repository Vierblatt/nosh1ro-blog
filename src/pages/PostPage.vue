<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Post } from '../types/post'
import { fetchPost, verifyPost } from '../api/public'
import { parseMarkdown } from '../utils/markdown'
import EncryptedLock from '../components/EncryptedLock.vue'

const route = useRoute()
const post = ref<Post | null>(null)
const decryptedContent = ref('')
const decryptedHtml = ref('')
const loading = ref(true)
const error = ref('')
const lockLoading = ref(false)
const lockError = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    post.value = await fetchPost(route.params.id as string)
  } catch {
    error.value = '文章不存在'
  } finally {
    loading.value = false
  }
}

async function handleUnlock(password: string) {
  lockLoading.value = true
  lockError.value = ''
  try {
    decryptedContent.value = await verifyPost(route.params.id as string, password)
    decryptedHtml.value = parseMarkdown(decryptedContent.value)
  } catch {
    lockError.value = '密码错误'
  } finally {
    lockLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="post-page">
    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="error" class="status-msg">{{ error }}</div>
    <template v-else-if="post">
      <article>
        <header class="post-header">
          <div class="post-meta">
            <router-link to="/" class="back-link">&larr; 首页</router-link>
            <time>{{ post.date }}</time>
            <span v-if="post.category" class="post-category">{{ post.category }}</span>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-tags" v-if="post.tags?.length">
            <span class="tag" v-for="t in post.tags" :key="t">{{ t }}</span>
          </div>
        </header>

        <div
          v-if="post.encrypted && !decryptedContent"
          class="post-body"
        >
          <EncryptedLock
            :loading="lockLoading"
            :error="lockError"
            @unlock="handleUnlock"
          />
        </div>

        <div
          v-else
          class="post-body markdown-body"
          v-html="decryptedHtml || post.content_html || parseMarkdown(post.content || '')"
        />
      </article>
    </template>
  </div>
</template>

<style scoped>
.post-page {
  padding: 24px 0;
}

.back-link {
  color: #58a6ff;
  text-decoration: none;
  font-size: 13px;
}

.back-link:hover {
  text-decoration: underline;
}

.post-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #21262d;
  margin-bottom: 24px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.post-meta time {
  color: #6e7681;
  font-size: 13px;
}

.post-category {
  font-size: 12px;
  color: #8b949e;
  background: #21262d;
  padding: 2px 8px;
  border-radius: 12px;
}

.post-title {
  font-size: 28px;
  font-weight: 600;
  color: #e6edf3;
  margin-bottom: 10px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 12px;
  color: #58a6ff;
  background: rgba(88, 166, 255, 0.1);
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(88, 166, 255, 0.2);
}

.status-msg {
  text-align: center;
  padding: 48px 0;
  color: #8b949e;
  font-size: 16px;
}

/* Inherit most markdown-body styles from global style.css */
.post-body {
  color: #e6edf3;
}
</style>
