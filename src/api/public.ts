import type { Post, PostListResponse } from '../types/post'

const BASE = '/api'

export async function fetchPosts(params?: {
  page?: number
  size?: number
  tag?: string
  category?: string
  q?: string
}): Promise<PostListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.size) sp.set('size', String(params.size))
  if (params?.tag) sp.set('tag', params.tag)
  if (params?.category) sp.set('category', params.category)
  if (params?.q) sp.set('q', params.q)
  const qs = sp.toString()
  const url = qs ? `${BASE}/posts?${qs}` : `${BASE}/posts`
  const res = await fetch(url)
  if (!res.ok) throw new Error(res.status === 429 ? '请求过于频繁，请稍候' : `请求失败: ${res.status}`)
  return res.json()
}

export async function fetchPost(id: string): Promise<Post> {
  const res = await fetch(`${BASE}/posts/${id}`)
  if (!res.ok) throw new Error(`文章不存在`)
  return res.json()
}

export async function verifyPost(id: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/posts/${id}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    if (res.status === 403) throw new Error('密码错误')
    throw new Error('解密失败')
  }
  const data = await res.json()
  return data.content
}

export async function fetchTags(): Promise<string[]> {
  const res = await fetch(`${BASE}/tags`)
  if (!res.ok) throw new Error(`获取标签失败`)
  const data = await res.json()
  return data.tags
}

export async function fetchHealth(): Promise<{ status: string; db: string }> {
  const res = await fetch(`${BASE}/health`)
  return res.json()
}
