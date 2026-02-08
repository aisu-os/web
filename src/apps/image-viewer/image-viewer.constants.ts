export const MOCK_IMAGE_URLS: Record<string, string> = {
  '/Desktop/screenshot.png': 'https://picsum.photos/seed/screenshot/1920/1080',
  '/Pictures/Wallpapers/mountain.jpg': 'https://picsum.photos/seed/mountain/3840/2160',
  '/Pictures/Wallpapers/ocean.jpg': 'https://picsum.photos/seed/ocean/3840/2160',
  '/Pictures/Wallpapers/aurora.png': 'https://picsum.photos/seed/aurora/3840/2160',
  '/Pictures/Screenshots/Screen Shot 2025-05-01.png': 'https://picsum.photos/seed/screen01/1920/1080',
  '/Pictures/avatar.png': 'https://picsum.photos/seed/avatar/512/512',
}

export const FALLBACK_IMAGE_URL = 'https://picsum.photos/seed/fallback/800/600'

export const MOCK_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '/Desktop/screenshot.png': { width: 1920, height: 1080 },
  '/Pictures/Wallpapers/mountain.jpg': { width: 3840, height: 2160 },
  '/Pictures/Wallpapers/ocean.jpg': { width: 3840, height: 2160 },
  '/Pictures/Wallpapers/aurora.png': { width: 3840, height: 2160 },
  '/Pictures/Screenshots/Screen Shot 2025-05-01.png': { width: 1920, height: 1080 },
  '/Pictures/avatar.png': { width: 512, height: 512 },
}

export const ZOOM_MIN = 0.1
export const ZOOM_MAX = 10
export const ZOOM_STEP = 0.25
