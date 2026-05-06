import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { login as loginApi, register as registerApi } from '../services/authService.jsx'
import {
  readStorageJson,
  removeStorage,
  STORAGE_KEYS,
  writeStorageJson,
} from '../utils/storage.jsx'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStorageJson(STORAGE_KEYS.auth, null))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!auth) return
    writeStorageJson(STORAGE_KEYS.auth, auth)
  }, [auth])

  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [auth])

  const logout = useCallback(() => {
    setAuth(null)
    removeStorage(STORAGE_KEYS.auth)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setBusy(true)
    setError(null)
    try {
      const data = await loginApi({ email, password })
      writeStorageJson(STORAGE_KEYS.auth, { token: data.token, user: data.user })
      setAuth({ token: data.token, user: data.user })
      return data.user
    } catch (e) {
      setError(e?.message || 'Login failed')
      throw e
    } finally {
      setBusy(false)
    }
  }, [])

  const register = useCallback(async ({ name, email, password, role }) => {
    setBusy(true)
    setError(null)
    try {
      const data = await registerApi({ name, email, password, role })
      setAuth({ token: data.token, user: data.user })
      return data.user
    } catch (e) {
      setError(e?.message || 'Registration failed')
      throw e
    } finally {
      setBusy(false)
    }
  }, [])

  const updateUser = useCallback(async (profileData) => {
    setBusy(true)
    setError(null)
    try {
      // Update user in local state first
      const updatedUser = { ...auth?.user, ...profileData }
      setAuth({ ...auth, user: updatedUser })
      return updatedUser
    } catch (e) {
      setError(e?.message || 'Profile update failed')
      throw e
    } finally {
      setBusy(false)
    }
  }, [auth])

  const value = useMemo(() => {
    const user = auth?.user || null
    const token = auth?.token || null
    const isAuthenticated = Boolean(user && token)
    const hasRole = (roles) => {
      if (!user) return false
      if (!roles?.length) return true
      return roles.includes(user.role)
    }
    return {
      user,
      token,
      isAuthenticated,
      busy,
      error,
      login,
      register,
      logout,
      updateUser,
      hasRole,
    }
  }, [auth, busy, error, login, logout, register])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }

