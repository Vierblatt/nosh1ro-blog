export interface Post {
  id: string
  date: string
  title: string
  content?: string
  content_html?: string
  summary?: string
  tags?: string[]
  category?: string
  status?: string
  encrypted?: boolean
  encryption?: { salt: string; nonce: string; ciphertext: string }
  created_at?: string
  updated_at?: string
}

export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  size: number
}

export interface BlogSettings {
  title: string
  subtitle: string
}

export interface LoginResponse {
  token: string
}
