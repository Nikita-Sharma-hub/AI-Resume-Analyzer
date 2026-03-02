import React, { createContext, useEffect, useMemo, useState } from 'react'
import { readStorageJson, STORAGE_KEYS, writeStorageJson } from '../utils/storage.jsx'

const ThemeContext = createContext(null)

function getSystemPref() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStorageJson(STORAGE_KEYS.theme, 'system'))
  const [systemTheme, setSystemTheme] = useState(getSystemPref)

  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setSystemTheme(media.matches ? 'dark' : 'light')
    handler()
    media.addEventListener?.('change', handler)
    return () => media.removeEventListener?.('change', handler)
  }, [])

  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeContext }

