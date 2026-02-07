export interface BatteryManager extends EventTarget {
  readonly charging: boolean
  readonly chargingTime: number
  readonly dischargingTime: number
  readonly level: number
  onchargingchange: ((this: BatteryManager, ev: Event) => void) | null
  onchargingtimechange: ((this: BatteryManager, ev: Event) => void) | null
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => void) | null
  onlevelchange: ((this: BatteryManager, ev: Event) => void) | null
}

export interface BatteryState {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  isSupported: boolean
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>
  }
}
