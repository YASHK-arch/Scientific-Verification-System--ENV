import axios from 'axios'

const BASE = ''

export const api = {
  // ── Demo mode ──
  getScenarios: () => axios.get(`${BASE}/api/scenarios`).then(r => r.data.scenarios),
  reset: (taskId) => axios.post(`${BASE}/api/reset`, { task_id: taskId }).then(r => r.data),
  step: (action) => axios.post(`${BASE}/api/step`, { action }).then(r => r.data),
  getState: () => axios.get(`${BASE}/api/state`).then(r => r.data),
  grade: () => axios.get(`${BASE}/api/grade`).then(r => r.data),
  autoStep: () => axios.post(`${BASE}/api/auto-step`).then(r => r.data),
  health: () => axios.get(`${BASE}/health`).then(r => r.data),

  // ── Evidence Repository ──
  getRepository: () => axios.get(`${BASE}/api/repository`).then(r => r.data.items),
  deleteEvidence: (id) => axios.delete(`${BASE}/api/repository/${id}`).then(r => r.data),
  clearRepository: () => axios.post(`${BASE}/api/repository/clear`).then(r => r.data),

  // ── File upload ──
  uploadFile: (file, onProgress) => {
    const form = new FormData()
    form.append('file', file)
    return axios.post(`${BASE}/api/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    }).then(r => r.data)
  },

  // ── Custom analysis ──
  analyzeCustom: (claim, evidenceIds) =>
    axios.post(`${BASE}/api/analyze-custom`, { claim, evidence_ids: evidenceIds }).then(r => r.data),
}
