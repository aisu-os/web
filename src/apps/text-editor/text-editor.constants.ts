/**
 * Mock fayl kontentlari.
 * FileNode da kontent saqlanmagani uchun, bu yerda
 * fayl yo'li bo'yicha mock matn saqlanadi.
 */
export const MOCK_FILE_CONTENTS: Record<string, string> = {
  '/Desktop/notes.txt': `Meeting agenda for tomorrow:
- Review Q2 progress
- Discuss new feature roadmap
- Assign tasks for sprint 12

Don't forget to:
1. Update the design docs
2. Send weekly report
3. Book conference room`,

  '/Desktop/Projects/aiso-web/README.md': `# Aiso Web

A browser-based macOS-style Web OS with AI as the central brain.

## Getting Started

\`\`\`bash
bun install
bun dev
\`\`\`

## Tech Stack

- React 19 + TypeScript
- Vite 7 + SWC
- Tailwind CSS 4
- Zustand (state management)
- Framer Motion (animations)

## Project Structure

- \`src/shell/\` — OS shell (desktop, taskbar, dock, window)
- \`src/apps/\` — System applications
- \`src/stores/\` — Zustand stores
- \`src/types/\` — Global TypeScript types`,

  '/Desktop/Projects/aiso-web/src/App.tsx': `import { useAuthStore } from '@/stores/use-auth-store'
import BootScreen from '@/shell/boot/BootScreen'
import LoginScreen from '@/shell/login/LoginScreen'
import Desktop from '@/shell/desktop/Desktop'

function App() {
  const phase = useAuthStore((s) => s.phase)

  switch (phase) {
    case 'boot':
      return <BootScreen />
    case 'login':
      return <LoginScreen />
    case 'authenticated':
      return <Desktop />
  }
}

export default App`,

  '/Desktop/Projects/aiso-web/src/index.css': `@import 'tailwindcss';

:root {
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  margin: 0;
  overflow: hidden;
}`,

  '/Documents/Meeting Notes/Q1 Review.md': `# Q1 2025 Review

## Highlights
- Launched v2.0 of the platform
- 40% increase in user engagement
- Successfully migrated to new infrastructure

## Areas for Improvement
- Onboarding flow needs optimization
- Mobile responsiveness issues
- Documentation is outdated

## Action Items
- [ ] Update onboarding flow by April 15
- [ ] Fix responsive design issues
- [ ] Refresh developer documentation
- [ ] Schedule design review for Q2`,

  '/Documents/Meeting Notes/Q2 Planning.md': `# Q2 2025 Planning

## Goals
1. Improve performance by 30%
2. Launch AI assistant feature
3. Expand to 3 new markets

## Timeline
- April: Performance optimization sprint
- May: AI assistant beta
- June: Market expansion

## Resources
- 2 new engineers joining
- Design contractor for UI refresh
- Budget approved for cloud scaling`,

  '/Desktop/Projects/notes-app/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notes App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <header>
      <h1>My Notes</h1>
    </header>
    <main id="notes-container"></main>
  </div>
  <script src="app.js"></script>
</body>
</html>`,

  '/Desktop/Projects/notes-app/style.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f7;
  color: #1d1d1f;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}

#notes-container {
  display: grid;
  gap: 16px;
}`,
}

export const DEFAULT_CONTENT = ''

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
