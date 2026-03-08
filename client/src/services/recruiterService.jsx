import { apiClient, normalizeApiError } from './apiClient.jsx'

export async function createJob(jobData) {
  try {
    const res = await apiClient.post('/job', jobData)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getJobs() {
  try {
    const res = await apiClient.get('/job')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getMyJobs() {
  try {
    const res = await apiClient.get('/job/my')
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

export async function updateJob(jobId, jobData) {
  try {
    const res = await apiClient.put(`/job/${jobId}`, jobData)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function deleteJob(jobId) {
  try {
    const res = await apiClient.delete(`/job/${jobId}`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getJobApplicants(jobId) {
  try {
    const res = await apiClient.get(`/job/${jobId}/applicants`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function rankApplicants(jobId) {
  try {
    const res = await apiClient.post(`/job/${jobId}/rank`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function matchResumeWithJob(resumeId, jobId) {
  try {
    const res = await apiClient.post('/job/match', { resumeId, jobId })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

// Legacy function for backward compatibility
export async function listApplicants(jobId) {
  return await getJobApplicants(jobId)
}

