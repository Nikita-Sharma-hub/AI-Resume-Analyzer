import { apiClient, normalizeApiError } from './apiClient.jsx'

export async function analyzeResume(file) {
  try {
    const form = new FormData()
    form.append('resume', file)

    const res = await apiClient.post('/resume/analyze', form)

    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function uploadResume(file) {
  try {
    const form = new FormData()
    form.append('resume', file)

    const res = await apiClient.post('/resume/upload', form)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getMyResumes() {
  try {
    const res = await apiClient.get('/resume/my')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function deleteResume(resumeId) {
  try {
    const res = await apiClient.delete(`/resume/${resumeId}`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

// New AI-powered endpoints
export async function matchResumeWithJob(resumeId, jobId) {
  try {
    const res = await apiClient.post('/resume/match', { resumeId, jobId })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function optimizeResume(file, targetRole) {
  try {
    const form = new FormData()
    form.append('resume', file)
    form.append('targetRole', targetRole)

    const res = await apiClient.post('/resume/optimize', form)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function getSkillGapAnalysis(resumeId, jobId) {
  try {
    const res = await apiClient.get(`/resume/skill-gap/${resumeId}/${jobId}`)
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
