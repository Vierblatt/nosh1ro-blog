<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '../types/post'
import { listPosts, createPost, updatePost, deletePost as apiDeletePost, logout } from '../api/admin'
import PostEditor from '../components/PostEditor.vue'

const route = useRoute()
const router = useRouter()

const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref('')
const deleting = ref<string | null>(null)

const editId = computed(() => route.params.id as string | undefined)
const isNew = computed(() => route.name === 'admin-post-new')
const isEdit = computed(() => route.name === 'admin-post-edit')
const isList = computed(() => route.name === 'admin-dashboard')

const currentPost = computed(() => {
  if (isNew.value) {
    return { title: '', content: '', category: '', tags: '', status: 'draft' as const }
  }
  const p = posts.value.find(p => p.id === editId.value)
  return {
    title: p?.title || '',
    content: p?.content || '',
    category: p?.category || '',
    tags: p?.tags?.join(', ') || '',
    status: p?.status || 'draft',
  }
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await listPosts()
    posts.value = data.posts
  } catch {
    error.value = '加载文章列表失败'
  } finally {
    loading.value = false
  }
}

async function handleSave(data: { title: string; content: string; category: string; tags: string[]; status: string }) {
  try {
    if (isNew.value) {
      await createPost({
        id: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        title: data.title,
        content: data.content,
        category: data.category || undefined,
        status: data.status as 'draft' | 'published',
        tags: data.tags.length ? data.tags : undefined,
      })
    } else if (isEdit.value && editId.value) {
      await updatePost(editId.value, {
        title: data.title,
        content: data.content,
        category: data.category || undefined,
        status: data.status,
        tags: data.tags.length ? data.tags : undefined,
      })
    }
    router.push('/admin')
    load()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '保存失败'
  }
}

const deleteTarget = ref<string | null>(null)

function requestDelete(id: string) {
  deleteTarget.value = id
}

async function confirmDelete() {
  const id = deleteTarget.value
  if (!id) return
  deleting.value = id
  deleteTarget.value = null
  try {
    await apiDeletePost(id)
    posts.value = posts.value.filter(p => p.id !== id)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '删除失败'
  } finally {
    deleting.value = null
  }
}

function handleCancel() {
  router.push('/admin')
}

onMounted(load)
</script>

<template>
  <div class="dashboard">
    <div class="dash-header">
      <h1>文章管理</h1>
      <div class="dash-header-actions">
        <router-link to="/admin/settings" class="btn-settings">设置</router-link>
        <router-link to="/admin/posts/new" class="btn-new">+ 新建文章</router-link>
        <button class="btn-logout" @click="logout">退出登录</button>
      </div>
    </div>

    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="error" class="status-msg status-err">{{ error }}</div>

    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal-box">
        <p>确定删除这篇文章？</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="deleteTarget = null">取消</button>
          <button class="btn-confirm-delete" @click="confirmDelete">删除</button>
        </div>
      </div>
    </div>

    <!-- Editor Mode -->
    <template v-if="!loading && (isNew || isEdit)">
      <PostEditor
        :title="currentPost.title"
        :content="currentPost.content"
        :category="currentPost.category"
        :tags="currentPost.tags"
        :status="currentPost.status"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </template>

    <!-- List Mode -->
    <template v-else-if="isList">
      <table class="post-table" v-if="posts.length">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>状态</th>
            <th>日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td class="col-title">
              {{ post.encrypted ? '🔒 ' : '' }}{{ post.title }}
            </td>
            <td class="col-cat">{{ post.category || '-' }}</td>
            <td>
              <span class="status-badge" :class="post.status">
                {{ post.status === 'published' ? '已发布' : '草稿' }}
              </span>
            </td>
            <td class="col-date">{{ post.date }}</td>
            <td class="col-actions">
              <router-link :to="`/admin/posts/${post.id}/edit`" class="btn-edit">编辑</router-link>
              <button
                class="btn-delete"
                :disabled="deleting === post.id"
                @click="requestDelete(post.id)"
              >
                {{ deleting === post.id ? '...' : '删除' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="status-msg">暂无文章</div>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px 0;
}

.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dash-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dash-header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-new {
  background: var(--vp-c-green);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-new:hover { filter: brightness(1.1); }

.btn-settings {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  border: 1px solid var(--vp-c-border);
  transition: background 0.2s;
}

.btn-settings:hover { background: var(--vp-c-bg-mute); }

.btn-logout {
  background: none;
  border: 1px solid var(--vp-c-red);
  color: var(--vp-c-red);
  padding: 7px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-logout:hover { background: var(--vp-c-red-soft); }

.status-msg {
  text-align: center;
  padding: 48px 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
}

/* Table */
.post-table {
  width: 100%;
  border-collapse: collapse;
}

.post-table th {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
}

.post-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.col-title {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-badge.published {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green);
}

.status-badge.draft {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow);
}

.col-actions {
  white-space: nowrap;
}

.btn-edit {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-size: 13px;
  margin-right: 12px;
}

.btn-edit:hover { text-decoration: underline; }

.btn-delete {
  background: none;
  border: none;
  color: var(--vp-c-red);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  font-family: inherit;
}

.btn-delete:hover { text-decoration: underline; }
.btn-delete:disabled { opacity: 0.4; cursor: default; }

.status-err { color: var(--vp-c-red); }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 24px;
  min-width: 300px;
  text-align: center;
}

.modal-box p {
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  font-size: 15px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
}

.btn-cancel:hover { background: var(--vp-c-bg); }

.btn-confirm-delete {
  background: var(--vp-c-red);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
}

.btn-confirm-delete:hover { filter: brightness(1.15); }
</style>
