/**
 * Fayl kengaytmasidan tilni aniqlash
 */
export function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript JSX',
    js: 'JavaScript',
    jsx: 'JavaScript JSX',
    json: 'JSON',
    md: 'Markdown',
    txt: 'Plain Text',
    html: 'HTML',
    css: 'CSS',
    py: 'Python',
    rs: 'Rust',
    go: 'Go',
    yaml: 'YAML',
    yml: 'YAML',
    xml: 'XML',
    sh: 'Shell',
    bash: 'Shell',
    sql: 'SQL',
  }
  return map[ext] ?? 'Plain Text'
}
