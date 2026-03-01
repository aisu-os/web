import { useState, useEffect } from 'react'
import type { BatteryManager, BatteryState } from '@/types'

const DEFAULT_STATE: BatteryState = {
  level: 100,
  charging: false,
  chargingTime: Infinity,
  dischargingTime: Infinity,
  isSupported: false,
}

export function useBattery(): BatteryState {
  const [battery, setBattery] = useState<BatteryState>(DEFAULT_STATE)

  useEffect(() => {
    let batteryManager: BatteryManager | null = null
    let cancelled = false

    const updateState = (bm: BatteryManager) => {
      setBattery({
        level: Math.round(bm.level * 100),
        charging: bm.charging,
        chargingTime: bm.chargingTime,
        dischargingTime: bm.dischargingTime,
        isSupported: true,
      })
    }

    const handleChange = () => {
      if (batteryManager) updateState(batteryManager)
    }

    if (navigator.getBattery) {
      navigator.getBattery().then((bm) => {
        if (cancelled) return
        batteryManager = bm
        updateState(bm)

        bm.addEventListener('levelchange', handleChange)
        bm.addEventListener('chargingchange', handleChange)
        bm.addEventListener('chargingtimechange', handleChange)
        bm.addEventListener('dischargingtimechange', handleChange)
      }).catch(() => {
        // API available but failed — isSupported stays false
      })
    }

    return () => {
      cancelled = true
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', handleChange)
        batteryManager.removeEventListener('chargingchange', handleChange)
        batteryManager.removeEventListener('chargingtimechange', handleChange)
        batteryManager.removeEventListener('dischargingtimechange', handleChange)
      }
    }
  }, [])

  return battery
}
