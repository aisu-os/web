import { useRef, useCallback, useEffect } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'

const THEME = {
  background: '#1E1E2E',
  foreground: '#CDD6F4',
  cursor: '#F5E0DC',
  cursorAccent: '#1E1E2E',
  selectionBackground: '#585B70',
  selectionForeground: '#CDD6F4',
  black: '#45475A',
  red: '#F38BA8',
  green: '#A6E3A1',
  yellow: '#F9E2AF',
  blue: '#89B4FA',
  magenta: '#F5C2E7',
  cyan: '#94E2D5',
  white: '#BAC2DE',
  brightBlack: '#585B70',
  brightRed: '#F38BA8',
  brightGreen: '#A6E3A1',
  brightYellow: '#F9E2AF',
  brightBlue: '#89B4FA',
  brightMagenta: '#F5C2E7',
  brightCyan: '#94E2D5',
  brightWhite: '#A6ADC8',
}

const DEFAULT_FONT_SIZE = 13

interface UseTerminalOptions {
  onData?: (data: string) => void
  onResize?: (cols: number, rows: number) => void
}

export function useTerminal({ onData, onResize }: UseTerminalOptions) {
  const terminalRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const onDataRef = useRef(onData)
  const onResizeRef = useRef(onResize)

  // Callback ref larni yangilash (re-render da hook qayta yaratilmasligi uchun)
  onDataRef.current = onData
  onResizeRef.current = onResize

  const init = useCallback((container: HTMLDivElement) => {
    if (terminalRef.current) return

    const terminal = new Terminal({
      theme: THEME,
      fontFamily: '"SF Mono", Menlo, Monaco, "Cascadia Code", "Courier New", monospace',
      fontSize: DEFAULT_FONT_SIZE,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 5000,
      allowProposedApi: true,
      convertEol: true,
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(new WebLinksAddon())

    terminal.open(container)
    fitAddon.fit()

    terminal.onData((data) => {
      onDataRef.current?.(data)
    })

    terminal.onResize(({ cols, rows }) => {
      onResizeRef.current?.(cols, rows)
    })

    terminalRef.current = terminal
    fitAddonRef.current = fitAddon
  }, [])

  const write = useCallback((data: string | Uint8Array) => {
    terminalRef.current?.write(data)
  }, [])

  const fit = useCallback(() => {
    fitAddonRef.current?.fit()
  }, [])

  const clear = useCallback(() => {
    terminalRef.current?.clear()
  }, [])

  const focus = useCallback(() => {
    terminalRef.current?.focus()
  }, [])

  const setFontSize = useCallback(
    (size: number) => {
      if (terminalRef.current) {
        terminalRef.current.options.fontSize = size
        fit()
      }
    },
    [fit],
  )

  const dispose = useCallback(() => {
    terminalRef.current?.dispose()
    terminalRef.current = null
    fitAddonRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      dispose()
    }
  }, [dispose])

  return {
    terminalRef,
    init,
    write,
    fit,
    clear,
    focus,
    setFontSize,
    dispose,
  }
}
