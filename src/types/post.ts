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

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirm_password: string
}

export interface RegisterResponse {
  message: string
}

export interface VerifyResponse {
  message: string
}

export interface ResendRequest {
  email: string
}

export interface SearchRequest {
  q?: string
  category?: string
  tag?: string
  page?: number
  size?: number
}

export interface SearchResult {
  posts: SearchHit[]
  total: number
  aggregations: {
    categories: AggBucket[]
    tags: AggBucket[]
  }
}

export interface SearchHit {
  id: string
  title: string
  summary: string
  date: string
  category: string
  tags: string[]
  highlights?: {
    title?: string[]
    content?: string[]
  }
}

export interface AggBucket {
  key: string
  count: number
}
