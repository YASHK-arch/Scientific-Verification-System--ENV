import { useCallback, useRef, useState } from 'react'
import { api } from '../api/envClient'

const STORAGE_KEY = 'claimlens_repository'

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useResearch() {
  const [repository, setRepository] = useState(() => loadFromStorage())
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)
  const [claim, setClaim] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  const clearError = () => setError(null)

  const uploadFile = useCallback(async (file) => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    try {
      const item = await api.uploadFile(file, setUploadProgress)
      const updated = [...repository.filter(r => r.id !== item.id), item]
      setRepository(updated)
      saveToStorage(updated)
      // Auto-select newly uploaded item
      setSelectedIds(prev => prev.includes(item.id) ? prev : [...prev, item.id])
      return item
    } catch (e) {
      setError('Upload failed: ' + (e.response?.data?.detail || e.message))
      return null
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [repository])

  const deleteItem = useCallback(async (id) => {
    try {
      await api.deleteEvidence(id)
    } catch { /* If backend fails, still remove locally */ }
    const updated = repository.filter(r => r.id !== id)
    setRepository(updated)
    saveToStorage(updated)
    setSelectedIds(prev => prev.filter(i => i !== id))
  }, [repository])

  const clearAll = useCallback(async () => {
    try { await api.clearRepository() } catch {}
    setRepository([])
    saveToStorage([])
    setSelectedIds([])
    setAnalysisResult(null)
  }, [])

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(repository.map(r => r.id))
  }, [repository])

  const analyzeClaim = useCallback(async () => {
    if (!claim.trim()) { setError('Please enter a claim to verify.'); return }
    if (selectedIds.length === 0) { setError('Please select at least one evidence document.'); return }
    setAnalyzing(true)
    setError(null)
    setAnalysisResult(null)
    try {
      const result = await api.analyzeCustom(claim.trim(), selectedIds)
      setAnalysisResult(result)
    } catch (e) {
      setError('Analysis failed: ' + (e.response?.data?.detail || e.message))
    } finally {
      setAnalyzing(false)
    }
  }, [claim, selectedIds])

  return {
    repository, uploading, uploadProgress, analyzing, analysisResult,
    error, claim, selectedIds,
    setClaim, clearError, uploadFile, deleteItem, clearAll,
    toggleSelect, selectAll, analyzeClaim,
    setAnalysisResult,
  }
}
