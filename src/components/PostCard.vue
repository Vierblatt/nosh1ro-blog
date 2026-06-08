<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '../types/post'

const props = defineProps<{ post: Post; titleHtml?: string; summaryHtml?: string }>()

const readingTime = computed(() => {
  if (!props.post.summary) return null
  const words = props.post.summary.length
  const minutes = Math.max(1, Math.ceil(words / 400))
  return `${minutes} 分钟阅读`
})
</script>

<template>
  <article class="post-card">
    <time :datetime="post.date" class="card-date">{{ post.date }}</time>
    <div class="card-body">
      <h2 class="card-title">
        <router-link v-if="!titleHtml" :to="`/posts/${post.id}`">{{ post.title }}</router-link>
        <router-link v-else :to="`/posts/${post.id}`" v-html="titleHtml"></router-link>
      </h2>
      <p v-if="summaryHtml" class="card-summary" v-html="summaryHtml"></p>
      <p v-else-if="post.summary" class="card-summary">{{ post.summary }}</p>
      <div class="card-meta">
        <span v-if="post.category" class="card-category">{{ post.category }}</span>
        <span v-if="post.encrypted" class="card-lock" title="加密文章">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4a4 4 0 0 1 8 0v2h.5A1.5 1.5 0 0 1 14 7.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-7A1.5 1.5 0 0 1 3.5 6H4V4zm1.5 2h5V4a2.5 2.5 0 0 0-5 0v2z"/></svg>
        </span>
        <span v-if="readingTime" class="card-readtime">{{ readingTime }}</span>
      </div>
      <div class="card-tags" v-if="post.tags?.length">
        <span class="card-tag" v-for="t in post.tags" :key="t">{{ t }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-card:last-child {
  border-bottom: none;
}

.card-date {
  flex-shrink: 0;
  width: 90px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  padding-top: 4px;
  font-variant-numeric: tabular-nums;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 4px;
}

.card-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.15s;
}

.card-title a:hover {
  color: var(--vp-c-brand);
}

.card-title :deep(em) {
  color: var(--vp-c-brand);
  font-style: normal;
}

.card-summary {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary :deep(em) {
  color: var(--vp-c-text-1);
  background: var(--vp-c-yellow-soft);
  font-style: normal;
  padding: 0 2px;
  border-radius: 2px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.card-category {
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-mute);
  padding: 1px 8px;
  border-radius: 10px;
}

.card-lock {
  color: var(--vp-c-yellow);
  display: flex;
  align-items: center;
}

.card-readtime {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-tag {
  font-size: 12px;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 1px 8px;
  border-radius: 10px;
  transition: background 0.15s;
}

.card-tag:hover {
  background: rgba(52, 81, 178, 0.24);
}

@media (max-width: 640px) {
  .post-card {
    flex-direction: column;
    gap: 4px;
    padding: 16px 0;
  }

  .card-date {
    width: auto;
    padding-top: 0;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
