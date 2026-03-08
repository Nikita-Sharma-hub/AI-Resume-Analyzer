import { apiClient, normalizeApiError } from './apiClient.jsx'

export async function login({ email, password }) {
  try {
    const res = await apiClient.post('/auth/login', { email, password })


    localStorage.setItem("auth", JSON.stringify(res.data))

    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function register({ name, email, password, role }) {
  try {
    const res = await apiClient.post('/auth/register', { name, email, password, role })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}