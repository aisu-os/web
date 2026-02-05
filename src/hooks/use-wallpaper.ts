import { useState, useEffect } from 'react'
import { FALLBACK_GRADIENT } from '@/shell/desktop/desktop.constants'

interface UseWallpaperReturn {
  isLoaded: boolean
  backgroundStyle: React.CSSProperties
}

export function useWallpaper(url: string): UseWallpaperReturn {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)

    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setHasError(true)
    img.src = url

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [url])

  const backgroundStyle: React.CSSProperties = hasError
    ? { background: FALLBACK_GRADIENT }
    : {
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }

  return { isLoaded: isLoaded || hasError, backgroundStyle }
}
