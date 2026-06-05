export interface Post {
  id: string
  date: string
  title: string
  content: string
  content_html?: string
  summary?: string
  tags?: string[]
  category?: string
  encrypted?: boolean
  encryption?: {
    salt: string
    nonce: string
    ciphertext: string
  }
}

export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  size: number
}
