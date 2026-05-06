import { apiClient, normalizeApiError } from './apiClient.jsx'

export async function getJobs(filters = {}) {
  try {
    const res = await apiClient.get('/job', { params: filters })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getJobById(jobId) {
  try {
    const res = await apiClient.get(`/job/${jobId}`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function searchJobs(query, filters = {}) {
  try {
    const res = await apiClient.get('/job/search', { 
      params: { q: query, ...filters }
    })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getJobRecommendations() {
  try {
    const res = await apiClient.get('/job/recommendations')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function saveJob(jobId) {
  try {
    const res = await apiClient.post(`/job/${jobId}/save`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function unsaveJob(jobId) {
  try {
    const res = await apiClient.delete(`/job/${jobId}/save`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getSavedJobs() {
  try {
    const res = await apiClient.get('/job/saved')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getSimilarJobs(jobId) {
  try {
    const res = await apiClient.get(`/job/${jobId}/similar`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function reportJob(jobId, reason) {
  try {
    const res = await apiClient.post(`/job/${jobId}/report`, { reason })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}
