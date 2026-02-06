import { useState, useEffect, useRef } from 'react'
import {
  BOOT_STATUS_MESSAGES,
  BOOT_TIMING,
} from '@/shell/boot/boot.constants'

interface UseBootOptions {
  duration?: number
  onComplete?: () => void
}

interface UseBootReturn {
  isVisible: boolean
  isFadingOut: boolean
  statusText: string
  isStatusFading: boolean
}

export function useBoot(options: UseBootOptions = {}): UseBootReturn {
  const {
    duration = BOOT_TIMING.totalDuration,
    onComplete,
  } = options

  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const [isStatusFading, setIsStatusFading] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, duration)

    const removeTimer = setTimeout(() => {
      setIsVisible(false)
      onCompleteRef.current?.()
    }, duration + BOOT_TIMING.fadeOutDuration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [duration])

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout>

    const interval = setInterval(() => {
      setIsStatusFading(true)
      fadeTimeout = setTimeout(() => {
        setStatusIndex((prev) => (prev + 1) % BOOT_STATUS_MESSAGES.length)
        setIsStatusFading(false)
      }, BOOT_TIMING.statusFadeDuration)
    }, BOOT_TIMING.statusRotationInterval)

    return () => {
      clearInterval(interval)
      clearTimeout(fadeTimeout)
    }
  }, [])

  return {
    isVisible,
    isFadingOut,
    statusText: BOOT_STATUS_MESSAGES[statusIndex],
    isStatusFading,
  }
}
