import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Z_INDEX } from '@/lib/constants'
import { openFile } from '@/lib/open-file'
import { useDesktopStore } from '@/stores/use-desktop-store'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useGetInfoStore } from '@/stores/use-get-info-store'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useMenuPosition } from '@/hooks/use-menu-position'
import {
  DESKTOP_CONTEXT_MENU_ITEMS,
  ITEM_CONTEXT_MENU_ITEMS,
} from './desktop.constants'

const ContextMenu = () => {
  const contextMenu = useDesktopStore((s) => s.contextMenu)
  const closeContextMenu = useDesktopStore((s) => s.closeContextMenu)
  const selectAll = useDesktopStore((s) => s.selectAll)
  const startCreating = useDesktopStore((s) => s.startCreating)
  const startRenaming = useDesktopStore((s) => s.startRenaming)
  const items = useDesktopStore((s) => s.items)
  const openGetInfo = useGetInfoStore((s) => s.open)
  const menuRef = useRef<HTMLDivElement>(null)
  const adjustedPosition = useMenuPosition(menuRef, contextMenu.isOpen, contextMenu.position)

  useClickOutside(menuRef, closeContextMenu, { enabled: contextMenu.isOpen, onContextMenu: true, onEscape: true })

  const handleAction = useCallback((action?: string) => {
    if (!action) return
    const targetItemId = contextMenu.targetItemId
    closeContextMenu()

    switch (action) {
      case 'desktop:select-all':
        selectAll()
        break
      case 'desktop:new-folder':
        startCreating('directory')
        break
      case 'desktop:new-file':
        startCreating('file')
        break
      case 'item:open': {
        if (targetItemId) {
          const item = items.find((i) => i.id === targetItemId)
          if (item) {
            openFile(item.fsPath)
          }
        }
        break
      }
      case 'item:rename':
        if (targetItemId) startRenaming(targetItemId)
        break
      case 'item:get-info': {
        if (targetItemId) {
          const item = items.find((i) => i.id === targetItemId)
          if (item) {
            openGetInfo(item.fsPath)
          }
        }
        break
      }
      case 'item:delete': {
        if (targetItemId) {
          const item = items.find((i) => i.id === targetItemId)
          if (item) {
            const fs = useFileSystemStore.getState()
            fs.deleteNode(item.fsPath)
            useDesktopStore.getState().removeItem(targetItemId)
          }
        }
        break
      }
      case 'item:duplicate': {
        if (targetItemId) {
          const item = items.find((i) => i.id === targetItemId)
          if (item) {
            const fs = useFileSystemStore.getState()
            const result = fs.copyNode(item.fsPath, '/Desktop')
            if (result) {
              const desktop = useDesktopStore.getState()
              desktop.addItemFromFileSystem(result.newPath, desktop.getFreePosition())
            }
          }
        }
        break
      }
    }
  }, [contextMenu.targetItemId, closeContextMenu, selectAll, startCreating, startRenaming, items, openGetInfo])

  const menuItems = contextMenu.targetItemId
    ? ITEM_CONTEXT_MENU_ITEMS
    : DESKTOP_CONTEXT_MENU_ITEMS

  return (
    <AnimatePresence>
      {contextMenu.isOpen && (
        <motion.div
          ref={menuRef}
          className={cn(
            'fixed',
            'min-w-[220px] w-max',
            'py-1 px-[3px]',
            'rounded-lg',
            'bg-black/30 backdrop-blur-2xl backdrop-saturate-150',
            'shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
            'ring-1 ring-inset ring-white/10',
            'select-none',
          )}
          style={{
            left: adjustedPosition.x,
            top: adjustedPosition.y,
            zIndex: Z_INDEX.contextMenu,
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.1 }}
        >
          {menuItems.map((item, index) =>
            item.separator ? (
              <div key={`sep-${index}`} className="mx-2 my-1 h-px bg-white/10" />
            ) : (
              <button
                key={item.label}
                disabled={item.disabled}
                onClick={() => handleAction(item.action)}
                className={cn(
                  'flex w-full items-center justify-between rounded px-3 py-[3px] text-[13px]',
                  'text-left tracking-wide outline-none',
                  'transition-none',
                  item.disabled
                    ? 'cursor-default text-white/30'
                    : 'cursor-default text-white/90 hover:bg-[#2463EB] hover:text-white',
                )}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className={cn(
                    'ml-6 text-[12px]',
                    item.disabled ? 'text-white/20' : 'text-white/50',
                  )}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContextMenu
