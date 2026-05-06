import axios from 'axios'
import { readStorageJson, STORAGE_KEYS } from '../utils/storage.jsx'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
})

apiClient.interceptors.request.use((config) => {
  const auth = readStorageJson(STORAGE_KEYS.auth, null)
  const token = auth?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function normalizeApiError(err) {
  // Check if response is HTML (error page) instead of JSON
  const isHtmlResponse = err?.response?.data &&
    typeof err.response.data === 'string' &&
    err.response.data.includes('<!doctype')

  const message = isHtmlResponse
    ? 'Server returned HTML response instead of JSON'
    : err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'Request failed'

  const status = err?.response?.status
  return { message, status, raw: err }
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
