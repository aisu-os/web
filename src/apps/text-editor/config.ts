import { createAppConfig } from '../_app-config'

export const textEditorConfig = createAppConfig({
  id: 'text-editor',
  title: 'Text Editor',
  icon: 'text-editor',
  window: {
    defaultWidth: 760,
    defaultHeight: 520,
    minWidth: 480,
    minHeight: 320,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
  menuBar: {
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New', shortcut: '⌘N', action: 'file:new' },
          { label: '', separator: true },
          { label: 'Save', shortcut: '⌘S', action: 'file:save' },
          { label: 'Save As...', shortcut: '⇧⌘S', action: 'file:save-as' },
          { label: '', separator: true },
          { label: 'Close Window', shortcut: '⌘W' },
        ],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Undo', shortcut: '⌘Z' },
          { label: 'Redo', shortcut: '⇧⌘Z' },
          { label: '', separator: true },
          { label: 'Cut', shortcut: '⌘X' },
          { label: 'Copy', shortcut: '⌘C' },
          { label: 'Paste', shortcut: '⌘V' },
          { label: 'Select All', shortcut: '⌘A' },
          { label: '', separator: true },
          { label: 'Find', shortcut: '⌘F', action: 'edit:find' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Toggle Word Wrap', shortcut: '⌥Z', action: 'view:word-wrap' },
        ],
      },
    ],
  },
})
