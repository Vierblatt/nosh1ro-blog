<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'

interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{ container: HTMLElement | null }>()

const items = ref<TocItem[]>([])
const activeId = ref('')

function scan() {
  if (!props.container) return
  const headings = props.container.querySelectorAll('h2, h3')
  const result: TocItem[] = []
  headings.forEach((h) => {
    const text = h.textContent || ''
    if (!h.id) {
      h.id = text
        .toLowerCase()
        .replace(/[^\w一-鿿]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    result.push({ id: h.id, text, level: Number(h.tagName[1]) })
  })
  items.value = result
  observe()
}

let observer: IntersectionObserver | null = null

function observe() {
  observer?.disconnect()
  const headingEls = props.container?.querySelectorAll('h2, h3')
  if (!headingEls?.length) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
          break
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
  )

  headingEls.forEach((h) => observer!.observe(h))
}

watch(() => props.container, async (el) => {
  if (el) {
    await nextTick()
    scan()
  }
}, { immediate: true })

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav v-if="items.length" class="toc">
    <h4 class="toc-title">目录</h4>
    <ul class="toc-list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="['toc-item', `toc-level-${item.level}`, { active: item.id === activeId }]"
      >
        <a :href="`#${item.id}`" @click.prevent="scrollTo(item.id)">
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.toc {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.toc-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 1px solid var(--vp-c-divider);
}

.toc-item {
  line-height: 1.5;
}

.toc-item a {
  display: block;
  padding: 4px 0 4px 12px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.15s;
  border-left: 2px solid transparent;
  margin-left: -1px;
}

.toc-item a:hover {
  color: var(--vp-c-text-1);
}

.toc-item.active a {
  color: var(--vp-c-brand);
  border-left-color: var(--vp-c-brand);
}

.toc-level-3 a {
  padding-left: 24px;
}
</style>
