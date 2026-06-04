import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export function parseMarkdown(md: string): string {
  return marked.parse(md) as string
}
