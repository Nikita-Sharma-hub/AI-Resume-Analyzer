import { apiClient, DEMO_MODE, normalizeApiError, sleep } from './apiClient.jsx'

function makeDemoUser({ name, email, role }) {
  return {
    id: `demo_${role}_${String(email || 'user').replace(/[^a-z0-9]/gi, '_')}`,
    name: name || (role === 'recruiter' ? 'Demo Recruiter' : 'Demo Candidate'),
    email: email || (role === 'recruiter' ? 'recruiter@demo.com' : 'candidate@demo.com'),
    role,
  }
}

export async function login({ email, password }) {
  try {
    const res = await apiClient.post('/auth/login', { email, password })
    return res.data
  } catch (err) {
    if (!DEMO_MODE) throw normalizeApiError(err)
    await sleep(600)
    const role = String(email || '').toLowerCase().includes('recruit') ? 'recruiter' : 'candidate'
    return { token: 'demo-token', user: makeDemoUser({ email, role }) }
  }
}

export async function register({ name, email, password, role }) {
  try {
    const res = await apiClient.post('/auth/register', { name, email, password, role })
    return res.data
  } catch (err) {
    if (!DEMO_MODE) throw normalizeApiError(err)
    await sleep(800)
    return { token: 'demo-token', user: makeDemoUser({ name, email, role: role || 'candidate' }) }
  }
}

