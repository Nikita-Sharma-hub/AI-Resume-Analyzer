import React, { createContext, useEffect, useMemo, useState } from 'react'
import { readStorageJson, STORAGE_KEYS, writeStorageJson } from '../utils/storage.jsx'

const ThemeContext = createContext(null)

// K Acc Rakho Theme Colors
const kAccRakhoTheme = {
  name: 'k-acc-rakho',
  colors: {
    primary: {
      50: '#fef2f2',
      100: '#fef3c7',
      500: '#f87171',
      600: '#fbbf24',
      700: '#f59e0b',
      800: '#dc2626',
      900: '#a21caf'
    },
    secondary: {
      50: '#f3e5f5',
      100: '#e5e7eb',
      500: '#d4d4d4',
      600: '#9ca3af',
      700: '#6b7280',
      800: '#4b5563',
      900: '#1e2937'
    },
    accent: {
      50: '#fbbf24',
      100: '#f59e0b',
      500: '#f97316',
      600: '#ea580c',
      700: '#dc2626',
      800: '#a21caf',
      900: '#a21caf'
    },
    neutral: {
      50: '#fef2f2',
      100: '#fef3c7',
      500: '#f87171',
      600: '#fbbf24',
      700: '#f59e0b',
      800: '#dc2626',
      900: '#a21caf'
    },
    background: '#ffffff',
    surface: '#ffffff',
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
      muted: '#6b7280'
    },
    border: {
      default: '#e5e7eb',
      focus: '#fbbf24'
    },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07)',
      lg: '0 10px 25px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0.15)'
    },
    glass: {
      background: 'rgba(254, 251, 251, 0.1)',
      border: 'rgba(254, 251, 251, 0.2)'
    }
  }
}

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

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'k-acc-rakho')

    // Apply theme based on selection
    if (theme === 'k-acc-rakho') {
      root.classList.add('k-acc-rakho')
      // Apply K Acc Rakho CSS variables
      Object.entries(kAccRakhoTheme.colors).forEach(([category, colors]) => {
        if (typeof colors === 'object') {
          Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--k-acc-${category}-${key}`, value)
          })
        } else {
          root.style.setProperty(`--k-acc-${category}`, colors)
        }
      })
    } else {
      root.classList.add(resolvedTheme)
    }
  }, [resolvedTheme, theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggle: () => setTheme((t) => {
        if (t === 'dark') return 'light'
        if (t === 'light') return 'k-acc-rakho'
        if (t === 'k-acc-rakho') return 'dark'
        return 'light'
      }),
    }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeContext }

