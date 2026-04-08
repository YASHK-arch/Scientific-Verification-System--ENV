import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, HelpCircle, Send } from 'lucide-react'

const VERDICTS = [
  {
    key: 'supported',
    label: 'Supported',
    desc: 'Evidence clearly supports the claim',
    Icon: CheckCircle,
    activeClass: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    hoverClass: 'hover:border-emerald-500/30 hover:bg-emerald-500/5',
    iconClass: 'text-emerald-400',
    autoConf: 0.90,
    confColor: '#10b981',
    confRange: 'High confidence expected (0.75–1.0)',
  },
  {
    key: 'unsupported',
    label: 'Unsupported',
    desc: 'Evidence contradicts or fails to support',
    Icon: AlertCircle,
    activeClass: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
    hoverClass: 'hover:border-rose-500/30 hover:bg-rose-500/5',
    iconClass: 'text-rose-400',
    autoConf: 0.15,
    confColor: '#ef4444',
    confRange: 'Low confidence appropriate (0.10–0.35)',
  },
  {
    key: 'inconclusive',
    label: 'Inconclusive',
    desc: 'Evidence is mixed, weak, or insufficient',
    Icon: HelpCircle,
    activeClass: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    hoverClass: 'hover:border-amber-500/30 hover:bg-amber-500/5',
    iconClass: 'text-amber-400',
    autoConf: 0.40,
    confColor: '#f59e0b',
    confRange: 'Mid confidence appropriate (0.30–0.60)',
  },
]

export default function VerdictPanel({ observation, onSetVerdict, onFinalize, loading }) {
  const [confidence, setConfidence] = useState(0.75)
  const [justification, setJustification] = useState('')
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false)

  const currentVerdict = observation?.current_status || 'unassessed'
  const activeVConfig = VERDICTS.find(v => v.key === currentVerdict)

  // Auto-snap confidence when verdict changes
  useEffect(() => {
    if (activeVConfig) setConfidence(activeVConfig.autoConf)
  }, [currentVerdict])

  if (!observation) return null

  const evaluatedCount = Object.keys(observation.evaluated_evidence || {}).length
  const canFinalize = evaluatedCount > 0 && currentVerdict !== 'unassessed'
  const confPercent = Math.round(confidence * 100)

  // Color is driven by verdict, not just percentage
  const sliderColor = currentVerdict === 'supported'
    ? '#10b981'
    : currentVerdict === 'unsupported'
    ? '#ef4444'
    : currentVerdict === 'inconclusive'
    ? '#f59e0b'
    : confidence >= 0.70 ? '#10b981' : confidence >= 0.40 ? '#f59e0b' : '#ef4444'

  const confTextColor = currentVerdict === 'supported'
    ? 'text-emerald-400'
    : currentVerdict === 'unsupported'
    ? 'text-rose-400'
    : currentVerdict === 'inconclusive'
    ? 'text-amber-400'
    : confidence >= 0.70 ? 'text-emerald-400' : confidence >= 0.40 ? 'text-amber-400' : 'text-rose-400'

  const handleSetVerdict = (v) => onSetVerdict(v)

  const handleFinalize = async () => {
    await onFinalize(confidence, justification || 'Finalized based on evidence evaluation.')
    setShowFinalizeConfirm(false)
  }

  return (
    <div className="glass p-4 flex flex-col gap-4">
      <p className="section-label">Verdict & Confidence</p>

      {/* Verdict buttons */}
      <div className="flex flex-col gap-2">
        {VERDICTS.map(v => {
          const isActive = currentVerdict === v.key
          const { Icon } = v
          return (
            <button key={v.key} id={`verdict-${v.key}`}
              onClick={() => handleSetVerdict(v.key)}
              disabled={loading || observation.done}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left
                          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                          ${isActive ? v.activeClass : `border-white/5 bg-navy-900/40 text-slate-300 ${v.hoverClass}`}`}
            >
              <Icon size={16} className={`flex-shrink-0 mt-0.5 ${isActive ? '' : v.iconClass}`} />
              <div>
                <p className="text-xs font-semibold">{v.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{v.desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Confidence slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Confidence</span>
          <span className={`text-sm font-bold font-mono ${confTextColor}`}>{confPercent}%</span>
        </div>
        <input id="confidence-slider" type="range" min="0" max="1" step="0.05"
          value={confidence} onChange={e => setConfidence(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(90deg, ${sliderColor} ${confPercent}%, #1e2a55 ${confPercent}%)` }}
          disabled={observation.done}
        />
        {activeVConfig && (
          <p className="text-xs text-slate-600 mt-1.5">{activeVConfig.confRange}</p>
        )}
      </div>

      {/* Justification */}
      <textarea id="justification-input" value={justification}
        onChange={e => setJustification(e.target.value)}
        placeholder="Add justification for your verdict…" rows={2}
        className="textarea text-xs" disabled={observation.done} />

      {/* Finalize */}
      {!showFinalizeConfirm ? (
        <button id="finalize-btn" onClick={() => setShowFinalizeConfirm(true)}
          disabled={!canFinalize || loading || observation.done}
          className="btn w-full justify-center text-sm font-semibold
                     bg-gradient-to-r from-electric-500 to-violet-500
                     hover:from-electric-400 hover:to-violet-400
                     text-white shadow-lg shadow-electric-500/20
                     disabled:opacity-40 disabled:cursor-not-allowed">
          <Send size={14} /> Finalize Verdict
        </button>
      ) : (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 animate-fade-in">
          <p className="text-xs text-amber-300 mb-3">
            Submit <strong>{currentVerdict}</strong> at <strong>{confPercent}%</strong> confidence?
          </p>
          <div className="flex gap-2">
            <button id="confirm-finalize-btn" onClick={handleFinalize} disabled={loading}
              className="btn-primary flex-1 justify-center text-xs py-1.5">Confirm</button>
            <button onClick={() => setShowFinalizeConfirm(false)}
              className="btn-ghost flex-1 justify-center text-xs py-1.5">Cancel</button>
          </div>
        </div>
      )}

      {!canFinalize && !observation.done && (
        <p className="text-xs text-slate-600 text-center">
          {evaluatedCount === 0
            ? '⚠ Evaluate at least one piece of evidence first'
            : '⚠ Set a verdict before finalizing'}
        </p>
      )}
    </div>
  )
}
