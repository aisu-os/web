import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import {
  createFileManagerStore,
  FileManagerStoreContext,
  useFileManagerStore,
} from './hooks/use-file-manager-store'
import Toolbar from './components/Toolbar'
import Breadcrumb from './components/Breadcrumb'
import Sidebar from './components/Sidebar'
import ContentArea from './components/ContentArea'
import StatusBar from './components/StatusBar'
import FileContextMenu from './components/FileContextMenu'

interface FileManagerProps {
  initialPath?: string
}

const FileManagerInner = () => {
  const isSidebarVisible = useFileManagerStore((s) => s.isSidebarVisible)
  const closeContextMenu = useFileManagerStore((s) => s.closeContextMenu)

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

const FileManager = ({ initialPath = '/' }: FileManagerProps) => {
  const store = useMemo(() => createFileManagerStore(initialPath), [])

  return (
    <FileManagerStoreContext.Provider value={store}>
      <FileManagerInner />
    </FileManagerStoreContext.Provider>
  )
}

export default FileManager
