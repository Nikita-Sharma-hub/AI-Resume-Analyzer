import { apiClient, DEMO_MODE, normalizeApiError, sleep } from './apiClient.jsx'

function demoAnalysis() {
  const score = 78 + Math.round(Math.random() * 18)
  return {
    matchScore: score,
    role: 'Frontend Engineer',
    summary:
      'Strong React fundamentals and API integration. Improve impact metrics and highlight collaboration across teams.',
    strengths: ['React + Vite workflow', 'Component architecture', 'REST API integration'],
    gaps: ['Add quantified outcomes', 'Include testing examples', 'Highlight leadership/project ownership'],
    feedback: [
      { type: 'action', text: 'Add 2–3 bullets with measurable impact (performance, conversion, time saved).' },
      { type: 'action', text: 'Move top projects above experience if they better match the role.' },
      { type: 'note', text: 'Use consistent tense and keep bullets ≤ 2 lines.' },
    ],
    extracted: {
      skills: ['React', 'JavaScript', 'Tailwind', 'Axios', 'REST', 'Git'],
      seniorityHint: 'Mid-level',
    },
  }
}

export async function analyzeResume(file) {
  try {
    const form = new FormData()
    form.append('resume', file)
    const res = await apiClient.post('/candidate/analyze', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    if (!DEMO_MODE) throw normalizeApiError(err)
    await sleep(900)
    return demoAnalysis()
  }
}

