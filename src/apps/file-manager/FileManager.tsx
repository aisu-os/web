import { useMemo, useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { fetchAppSettings } from '@/services/api/settings-service'
import {
  createFileManagerStore,
  FileManagerStoreContext,
  useFileManagerStore,
} from './hooks/use-file-manager-store'
import { WindowIdContext } from './hooks/use-window-id'
import Toolbar from './components/Toolbar'
import Breadcrumb from './components/Breadcrumb'
import Sidebar from './components/Sidebar'
import ContentArea from './components/ContentArea'
import StatusBar from './components/StatusBar'
import FileContextMenu from './components/FileContextMenu'

interface FileManagerProps {
  initialPath?: string
  windowId?: string
}

const FileManagerInner = () => {
  const isSidebarVisible = useFileManagerStore((s) => s.isSidebarVisible)
  const closeContextMenu = useFileManagerStore((s) => s.closeContextMenu)
  const startCreating = useFileManagerStore((s) => s.startCreating)
  const startRenaming = useFileManagerStore((s) => s.startRenaming)
  const selectedPaths = useFileManagerStore((s) => s.selectedPaths)
  const editingPath = useFileManagerStore((s) => s.editingPath)
  const setShowHiddenFiles = useFileManagerStore((s) => s.setShowHiddenFiles)
  const settingsLoaded = useRef(false)

  useEffect(() => {
    if (settingsLoaded.current) return
    settingsLoaded.current = true
    fetchAppSettings('file-manager')
      .then((result) => {
        const setting = result.settings.find((s) => s.key === 'showHiddenFiles')
        if (setting) {
          setShowHiddenFiles(setting.value as boolean)
        }
      })
      .catch(() => {})
  }, [setShowHiddenFiles])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⇧⌘N — New Folder
      if (e.metaKey && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        startCreating('directory')
        return
      }
      // ⌘⌫ — Move to Trash
      if (e.metaKey && e.key === 'Backspace' && selectedPaths.length > 0) {
        e.preventDefault()
        const fs = useFileSystemStore.getState()
        for (const path of selectedPaths) {
          fs.deleteNode(path)
        }
        return
      }
      // Enter — Rename selected item (macOS Finder behavior)
      if (e.key === 'Enter' && selectedPaths.length === 1 && !editingPath) {
        e.preventDefault()
        startRenaming(selectedPaths[0])
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPaths, editingPath, startCreating, startRenaming])

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full',
        'bg-[#1E1E2E] text-white',
        'rounded-b-lg overflow-hidden select-none'
      )}
      onClick={() => closeContextMenu()}
    >
      <Toolbar />
      <Breadcrumb />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && <Sidebar />}
        <ContentArea />
      </div>
      <StatusBar />
      <FileContextMenu />
    </div>
  )
}

const FileManager = ({ initialPath = '/', windowId = '' }: FileManagerProps) => {
  const store = useMemo(() => createFileManagerStore(initialPath, windowId), [])

  return (
    <WindowIdContext.Provider value={windowId}>
      <FileManagerStoreContext.Provider value={store}>
        <FileManagerInner />
      </FileManagerStoreContext.Provider>
    </WindowIdContext.Provider>
  )
}

export default FileManager
