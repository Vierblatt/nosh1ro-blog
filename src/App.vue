<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Post, PostListResponse } from './types/post'
import { fetchPosts } from './api'
import PostSection from './components/PostSection.vue'
import EncryptedPost from './components/EncryptedPost.vue'

const publicPosts = ref<Post[]>([])
const encryptedPosts = ref<Post[]>([])
const error = ref(false)
const loading = ref(true)

onMounted(async () => {
  try {
    const data: PostListResponse = await fetchPosts({ size: 50 })
    publicPosts.value = data.posts.filter(p => !p.encrypted)
    encryptedPosts.value = data.posts.filter(p => p.encrypted)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1 class="site-title">nosh1ro</h1>
      <p class="site-desc">一个在学 Go 的大二学生</p>
    </header>

    <main class="markdown-body">
      <div v-if="loading" class="status-msg">加载中...</div>
      <div v-else-if="error" class="status-msg">加载失败，请刷新重试</div>
      <template v-else>
        <PostSection
          v-for="post in publicPosts"
          :key="post.id"
          :post="post"
        />
        <EncryptedPost
          v-for="post in encryptedPosts"
          :key="post.id"
          :post="post"
        />
      </template>
    </main>

    <footer class="page-footer">
      <span class="dot" />Vue 3 + Vite · Cloudflare · Ubuntu 24.04
    </footer>
  </div>
</template>
