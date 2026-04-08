import { useState } from 'react'
import { StickyNote, Save, Clock } from 'lucide-react'

export default function Scratchpad({ notes, onSaveNotes, loading }) {
  const [draft, setDraft] = useState('')
  const [lastSaved, setLastSaved] = useState(null)

  const handleSave = async () => {
    if (!draft.trim()) return
    await onSaveNotes(draft)
    setLastSaved(new Date())
    setDraft('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSave()
  }

  return (
    <div className="glass p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote size={14} className="text-amber-400" />
          <span className="section-label mb-0">Agent Scratchpad</span>
        </div>
        {lastSaved && (
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Clock size={10} />
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Accumulated notes */}
      {notes && (
        <div className="bg-navy-900/60 rounded-lg p-3 border border-white/5 max-h-32 overflow-y-auto">
          <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
            {notes || 'No notes yet…'}
          </pre>
        </div>
      )}

      {/* New note input */}
      <textarea
        id="scratchpad-input"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Add reasoning notes… (Ctrl+Enter to save)"
        rows={3}
        className="textarea text-xs leading-relaxed"
      />

      <button
        id="save-notes-btn"
        onClick={handleSave}
        disabled={!draft.trim() || loading}
        className="btn-ghost w-full justify-center text-xs disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Save size={13} />
        Save Notes
      </button>
    </div>
  )
}
