import { apiClient, DEMO_MODE, normalizeApiError, sleep } from './apiClient.jsx'

const demoApplicants = [
  {
    id: 'a1',
    name: 'Aisha Khan',
    email: 'aisha@example.com',
    status: 'new',
    matchScore: 92,
    highlights: ['React performance', 'Design systems', 'Mentorship'],
  },
  {
    id: 'a2',
    name: 'Miguel Santos',
    email: 'miguel@example.com',
    status: 'review',
    matchScore: 86,
    highlights: ['API integration', 'Testing', 'Accessibility'],
  },
  {
    id: 'a3',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    status: 'shortlisted',
    matchScore: 79,
    highlights: ['UI engineering', 'Tailwind', 'Collaboration'],
  },
]

export async function createJob(payload) {
  try {
    const res = await apiClient.post('/recruiter/jobs', payload)
    return res.data
  } catch (err) {
    if (!DEMO_MODE) throw normalizeApiError(err)
    await sleep(500)
    return { id: `job_${Date.now()}`, ...payload }
  }
}

export async function listApplicants(jobId) {
  try {
    const res = await apiClient.get(`/recruiter/jobs/${jobId}/applicants`)
    return res.data
  } catch (err) {
    if (!DEMO_MODE) throw normalizeApiError(err)
    await sleep(700)
    return demoApplicants.slice().sort((a, b) => b.matchScore - a.matchScore)
  }
}

