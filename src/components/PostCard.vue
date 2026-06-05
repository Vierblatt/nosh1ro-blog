<script setup lang="ts">
import type { Post } from '../types/post'

defineProps<{ post: Post }>()
</script>

<template>
  <article class="post-card">
    <div class="post-meta">
      <time>{{ post.date }}</time>
      <span v-if="post.category" class="post-category">{{ post.category }}</span>
      <span v-if="post.status === 'draft'" class="draft-badge">草稿</span>
      <span v-if="post.encrypted" class="lock-icon">🔒</span>
    </div>
    <h2 class="post-title">
      <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
    </h2>
    <p v-if="post.summary" class="post-summary">{{ post.summary }}</p>
    <div class="post-tags" v-if="post.tags?.length">
      <span class="tag" v-for="t in post.tags" :key="t">{{ t }}</span>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  padding: 20px 0;
  border-bottom: 1px solid #21262d;
}

.post-card:last-child {
  border-bottom: none;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
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

.draft-badge {
  font-size: 12px;
  color: #d29922;
  background: rgba(210, 153, 34, 0.15);
  padding: 2px 8px;
  border-radius: 12px;
}

.lock-icon {
  font-size: 12px;
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.post-title a {
  color: #e6edf3;
  text-decoration: none;
  transition: color 0.2s;
}

.post-title a:hover {
  color: #58a6ff;
}

.post-summary {
  color: #8b949e;
  font-size: 14px;
  line-height: 1.6;
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
</style>
