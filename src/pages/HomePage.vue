<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Post, PostListResponse, SearchHit, AggBucket } from '../types/post'
import { fetchPosts, searchPosts, fetchTags } from '../api/public'
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

const searchResults = ref<SearchHit[] | null>(null)
const aggs = ref<{ categories: AggBucket[]; tags: AggBucket[] }>({ categories: [], tags: [] })
const searchHl = ref<Record<string, { title?: string; summary?: string }>>({})

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (searchQuery.value && !selectedTags.value.length) {
      const result = await searchPosts({
        q: searchQuery.value,
        page: page.value,
        size,
      })
      searchResults.value = result.posts
      total.value = result.total
      aggs.value = result.aggregations
      const hl: Record<string, { title?: string; summary?: string }> = {}
      for (const h of result.posts) {
        if (h.highlights) {
          hl[h.id] = {
            title: h.highlights.title?.[0],
            summary: h.highlights.content?.[0],
          }
        }
      }
      searchHl.value = hl
    } else {
      searchResults.value = null
      aggs.value = { categories: [], tags: [] }
      searchHl.value = {}
      const data: PostListResponse = await fetchPosts({
        page: page.value,
        size,
        tag: selectedTags.value.join(',') || undefined,
        q: selectedTags.value.length ? undefined : (searchQuery.value || undefined),
      })
      posts.value = data.posts
      total.value = data.total
    }
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

function onAggClick(type: 'categories' | 'tags', key: string) {
  if (type === 'tags') {
    toggleTag(key)
  }
}

watch([selectedTags, searchQuery, page], () => load(), { deep: true })

onMounted(async () => {
  try {
    tags.value = await fetchTags()
  } catch { /* tags are optional */ }
  load()
})

function toPost(hit: SearchHit): Post {
  return {
    id: hit.id,
    title: hit.title,
    summary: hit.summary,
    date: hit.date,
    category: hit.category,
    tags: hit.tags,
  }
}
</script>

<template>
  <div class="home">
    <header class="hero">
      <h1 class="hero-title">nosh1ro</h1>
      <p class="hero-desc">一个在学 Go 的大二学生</p>
      <div class="hero-links">
        <a href="https://github.com/Vierblatt" target="_blank" rel="noopener" class="hero-btn hero-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub
        </a>
        <a href="/api/feed.xml" target="_blank" rel="noopener" class="hero-btn hero-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1 0-2zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1 0-2zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
          RSS
        </a>
      </div>
    </header>

    <section class="filters">
      <SearchBar @search="onSearch" />
      <TagCloud :tags="tags" :selected="selectedTags" @toggle="toggleTag" />
    </section>

    <!-- Aggregation chips -->
    <div v-if="aggs.categories.length || aggs.tags.length" class="agg-bar">
      <template v-if="aggs.categories.length">
        <span class="agg-label">分类</span>
        <button
          v-for="c in aggs.categories" :key="c.key"
          class="agg-chip"
          @click="onAggClick('categories', c.key)"
        >{{ c.key }} <span class="agg-count">{{ c.count }}</span></button>
      </template>
      <template v-if="aggs.tags.length">
        <span class="agg-label">标签</span>
        <button
          v-for="t in aggs.tags" :key="t.key"
          class="agg-chip"
          @click="onAggClick('tags', t.key)"
        >{{ t.key }} <span class="agg-count">{{ t.count }}</span></button>
      </template>
    </div>

    <section class="post-list">
      <SkeletonCard v-if="loading" :count="3" />
      <div v-else-if="error" class="status-msg">{{ error }}</div>
      <div v-else-if="!searchResults && !posts.length" class="status-msg">暂无文章</div>
      <div v-else-if="searchResults && !searchResults.length" class="status-msg">未找到匹配文章</div>
      <template v-else>
        <template v-if="searchResults">
          <PostCard
            v-for="hit in searchResults"
            :key="hit.id"
            :post="toPost(hit)"
            :title-html="searchHl[hit.id]?.title"
            :summary-html="searchHl[hit.id]?.summary"
          />
        </template>
        <template v-else>
          <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </template>
        <Pagination :page="page" :total="total" :size="size" @page="p => page = p" />
      </template>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding: 8px 0;
}

/* ===== Hero ===== */
.hero {
  padding: 56px 0 40px;
  text-align: center;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
  letter-spacing: -1px;
  line-height: 1.2;
}

.hero-desc {
  color: var(--vp-c-text-2);
  font-size: 18px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.hero-links {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 22px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.hero-btn-primary {
  background: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand);
  color: #fff;
}

.hero-btn-primary:hover {
  background: var(--vp-c-brand-light);
  border-color: var(--vp-c-brand-light);
  color: #fff;
}

.hero-btn-secondary {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
}

.hero-btn-secondary:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

/* ===== Filters ===== */
.filters {
  padding: 24px 0 8px;
  border-top: 1px solid var(--vp-c-divider);
}

/* ===== Aggregation ===== */
.agg-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius);
}

.agg-label {
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 4px;
}

.agg-chip {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.agg-chip:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.agg-count {
  color: var(--vp-c-text-3);
  font-size: 11px;
  margin-left: 2px;
}

/* ===== Post list ===== */
.post-list {
  padding: 8px 0;
}

@media (max-width: 640px) {
  .hero {
    padding: 32px 0 24px;
  }

  .hero-title {
    font-size: 30px;
  }

  .hero-desc {
    font-size: 16px;
  }
}
</style>
