import type { Post, PostListResponse, BlogSettings, LoginResponse, RegisterRequest, RegisterResponse, VerifyResponse, ResendRequest } from '../types/post'

const API_HOST = import.meta.env.PROD ? 'https://api.nosh1ro.top' : ''
const BASE = `${API_HOST}/api/admin`
const AUTH_BASE = `${API_HOST}/api/auth`

function getToken(): string | null {
  return localStorage.getItem('admin_token')
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

async function authedFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, { ...init, headers: { ...authHeaders(), ...init?.headers } })
  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
    throw new Error('登录已过期')
  }
  return res
}

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    if (body.code === 'NOT_VERIFIED') throw new Error('邮箱未验证，请检查邮件')
    throw new Error('用户名或密码错误')
  }
  const data: LoginResponse = await res.json()
  localStorage.setItem('admin_token', data.token)
  return data.token
}

export async function registerUser(req: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.message || '注册失败')
  return body
}

export async function verifyEmail(token: string): Promise<VerifyResponse> {
  const res = await fetch(`${AUTH_BASE}/verify?token=${encodeURIComponent(token)}`)
  const body = await res.json()
  if (!res.ok) throw new Error(body.message || '验证失败')
  return body
}

export async function resendVerification(req: ResendRequest): Promise<RegisterResponse> {
  const res = await fetch(`${AUTH_BASE}/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.message || '发送失败')
  return body
}

export function logout() {
  localStorage.removeItem('admin_token')
  window.location.href = '/admin/login'
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export async function listPosts(): Promise<PostListResponse> {
  const res = await authedFetch(`${BASE}/posts`)
  if (!res.ok) throw new Error('获取文章列表失败')
  return res.json()
}

export async function createPost(post: {
  id: string
  title: string
  content: string
  category?: string
  status?: string
  tags?: string[]
}): Promise<Post> {
  const res = await authedFetch(`${BASE}/posts`, {
    method: 'POST',
    body: JSON.stringify(post),
  })
  if (!res.ok) throw new Error('创建失败')
  return res.json()
}

export async function updatePost(id: string, fields: Record<string, unknown>): Promise<Post> {
  const res = await authedFetch(`${BASE}/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  })
  if (!res.ok) throw new Error('更新失败')
  return res.json()
}

export async function deletePost(id: string): Promise<void> {
  const res = await authedFetch(`${BASE}/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('删除失败')
}

export async function getSettings(): Promise<BlogSettings> {
  const res = await authedFetch(`${BASE}/settings`)
  if (!res.ok) throw new Error('获取设置失败')
  return res.json()
}

export async function updateSettings(fields: Record<string, string>): Promise<BlogSettings> {
  const res = await authedFetch(`${BASE}/settings`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  })
  if (!res.ok) throw new Error('更新设置失败')
  return res.json()
}
