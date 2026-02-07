import type { CursorTheme, CursorThemeMeta } from '@/types'

const STORAGE_KEY = 'aiso-cursor-theme'

export interface CursorThemeLoader {
  listThemes(): Promise<CursorThemeMeta[]>
  loadTheme(themeId: string): Promise<CursorTheme>
  getSavedThemeId(): string | null
  saveThemeId(themeId: string): void
}

export class LocalCursorThemeLoader implements CursorThemeLoader {
  async listThemes(): Promise<CursorThemeMeta[]> {
    return [
      {
        id: 'macos-default',
        name: 'macOS Default',
        author: 'AISO',
        version: '1.0.0',
        thumbnail: '',
        description: 'Classic macOS-inspired cursors',
        downloadUrl: '',
        price: 'free',
        downloads: 0,
        rating: 5,
      },
    ]
  }

  async loadTheme(themeId: string): Promise<CursorTheme> {
    switch (themeId) {
      case 'macos-default':
      default: {
        const { macosDefaultTheme } = await import('./macos-default')
        return macosDefaultTheme
      }
    }
  }

  getSavedThemeId(): string | null {
    return localStorage.getItem(STORAGE_KEY)
  }

  saveThemeId(themeId: string): void {
    localStorage.setItem(STORAGE_KEY, themeId)
  }
}
