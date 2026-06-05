<script setup lang="ts">
import type { Post } from '../types/post'
import { parseMarkdown } from '../utils/markdown'

const props = defineProps<{ post: Post }>()
const html = props.post.content_html || parseMarkdown(props.post.content)
</script>

<template>
  <section class="post-section">
    <div class="post-meta">
      <time>{{ post.date }}</time>
      <span v-if="post.category" class="post-category">{{ post.category }}</span>
    </div>
    <h2 class="post-title">{{ post.title }}</h2>
    <div class="post-tags" v-if="post.tags?.length">
      <span class="tag" v-for="t in post.tags" :key="t">{{ t }}</span>
    </div>
    <div class="post-body" v-html="html" />
    <hr />
  </section>
</template>
