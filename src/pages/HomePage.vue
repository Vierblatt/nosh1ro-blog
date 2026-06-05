<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Post, PostListResponse } from '../types/post'
import { fetchPosts, fetchTags } from '../api/public'
import SearchBar from '../components/SearchBar.vue'
import TagCloud from '../components/TagCloud.vue'
import PostCard from '../components/PostCard.vue'
import Pagination from '../components/Pagination.vue'
import SkeletonCard from '../components/SkeletonCard.vue'

const posts = ref<Post[]>([])
const tags = ref<string[]>([])
const selectedTags = ref<string[]>([])
const searchQuery = ref('')
const page = ref(1)
const total = ref(0)
const size = 10
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data: PostListResponse = await fetchPosts({
      page: page.value,
      size,
      tag: selectedTags.value.join(','),
      q: searchQuery.value || undefined,
    })
    posts.value = data.posts
    total.value = data.total
  } catch {
    error.value = '加载失败，请刷新重试'
  } finally {
    loading.value = false
  }
}

function toggleTag(tag: string) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
  page.value = 1
}

function onSearch(val: string) {
  searchQuery.value = val
  page.value = 1
}

watch([selectedTags, searchQuery, page], () => load(), { deep: true })

onMounted(async () => {
  try {
    tags.value = await fetchTags()
  } catch { /* tags are optional */ }
  load()
})
</script>

<template>
  <div class="home">
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">nosh1ro</h1>
        <p class="hero-desc">一个在学 Go 的大二学生</p>
        <div class="hero-links">
          <a href="https://github.com/Vierblatt" target="_blank" rel="noopener" class="hero-link">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            GitHub
          </a>
          <a href="/api/feed.xml" target="_blank" rel="noopener" class="hero-link">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1 0-2zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1 0-2zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
            RSS
          </a>
        </div>
      </div>
    </header>

    <SearchBar @search="onSearch" />
    <TagCloud :tags="tags" :selected="selectedTags" @toggle="toggleTag" />

    <SkeletonCard v-if="loading" :count="3" />
    <div v-else-if="error" class="status-msg">{{ error }}</div>
    <div v-else-if="!posts.length" class="status-msg">暂无文章</div>
    <template v-else>
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
      <Pagination :page="page" :total="total" :size="size" @page="p => page = p" />
    </template>
  </div>
</template>

<style scoped>
.home { padding: 8px 0; }

.hero {
  padding: 40px 0 32px;
  border-bottom: 1px solid #30363d;
  margin-bottom: 24px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  background: linear-gradient(135deg, #58a6ff 0%, #bc8cff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.hero-desc {
  color: #8b949e;
  font-size: 16px;
  margin-bottom: 16px;
}

.hero-links {
  display: flex;
  gap: 12px;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8b949e;
  text-decoration: none;
  font-size: 13px;
  padding: 6px 14px;
  border: 1px solid #30363d;
  border-radius: 6px;
  transition: all 0.2s;
}

.hero-link:hover {
  color: #e6edf3;
  border-color: #58a6ff;
  background: rgba(88, 166, 255, 0.08);
}

.status-msg {
  text-align: center;
  padding: 48px 0;
  color: #8b949e;
  font-size: 16px;
}

@media (max-width: 640px) {
  .hero { padding: 24px 0 20px; }
  .hero-title { font-size: 28px; }
}
</style>
