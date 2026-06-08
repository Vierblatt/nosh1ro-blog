import { marked } from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
  breaks: true,
  gfm: true,
})

const renderer = new marked.Renderer()

renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
    } catch {
      // fall through
    }
  }
  if (lang) {
    return `<pre><code class="hljs language-${lang}">${escapeHtml(text)}</code></pre>`
  }
  return `<pre><code>${escapeHtml(text)}</code></pre>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function parseMarkdown(md: string): string {
  return marked.parse(md, { renderer }) as string
}
