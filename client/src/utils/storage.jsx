export const STORAGE_KEYS = {
  auth: 'airesumematch.auth',
  theme: 'airesumematch.theme',
}

export function safeJsonParse(value, fallback) {
  try {
    if (value == null) return fallback
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function readStorageJson(key, fallback = null) {
  if (typeof window === 'undefined') return fallback
  return safeJsonParse(window.localStorage.getItem(key), fallback)
}

export function writeStorageJson(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key)
}

