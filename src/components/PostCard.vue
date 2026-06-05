<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '../types/post'

const props = defineProps<{ post: Post }>()

const readingTime = computed(() => {
  if (!props.post.summary) return null
  const words = props.post.summary.length
  const minutes = Math.max(1, Math.ceil(words / 400))
  return `${minutes} 分钟阅读`
})

const formattedDate = computed(() => {
  const d = new Date(props.post.date)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<template>
  <article class="post-card">
    <div class="card-meta">
      <time :datetime="post.date">{{ formattedDate }}</time>
      <span v-if="post.category" class="card-category">{{ post.category }}</span>
      <span v-if="post.encrypted" class="card-lock" title="加密文章">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4a4 4 0 0 1 8 0v2h.5A1.5 1.5 0 0 1 14 7.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-7A1.5 1.5 0 0 1 3.5 6H4V4zm1.5 2h5V4a2.5 2.5 0 0 0-5 0v2z"/></svg>
      </span>
      <span v-if="readingTime" class="card-readtime">{{ readingTime }}</span>
    </div>
    <h2 class="card-title">
      <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
    </h2>
    <p v-if="post.summary" class="card-summary">{{ post.summary }}</p>
    <div class="card-tags" v-if="post.tags?.length">
      <span class="card-tag" v-for="t in post.tags" :key="t">{{ t }}</span>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  padding: 22px 16px;
  margin: 0 -16px;
  border-radius: 8px;
  border-bottom: 1px solid #21262d;
  transition: background 0.2s, transform 0.2s;
}

.post-card:hover {
  background: #161b22;
  transform: translateX(4px);
}

.post-card:last-child {
  border-bottom: none;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.card-meta time {
  color: #6e7681;
  font-size: 13px;
}

.card-category {
  font-size: 12px;
  color: #8b949e;
  background: #21262d;
  padding: 2px 8px;
  border-radius: 10px;
}

.card-lock {
  color: #d29922;
  display: flex;
  align-items: center;
}

.card-readtime {
  color: #484f58;
  font-size: 12px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.4;
}

.card-title a {
  color: #e6edf3;
  text-decoration: none;
  transition: color 0.2s;
}

.card-title a:hover {
  color: #58a6ff;
}

.card-summary {
  color: #8b949e;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-tag {
  font-size: 12px;
  color: #58a6ff;
  background: rgba(88, 166, 255, 0.08);
  padding: 2px 10px;
  border-radius: 10px;
  border: 1px solid rgba(88, 166, 255, 0.15);
  transition: all 0.2s;
}

.card-tag:hover {
  background: rgba(88, 166, 255, 0.18);
  border-color: rgba(88, 166, 255, 0.35);
}

@media (max-width: 640px) {
  .post-card {
    margin: 0 -12px;
    padding: 18px 12px;
    border-radius: 0;
  }

  .post-card:hover {
    transform: none;
  }

  .card-title { font-size: 18px; }
}
</style>
