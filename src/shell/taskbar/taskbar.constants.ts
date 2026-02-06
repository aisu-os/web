import type { AppMenuBarConfig, AppMenu } from '@/types'

export const SYSTEM_BRAND_MENU: AppMenu = {
  label: '__brand__',
  items: [
    { label: 'About aisu', action: 'system:about' },
    { label: '', separator: true },
    { label: 'System Preferences...', action: 'system:preferences' },
    { label: 'App Market...', action: 'system:app-market' },
    { label: '', separator: true },
    { label: 'Recent Items', action: 'system:recent-items', disabled: true },
    { label: '', separator: true },
    { label: 'Force Quit...', shortcut: '⌥⌘Esc', action: 'system:force-quit' },
    { label: '', separator: true },
    { label: 'Sleep', action: 'system:sleep' },
    { label: 'Restart...', action: 'system:restart' },
    { label: 'Shut Down...', action: 'system:shutdown' },
    { label: '', separator: true },
    { label: 'Lock Screen', shortcut: '⌃⌘Q', action: 'system:lock' },
    { label: 'Log Out...', shortcut: '⇧⌘Q', action: 'system:logout' },
  ],
}

export const DEFAULT_SYSTEM_MENUS: AppMenuBarConfig = {
  menus: [
    {
      label: 'File',
      items: [
        { label: 'New Window', shortcut: '⌘N' },
        { label: 'New Folder', shortcut: '⇧⌘N' },
        { label: '', separator: true },
        { label: 'Open', shortcut: '⌘O', disabled: true },
        { label: 'Close Window', shortcut: '⌘W', disabled: true },
        { label: '', separator: true },
        { label: 'Get Info', shortcut: '⌘I' },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', disabled: true },
        { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
        { label: '', separator: true },
        { label: 'Cut', shortcut: '⌘X', disabled: true },
        { label: 'Copy', shortcut: '⌘C', disabled: true },
        { label: 'Paste', shortcut: '⌘V', disabled: true },
        { label: 'Select All', shortcut: '⌘A', disabled: true },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'As Icons', disabled: true },
        { label: 'As List', disabled: true },
        { label: '', separator: true },
        { label: 'Show Sidebar' },
        { label: 'Show Preview' },
        { label: '', separator: true },
        { label: 'Enter Full Screen' },
      ],
    },
    {
      label: 'Window',
      items: [
        { label: 'Minimize', shortcut: '⌘M', disabled: true },
        { label: 'Zoom', disabled: true },
        { label: '', separator: true },
        { label: 'Bring All to Front' },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'aisu Help' },
        { label: '', separator: true },
        { label: 'Send Feedback' },
      ],
    },
  ],
}

export const DEFAULT_APP_NAME = 'aisu'
