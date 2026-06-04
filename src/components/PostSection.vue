<script setup lang="ts">
import type { Post } from '../types/post'
import { parseMarkdown } from '../utils/markdown'

const props = defineProps<{ post: Post }>()
const html = parseMarkdown(props.post.content)
</script>

<template>
  <section class="post-section">
    <time>{{ post.date }}</time>
    <h2 class="post-title">{{ post.title }}</h2>
    <div class="post-body" v-html="html" />
    <hr />
  </section>
</template>
