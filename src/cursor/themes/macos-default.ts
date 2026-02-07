import type { CursorTheme } from '@/types'

const c = (file: string, hotspot: { x: number; y: number }, animation?: { rotate?: boolean }) => ({
  url: `/cursors/${file}.svg`,
  hotspot,
  width: 32,
  height: 32,
  animation,
})

export const macosDefaultTheme: CursorTheme = {
  id: 'macos-default',
  name: 'macOS Default',
  author: 'AISO',
  version: '1.0.0',
  scale: 1,
  cursors: {
    default:        c('default',     { x: 10, y: 7 }),
    pointer:        c('pointer',     { x: 9, y: 8 }),
    text:           c('text',        { x: 16, y: 16 }),
    grab:           c('grab',        { x: 16, y: 16 }),
    grabbing:       c('grabbing',    { x: 16, y: 16 }),
    'not-allowed':  c('not-allowed', { x: 16, y: 16 }),
    wait:           c('wait',        { x: 16, y: 16 }),
    progress:       c('wait',        { x: 16, y: 16 }),
    crosshair:      c('crosshair',   { x: 16, y: 16 }),
    move:           c('move',        { x: 16, y: 16 }),
    'n-resize':     c('n-resize',    { x: 16, y: 16 }),
    's-resize':     c('n-resize',    { x: 16, y: 16 }),
    'e-resize':     c('e-resize',    { x: 16, y: 16 }),
    'w-resize':     c('e-resize',    { x: 16, y: 16 }),
    'ne-resize':    c('ne-resize',   { x: 16, y: 16 }),
    'sw-resize':    c('ne-resize',   { x: 16, y: 16 }),
    'nw-resize':    c('nw-resize',   { x: 16, y: 16 }),
    'se-resize':    c('nw-resize',   { x: 16, y: 16 }),
    'col-resize':   c('e-resize',    { x: 16, y: 16 }),
    'row-resize':   c('n-resize',    { x: 16, y: 16 }),
    'zoom-in':      c('zoom-in',     { x: 16, y: 16 }),
    'zoom-out':     c('zoom-out',    { x: 16, y: 16 }),
  },
}
