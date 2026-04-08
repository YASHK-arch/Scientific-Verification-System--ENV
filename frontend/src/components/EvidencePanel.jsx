import { useState } from 'react'
import { FileText, Database, FlaskConical, Lock, CheckCircle, ChevronRight, Loader2 } from 'lucide-react'

const TYPE_CONFIG = {
  paper_summary:   { Icon: FileText,     label: 'Paper',   cls: 'text-electric-400', bg: 'bg-electric-500/10' },
  dataset_snippet: { Icon: Database,     label: 'Dataset', cls: 'text-violet-400',   bg: 'bg-violet-500/10' },
  trial_outcome:   { Icon: FlaskConical, label: 'Trial',   cls: 'text-amber-400',    bg: 'bg-amber-500/10' },
}

export default function EvidencePanel({ observation, onEvaluate, loading, onViewDetail }) {
  const [hovered, setHovered] = useState(null)

  if (!observation) return (
    <div className="glass p-4 h-full flex items-center justify-center">
      <p className="text-slate-600 text-sm">No scenario loaded</p>
    </div>
  )

  const { available_evidence, evaluated_evidence } = observation

  return (
    <div className="glass p-4 flex flex-col gap-2 h-full">
      <p className="section-label">Evidence Repository</p>
      <p className="text-xs text-slate-500 mb-2">
        {Object.keys(evaluated_evidence).length} / {available_evidence.length} evaluated
      </p>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {available_evidence.map((ev) => {
          const evaluated = ev.id in evaluated_evidence
          const tc = TYPE_CONFIG[ev.type] || TYPE_CONFIG.paper_summary
          const { Icon } = tc
          const isHovered = hovered === ev.id

          return (
            <div
              key={ev.id}
              id={`ev-${ev.id}`}
              className={`rounded-xl border p-3 transition-all duration-200 cursor-pointer
                ${evaluated
                  ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                  : 'border-white/5 bg-navy-900/40 hover:bg-navy-700/50 hover:border-white/10'
                }`}
              onMouseEnter={() => setHovered(ev.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => evaluated ? onViewDetail(ev) : onEvaluate(ev.id)}
            >
              <div className="flex items-start gap-2.5">
                {/* Type icon */}
                <div className={`w-7 h-7 rounded-lg ${tc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={13} className={tc.cls} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-xs font-medium ${tc.cls}`}>{tc.label}</span>
                    <span className="text-slate-600 text-xs font-mono">{ev.id}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{ev.title}</p>
                </div>

                {/* Status icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {evaluated ? (
                    <CheckCircle size={15} className="text-emerald-400" />
                  ) : loading && isHovered ? (
                    <Loader2 size={15} className="text-slate-400 animate-spin" />
                  ) : (
                    <div className={`transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-40'}`}>
                      {evaluated ? (
                        <ChevronRight size={15} className="text-emerald-400" />
                      ) : (
                        <Lock size={13} className="text-slate-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA hint */}
              {!evaluated && isHovered && (
                <div className="mt-2 pt-2 border-t border-white/5 animate-fade-in">
                  <p className="text-xs text-electric-400 flex items-center gap-1">
                    <ChevronRight size={11} /> Click to evaluate
                  </p>
                </div>
              )}
              {evaluated && isHovered && (
                <div className="mt-2 pt-2 border-t border-white/5 animate-fade-in">
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <ChevronRight size={11} /> Click to view content
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
