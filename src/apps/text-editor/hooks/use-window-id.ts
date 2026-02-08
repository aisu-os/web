import { createContext, useContext } from 'react'

export const WindowIdContext = createContext<string>('')

export function useWindowId() {
  return useContext(WindowIdContext)
}
