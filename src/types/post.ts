export interface Post {
  id: string
  date: string
  title: string
  content: string // HTML
  encrypted?: boolean
  /** if encrypted, imported from encryption.json */
  encryption?: {
    salt: string
    nonce: string
    ciphertext: string
  }
}
