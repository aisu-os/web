import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import {
  createSettingsStore,
  SettingsStoreContext,
} from './hooks/use-settings-store'
import SettingsSidebar from './components/SettingsSidebar'
import SettingsContent from './components/SettingsContent'

const SettingsInner = () => {
  return (
    <div
      className={cn(
        'flex flex-col h-full w-full',
        'bg-[#1E1E2E] text-white',
        'rounded-b-lg overflow-hidden select-none'
      )}
    >
      <div className="flex flex-1 overflow-hidden">
        <SettingsSidebar />
        <SettingsContent />
      </div>
    </div>
  )
}

const Settings = () => {
  const store = useMemo(() => createSettingsStore(), [])

  return (
    <SettingsStoreContext.Provider value={store}>
      <SettingsInner />
    </SettingsStoreContext.Provider>
  )
}

export default Settings
