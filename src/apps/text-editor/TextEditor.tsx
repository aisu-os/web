import { useMemo, useEffect, useCallback } from 'react'
import {
  createTextEditorStore,
  TextEditorStoreContext,
  useTextEditorStore,
} from './hooks/use-text-editor-store'
import { WindowIdContext } from './hooks/use-window-id'
import Toolbar from './components/Toolbar'
import EditorArea from './components/EditorArea'
import StatusBar from './components/StatusBar'
import SaveAsDialog from './components/SaveAsDialog'

const TextEditorInner = () => {
  const save = useTextEditorStore((s) => s.save)
  const newFile = useTextEditorStore((s) => s.newFile)
  const toggleFind = useTextEditorStore((s) => s.toggleFind)
  const toggleWordWrap = useTextEditorStore((s) => s.toggleWordWrap)
  const openSaveAs = useTextEditorStore((s) => s.openSaveAs)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault()
        openSaveAs()
        return
      }
      if (e.metaKey && e.key === 's') {
        e.preventDefault()
        save()
        return
      }
      if (e.metaKey && e.key === 'n') {
        e.preventDefault()
        newFile()
        return
      }
      if (e.metaKey && e.key === 'f') {
        e.preventDefault()
        toggleFind()
        return
      }
      if (e.altKey && e.key === 'z') {
        e.preventDefault()
        toggleWordWrap()
        return
      }
    },
    [save, newFile, toggleFind, toggleWordWrap, openSaveAs]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e]">
      <Toolbar />
      <EditorArea />
      <StatusBar />
      <SaveAsDialog />
    </div>
  )
}

interface TextEditorProps {
  filePath?: string
  windowId?: string
}

const TextEditor = ({ filePath, windowId = '' }: TextEditorProps) => {
  const store = useMemo(() => createTextEditorStore(filePath, windowId), [])

  return (
    <WindowIdContext.Provider value={windowId}>
      <TextEditorStoreContext.Provider value={store}>
        <TextEditorInner />
      </TextEditorStoreContext.Provider>
    </WindowIdContext.Provider>
  )
}

export default TextEditor
