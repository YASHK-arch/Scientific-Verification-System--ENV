import { useCallback, useRef, useState } from 'react'
import { api } from '../api/envClient'

export function useEnvironment() {
  const [observation, setObservation] = useState(null)
  const [state, setState] = useState(null)
  const [gradeResult, setGradeResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [backendOnline, setBackendOnline] = useState(null)
  const [scenarios, setScenarios] = useState([])
  const [autoPlaying, setAutoPlaying] = useState(false)
  const autoPlayRef = useRef(false)

  const clearError = () => setError(null)

  const checkHealth = useCallback(async () => {
    try { await api.health(); setBackendOnline(true) }
    catch { setBackendOnline(false) }
  }, [])

  const loadScenarios = useCallback(async () => {
    try { setScenarios(await api.getScenarios()) }
    catch (e) { setError('Failed to load scenarios: ' + e.message) }
  }, [])

  const resetEnv = useCallback(async (taskId) => {
    setLoading(true); setError(null); setGradeResult(null)
    autoPlayRef.current = false; setAutoPlaying(false)
    try {
      const obs = await api.reset(taskId)
      setObservation(obs)
      setState(await api.getState())
    } catch (e) { setError('Reset failed: ' + (e.response?.data?.detail || e.message)) }
    finally { setLoading(false) }
  }, [])

  const submitAction = useCallback(async (action) => {
    if (!observation || observation.done) return
    setLoading(true); setError(null)
    try {
      const obs = await api.step(action)
      setObservation(obs)
      setState(await api.getState())
      if (obs.done) {
        const grade = await api.grade()
        setGradeResult(grade)
      }
      return obs
    } catch (e) { setError('Action failed: ' + (e.response?.data?.detail || e.message)) }
    finally { setLoading(false) }
  }, [observation])

  const evaluateEvidence = useCallback((id) =>
    submitAction({ action_type: 'evaluate_evidence', target_id: id }), [submitAction])
  const updateNotes = useCallback((content) =>
    submitAction({ action_type: 'update_notes', content }), [submitAction])
  const setVerdict = useCallback((verdict) =>
    submitAction({ action_type: 'set_verdict', content: verdict }), [submitAction])
  const finalize = useCallback((confidence, content) =>
    submitAction({ action_type: 'finalize', confidence, content }), [submitAction])

  const startAutoPlay = useCallback(async () => {
    if (!observation || observation.done) return
    autoPlayRef.current = true; setAutoPlaying(true); setError(null)
    const delay = (ms) => new Promise(r => setTimeout(r, ms))
    let cur = observation
    while (!cur?.done && autoPlayRef.current) {
      try {
        const result = await api.autoStep()
        cur = result.observation
        setObservation(cur)
        setState(await api.getState())
        if (cur.done) { const grade = await api.grade(); setGradeResult(grade); break }
        await delay(1200)
      } catch (e) { setError('Auto-play error: ' + (e.response?.data?.detail || e.message)); break }
    }
    setAutoPlaying(false); autoPlayRef.current = false
  }, [observation])

  const stopAutoPlay = useCallback(() => {
    autoPlayRef.current = false; setAutoPlaying(false)
  }, [])

  return {
    observation, state, gradeResult, loading, error, backendOnline, scenarios, autoPlaying,
    clearError, checkHealth, loadScenarios, resetEnv,
    evaluateEvidence, updateNotes, setVerdict, finalize, startAutoPlay, stopAutoPlay,
  }
}
