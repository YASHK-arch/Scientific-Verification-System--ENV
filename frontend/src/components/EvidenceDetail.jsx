import { X, FileText, Database, FlaskConical, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const TYPE_CONFIG = {
  paper_summary:   { Icon: FileText,     label: 'Research Paper',   cls: 'text-electric-400' },
  dataset_snippet: { Icon: Database,     label: 'Dataset Snippet',  cls: 'text-violet-400' },
  trial_outcome:   { Icon: FlaskConical, label: 'Trial Outcome',    cls: 'text-amber-400' },
}

export default function EvidenceDetail({ evidence, content, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!evidence) return null

  const tc = TYPE_CONFIG[evidence.type] || TYPE_CONFIG.paper_summary
  const { Icon } = tc

  const isDataset = evidence.type === 'dataset_snippet'

  const handleCopy = () => {
    navigator.clipboard.writeText(content || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,8,20,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="glass w-full max-w-2xl max-h-[80vh] flex flex-col animate-reveal shadow-2xl shadow-black/50 border border-white/10">
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-white/5">
          <div className={`w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0`}>
            <Icon size={16} className={tc.cls} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-1 ${tc.cls}`}>{tc.label}</p>
            <h3 className="text-sm font-medium text-slate-100 leading-snug">{evidence.title}</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">{evidence.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-ghost py-1.5 px-2.5 text-xs"
              title="Copy content"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              id="close-evidence-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isDataset ? (
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap
                            bg-navy-900/80 p-4 rounded-lg border border-white/5">
              {content}
            </pre>
          ) : (
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
