import { apiClient, normalizeApiError } from './apiClient.jsx'

export async function getUserProfile() {
  try {
    const res = await apiClient.get('/user/profile')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function updateUserProfile(profileData) {
  try {
    const res = await apiClient.put('/user/profile', profileData)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function updatePassword(passwordData) {
  try {
    const res = await apiClient.put('/user/password', passwordData)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function updateSettings(settings) {
  try {
    const res = await apiClient.put('/user/settings', settings)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getSettings() {
  try {
    const res = await apiClient.get('/user/settings')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function deleteAccount() {
  try {
    const res = await apiClient.delete('/user/account')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function uploadAvatar(file) {
  try {
    const form = new FormData()
    form.append('avatar', file)
    
    const res = await apiClient.post('/user/avatar', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}
