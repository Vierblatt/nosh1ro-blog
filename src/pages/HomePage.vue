<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Post, PostListResponse } from '../types/post'
import { fetchPosts, fetchTags } from '../api/public'
import SearchBar from '../components/SearchBar.vue'
import TagCloud from '../components/TagCloud.vue'
import PostCard from '../components/PostCard.vue'
import Pagination from '../components/Pagination.vue'

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
    <header class="page-header">
      <h1 class="site-title">nosh1ro</h1>
      <p class="site-desc">一个在学 Go 的大二学生</p>
    </header>

    <SearchBar @search="onSearch" />
    <TagCloud :tags="tags" :selected="selectedTags" @toggle="toggleTag" />

    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="error" class="status-msg">{{ error }}</div>
    <div v-else-if="!posts.length" class="status-msg">暂无文章</div>
    <template v-else>
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
      <Pagination :page="page" :total="total" :size="size" @page="p => page = p" />
    </template>
  </div>
</template>

<style scoped>
.home {
  /* contained by .page in App.vue */
}

.page-header {
  padding: 32px 0 24px;
  border-bottom: 1px solid #30363d;
  margin-bottom: 24px;
}

.site-title {
  font-size: 32px;
  font-weight: 600;
  background: linear-gradient(135deg, #58a6ff, #bc8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.site-desc {
  color: #8b949e;
  font-size: 16px;
}

.status-msg {
  text-align: center;
  padding: 48px 0;
  color: #8b949e;
  font-size: 16px;
}
</style>
