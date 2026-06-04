<script setup lang="ts">
import { posts } from './data/posts'
import PostSection from './components/PostSection.vue'
import EncryptedPost from './components/EncryptedPost.vue'

const publicPosts = posts.filter(p => !p.encrypted)
const encryptedPosts = posts.filter(p => p.encrypted)
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1 class="site-title">nosh1ro</h1>
      <p class="site-desc">一个在学 Go 的大二学生</p>
    </header>

    <main class="markdown-body">
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
    </main>

    <footer class="page-footer">
      <span class="dot" />Vue 3 + Vite · Cloudflare · Ubuntu 24.04
    </footer>
  </div>
</template>
