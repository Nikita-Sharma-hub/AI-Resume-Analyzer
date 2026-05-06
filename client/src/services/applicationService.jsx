import { apiClient, normalizeApiError } from './apiClient.jsx'

export async function applyToJob(jobId, resumeId = null) {
  try {
    const payload = resumeId ? { jobId, resumeId } : { jobId }
    const res = await apiClient.post('/application/apply', payload)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getMyApplications() {
  try {
    const res = await apiClient.get('/application/my')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getJobApplications(jobId) {
  try {
    if (!jobId) {
      console.warn('getJobApplications called without jobId parameter')
      return []
    }
    const res = await apiClient.get(`/application/job/${jobId}/applicants`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getApplicationById(applicationId) {
  try {
    if (!applicationId) {
      console.warn('getApplicationById called without applicationId parameter')
      return null
    }
    const res = await apiClient.get(`/application/${applicationId}`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function updateApplicationStatus(applicationId, status) {
  try {
    const res = await apiClient.patch(`/application/${applicationId}/status`, { status })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function withdrawApplication(applicationId) {
  try {
    const res = await apiClient.delete(`/application/${applicationId}`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}
