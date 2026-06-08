<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'

const props = defineProps<{
  title: string
  content: string
  category: string
  tags: string
  status: string
}>()

const emit = defineEmits<{
  (e: 'save', data: { title: string; content: string; category: string; tags: string[]; status: string }): void
  (e: 'cancel'): void
}>()

const preview = ref(false)
const saving = ref(false)

const localTitle = ref(props.title)
const localContent = ref(props.content)
const localCategory = ref(props.category)
const localTags = ref(props.tags)
const localStatus = ref(props.status)

watch(() => props.title, v => { localTitle.value = v })
watch(() => props.content, v => { localContent.value = v })
watch(() => props.category, v => { localCategory.value = v })
watch(() => props.tags, v => { localTags.value = v })
watch(() => props.status, v => { localStatus.value = v })

const previewHtml = computed(() => marked.parse(localContent.value) as string)

async function handleSave() {
  saving.value = true
  try {
    emit('save', {
      title: localTitle.value,
      content: localContent.value,
      category: localCategory.value,
      tags: localTags.value ? localTags.value.split(',').map(t => t.trim()).filter(Boolean) : [],
      status: localStatus.value,
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="editor">
    <div class="editor-toolbar">
      <input
        v-model="localTitle"
        type="text"
        placeholder="文章标题"
        class="title-input"
      />
      <div class="toolbar-row">
        <div class="field-group">
          <input v-model="localCategory" type="text" placeholder="分类" class="field-input" />
          <input v-model="localTags" type="text" placeholder="标签（逗号分隔）" class="field-input" />
          <select v-model="localStatus" class="field-input">
            <option value="draft">草稿</option>
            <option value="published">发布</option>
          </select>
        </div>
        <div class="toolbar-actions">
          <button class="btn-preview" @click="preview = !preview">
            {{ preview ? '编辑' : '预览' }}
          </button>
          <button class="btn-save" @click="handleSave" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button class="btn-cancel" @click="emit('cancel')">取消</button>
        </div>
      </div>
    </div>

    <div class="editor-body">
      <textarea
        v-if="!preview"
        v-model="localContent"
        class="content-textarea"
        placeholder="Markdown 内容..."
      />
      <div v-else class="preview-pane markdown-body" v-html="previewHtml" />
    </div>
  </div>
</template>

<style scoped>
.editor {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius);
  overflow: hidden;
}

.editor-toolbar {
  padding: 16px;
  border-bottom: 1px solid var(--vp-c-border);
}

.title-input {
  width: 100%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-family: inherit;
  margin-bottom: 10px;
  outline: none;
}

.title-input:focus {
  border-color: var(--vp-c-brand);
}

.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.field-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.field-input {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-family: inherit;
  outline: none;
}

.field-input:focus {
  border-color: var(--vp-c-brand);
}

select.field-input {
  cursor: pointer;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.btn-preview {
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-preview:hover { background: var(--vp-c-border); }

.btn-save {
  background: var(--vp-c-green);
  border: none;
  color: #fff;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-save:hover { filter: brightness(1.1); }
.btn-save:disabled { opacity: 0.6; cursor: default; }

.btn-cancel {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: color 0.2s;
}

.btn-cancel:hover { color: var(--vp-c-text-1); }

.editor-body {
  display: flex;
}

.content-textarea {
  width: 100%;
  min-height: 400px;
  background: var(--vp-c-bg);
  border: none;
  padding: 16px;
  color: var(--vp-c-text-1);
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.preview-pane {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  color: var(--vp-c-text-1);
}
</style>
