import { Trophy, RotateCcw, Target, TrendingUp, Layers, BarChart2, Brain } from 'lucide-react'

function ScoreRing({ score }) {
  const pct = Math.round(score * 100)
  const r = 54, circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle cx="72" cy="72" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 72 72)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color }}>{pct}</span>
        <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

function AccBar({ label, value, Icon }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 40 ? 'bg-amber-500' : 'bg-rose-500'
  const tc = value >= 70 ? 'text-emerald-400' : value >= 40 ? 'text-amber-400' : 'text-rose-400'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400"><Icon size={11} />{label}</div>
        <span className={`text-xs font-mono font-bold ${tc}`}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function GraderResult({ result, onPlayAgain }) {
  if (!result) return null
  const pct = Math.round(result.total_score * 100)
  const ai = result.ai_accuracy || {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,8,20,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="glass w-full max-w-lg animate-reveal border border-white/10 shadow-2xl shadow-black/60 overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className={`p-6 border-b border-white/5 text-center rounded-t-xl
          ${pct >= 60 ? 'bg-gradient-to-b from-emerald-500/10 to-transparent' : 'bg-gradient-to-b from-rose-500/10 to-transparent'}`}>
          <Trophy size={28} className={pct >= 60 ? 'text-amber-400 mx-auto mb-3' : 'text-slate-600 mx-auto mb-3'} />
          <h2 className="text-lg font-bold text-white mb-1">{pct >= 60 ? 'Episode Complete!' : 'Episode Finished'}</h2>
          <p className="text-sm text-slate-400 capitalize">{result.difficulty} difficulty</p>
        </div>

        <div className="p-6 pb-0 flex flex-col gap-5">
          {/* Score ring */}
          <ScoreRing score={result.total_score} />

          {/* Verdict comparison */}
          <div className="flex items-center justify-center gap-6 p-3 bg-navy-900/60 rounded-xl border border-white/5">
            {[
              { label: 'Your Verdict', val: result.agent_verdict, match: result.correct_verdict },
              null,
              { label: 'Expected', val: result.expected_verdict },
              null,
              { label: 'Confidence', val: `${Math.round((result.agent_confidence || 0) * 100)}%` },
            ].map((item, i) =>
              item === null
                ? <div key={i} className="w-px h-8 bg-white/10" />
                : (
                  <div key={i} className="text-center">
                    <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                    <span className={`text-sm font-bold capitalize
                      ${item.match === true ? 'text-emerald-400' : item.match === false ? 'text-rose-400' : 'text-slate-300'}`}>
                      {item.val || 'None'}
                    </span>
                  </div>
                )
            )}
          </div>

          {/* Score breakdown */}
          {result.breakdown && Object.keys(result.breakdown).length > 0 && (
            <div>
              <p className="section-label">Score Breakdown</p>
              <div className="flex flex-col gap-2">
                {Object.entries(result.breakdown).map(([key, val]) => {
                  const pctVal = val.max > 0 ? (val.score / val.max) * 100 : 0
                  const barColor = pctVal >= 80 ? 'bg-emerald-500' : pctVal >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-slate-300">{val.score.toFixed(1)} / {val.max.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                          style={{ width: `${pctVal}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* AI Accuracy container */}
          {ai.overall_accuracy !== undefined && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain size={14} className="text-violet-400" />
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">AI Model Accuracy</span>
                </div>
                <span className={`text-lg font-black font-mono
                  ${ai.overall_accuracy >= 70 ? 'text-emerald-400' : ai.overall_accuracy >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {ai.overall_accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <AccBar label="Verdict Match Rate"      value={ai.verdict_match_rate ?? 0}      Icon={Target} />
                <AccBar label="Confidence Calibration"  value={ai.confidence_calibration ?? 0}  Icon={TrendingUp} />
                <AccBar label="Evidence Coverage"       value={ai.evidence_coverage ?? 0}        Icon={Layers} />
                <AccBar label="Statistical Reasoning"   value={ai.statistical_reasoning ?? 0}   Icon={BarChart2} />
              </div>
            </div>
          )}

          {/* Feedback */}
          {result.feedback?.length > 0 && (
            <div>
              <p className="section-label">Feedback</p>
              <ul className="flex flex-col gap-1.5">
                {result.feedback.map((f, i) => (
                  <li key={i} className={`text-xs leading-snug
                    ${f.startsWith('✅') ? 'text-emerald-300' : f.startsWith('⚠') ? 'text-amber-300' : 'text-rose-300'}`}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6">
          <button id="play-again-btn" onClick={onPlayAgain} className="btn-primary w-full justify-center text-sm">
            <RotateCcw size={14} /> Try Another Scenario
          </button>
        </div>
      </div>
    </div>
  )
}
