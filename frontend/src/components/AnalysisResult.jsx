import { CheckCircle, AlertCircle, HelpCircle, BarChart2, Brain, Target, Layers, TrendingUp, RefreshCw } from 'lucide-react'

// ── Color config based on verdict + confidence ──
const VERDICT_CONFIG = {
  supported: {
    label: 'SUPPORTED',
    Icon: CheckCircle,
    gradient: 'from-emerald-600/20 to-emerald-500/5',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    ring: '#10b981',
    text: 'text-emerald-300',
    confNote: 'High confidence — strong evidence supports this claim.',
  },
  unsupported: {
    label: 'UNSUPPORTED',
    Icon: AlertCircle,
    gradient: 'from-rose-600/20 to-rose-500/5',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    ring: '#ef4444',
    text: 'text-rose-300',
    confNote: 'Low confidence — evidence contradicts or fails to support this claim.',
  },
  inconclusive: {
    label: 'INCONCLUSIVE',
    Icon: HelpCircle,
    gradient: 'from-amber-600/20 to-amber-500/5',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    ring: '#f59e0b',
    text: 'text-amber-300',
    confNote: 'Mid confidence — evidence is mixed, insufficient, or statistically weak.',
  },
}

const DIFFICULTY_BADGE = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
  custom: 'badge bg-electric-500/15 text-electric-400 border border-electric-400/20',
}

function ConfidenceRing({ confidence, color }) {
  const pct = Math.round(confidence * 100)
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative w-32 h-32">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{pct}%</span>
        <span className="text-xs text-slate-500">confidence</span>
      </div>
    </div>
  )
}

function AccuracyBar({ label, value, Icon }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 40 ? 'bg-amber-500' : 'bg-rose-500'
  const textColor = value >= 70 ? 'text-emerald-400' : value >= 40 ? 'text-amber-400' : 'text-rose-400'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Icon size={11} />
          {label}
        </div>
        <span className={`text-xs font-mono font-bold ${textColor}`}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function AnalysisResult({ result, onReset }) {
  if (!result) return null

  const vc = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.inconclusive
  const { Icon } = vc
  const ai = result.ai_accuracy || {}

  return (
    <div className={`glass border ${vc.border} animate-reveal flex flex-col gap-5 p-0 overflow-hidden`}>
      {/* Verdict header */}
      <div className={`bg-gradient-to-b ${vc.gradient} p-5 pb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={18} className={vc.text} />
            <span className={`text-lg font-black tracking-wide ${vc.text}`}>{vc.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={DIFFICULTY_BADGE[result.difficulty] || DIFFICULTY_BADGE.custom}>
              {result.difficulty}
            </span>
            <button onClick={onReset}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
              <RefreshCw size={12} className="text-slate-400" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 italic leading-relaxed">"{result.claim}"</p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Confidence Ring + note */}
        <div className="flex items-center gap-5">
          <ConfidenceRing confidence={result.confidence} color={vc.ring} />
          <div>
            <p className="text-xs text-slate-500 mb-2">{vc.confNote}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{result.reasoning}</p>
          </div>
        </div>

        {/* Evidence used */}
        {result.evidence_used?.length > 0 && (
          <div>
            <p className="section-label">Evidence Scanned ({result.evidence_used.length})</p>
            <div className="flex flex-col gap-1">
              {result.evidence_used.map((ev, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400 bg-navy-900/40
                                       rounded-lg px-3 py-1.5 border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-400 flex-shrink-0" />
                  <span className="truncate">{ev.name}</span>
                  <span className="text-slate-600 ml-auto flex-shrink-0">.{ev.ext}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Accuracy container */}
        {ai.overall_accuracy !== undefined && (
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-violet-400" />
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                  AI Model Accuracy
                </span>
              </div>
              <span className={`text-lg font-black font-mono
                ${ai.overall_accuracy >= 70 ? 'text-emerald-400'
                  : ai.overall_accuracy >= 40 ? 'text-amber-400'
                  : 'text-rose-400'}`}>
                {ai.overall_accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <AccuracyBar label="Verdict Match Rate" value={ai.verdict_match_rate ?? 0} Icon={Target} />
              <AccuracyBar label="Confidence Calibration" value={ai.confidence_calibration ?? 0} Icon={TrendingUp} />
              <AccuracyBar label="Evidence Coverage" value={ai.evidence_coverage ?? 0} Icon={Layers} />
              <AccuracyBar label="Statistical Reasoning" value={ai.statistical_reasoning ?? 0} Icon={BarChart2} />
            </div>
          </div>
        )}

        {/* Step log */}
        {result.step_log?.length > 0 && (
          <div className="pb-5">
            <p className="section-label">Analysis Steps ({result.step_log.length})</p>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
              {result.step_log.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-700 font-mono w-4">{s.step}</span>
                  <span className="text-slate-400 capitalize flex-1">{s.action.replace(/_/g, ' ')}</span>
                  <span className={`font-mono font-bold flex-shrink-0 ${s.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {s.delta >= 0 ? '+' : ''}{s.delta.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
