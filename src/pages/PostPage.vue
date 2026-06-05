<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '../types/post'
import { fetchPost, verifyPost } from '../api/public'
import { parseMarkdown } from '../utils/markdown'
import EncryptedLock from '../components/EncryptedLock.vue'

const route = useRoute()
const router = useRouter()
const post = ref<Post | null>(null)
const decryptedContent = ref('')
const decryptedHtml = ref('')
const loading = ref(true)
const error = ref('')
const lockLoading = ref(false)
const lockError = ref('')

function addCopyButtons() {
  const pres = document.querySelectorAll('.post-body pre')
  pres.forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = '复制'
    btn.onclick = async () => {
      const code = pre.querySelector('code')
      const text = code?.textContent || pre.textContent || ''
      try {
        await navigator.clipboard.writeText(text)
        btn.textContent = '已复制'
        setTimeout(() => (btn.textContent = '复制'), 2000)
      } catch {
        btn.textContent = '失败'
        setTimeout(() => (btn.textContent = '复制'), 2000)
      }
    }
    ;(pre as HTMLElement).style.position = 'relative'
    pre.appendChild(btn)
  })
}

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
    await nextTick()
    addCopyButtons()
  } catch {
    lockError.value = '密码错误'
  } finally {
    lockLoading.value = false
  }
}

watch(() => route.params.id, () => {
  decryptedContent.value = ''
  decryptedHtml.value = ''
  load()
})

watch([() => post.value?.content_html, decryptedHtml], async () => {
  await nextTick()
  addCopyButtons()
})

onMounted(load)
</script>

<template>
  <div class="post-page">
    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="error" class="status-msg">{{ error }}</div>
    <template v-else-if="post">
      <article>
        <header class="post-header">
          <nav class="post-nav">
            <button @click="router.back()" class="back-btn">&larr; 返回</button>
            <a v-if="post.category" class="post-cat-badge">{{ post.category }}</a>
          </nav>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta-row">
            <time :datetime="post.date">{{ post.date }}</time>
            <span v-if="post.encrypted" class="enc-badge">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4a4 4 0 0 1 8 0v2h.5A1.5 1.5 0 0 1 14 7.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-7A1.5 1.5 0 0 1 3.5 6H4V4zm1.5 2h5V4a2.5 2.5 0 0 0-5 0v2z"/></svg>
              加密文章
            </span>
          </div>
          <div class="post-tags" v-if="post.tags?.length">
            <span class="post-tag" v-for="t in post.tags" :key="t">{{ t }}</span>
          </div>
        </header>

        <div v-if="post.encrypted && !decryptedContent" class="post-body">
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
  padding: 16px 0 32px;
}

.post-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #21262d;
  margin-bottom: 28px;
}

.post-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.back-btn {
  background: none;
  border: none;
  color: #58a6ff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  font-family: inherit;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #79c0ff;
}

.post-cat-badge {
  font-size: 12px;
  color: #8b949e;
  background: #21262d;
  padding: 3px 10px;
  border-radius: 10px;
  text-decoration: none;
}

.post-title {
  font-size: 30px;
  font-weight: 700;
  color: #e6edf3;
  margin-bottom: 12px;
  line-height: 1.35;
  letter-spacing: -0.3px;
}

.post-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.post-meta-row time {
  color: #6e7681;
  font-size: 14px;
}

.enc-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #d29922;
  background: rgba(210, 153, 34, 0.1);
  padding: 3px 10px;
  border-radius: 10px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.post-tag {
  font-size: 12px;
  color: #58a6ff;
  background: rgba(88, 166, 255, 0.08);
  padding: 3px 10px;
  border-radius: 10px;
  border: 1px solid rgba(88, 166, 255, 0.15);
}

.status-msg {
  text-align: center;
  padding: 48px 0;
  color: #8b949e;
  font-size: 16px;
}

.post-body {
  color: #e6edf3;
  position: relative;
}

/* copy button injected by JS — global styles needed */
.post-body :deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #30363d;
  border: 1px solid #484f58;
  color: #c9d1d9;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  font-family: inherit;
}

.post-body :deep(pre:hover .copy-btn) {
  opacity: 1;
}

.post-body :deep(.copy-btn:hover) {
  background: #484f58;
}

@media (max-width: 640px) {
  .post-title { font-size: 22px; }
  .post-body :deep(.copy-btn) { opacity: 1; }
}
</style>
