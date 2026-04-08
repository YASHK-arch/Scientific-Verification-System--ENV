import { useEffect, useRef } from 'react'
import { Search, StickyNote, Scale, Send, Minus } from 'lucide-react'

const ACTION_CONFIG = {
  evaluate_evidence: { Icon: Search,    cls: 'text-electric-400', bg: 'bg-electric-500/10' },
  update_notes:      { Icon: StickyNote, cls: 'text-amber-400',   bg: 'bg-amber-500/10' },
  set_verdict:       { Icon: Scale,     cls: 'text-violet-400',   bg: 'bg-violet-500/10' },
  finalize:          { Icon: Send,      cls: 'text-emerald-400',  bg: 'bg-emerald-500/10' },
}

export default function StepTimeline({ observation }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [observation?.reward_history?.length])

  if (!observation) return null
  const { reward_history = [] } = observation

  if (reward_history.length === 0) return (
    <div className="glass p-4">
      <p className="section-label">Step Timeline</p>
      <p className="text-xs text-slate-600 text-center py-4">Actions will appear here</p>
    </div>
  )

  return (
    <div className="glass p-4">
      <p className="section-label">Step Timeline</p>
      <div ref={containerRef} className="flex flex-col gap-0 max-h-56 overflow-y-auto pr-1 scroll-smooth">
        {reward_history.map((ev, i) => {
          const cfg = ACTION_CONFIG[ev.action] || { Icon: Minus, cls: 'text-slate-400', bg: 'bg-slate-500/10' }
          const { Icon } = cfg
          const isPos = ev.delta > 0
          const isNeg = ev.delta < 0
          const isLast = i === reward_history.length - 1

          return (
            <div key={i} className="flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
              {/* Timeline line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center`}>
                  <Icon size={12} className={cfg.cls} />
                </div>
                {!isLast && <div className="w-px flex-1 bg-white/5 my-1" />}
              </div>

              {/* Content */}
              <div className={`pb-3 flex-1 min-w-0 ${isLast ? '' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-slate-200 capitalize">
                    {ev.action.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-xs font-bold font-mono ml-auto
                    ${isPos ? 'text-emerald-400' : isNeg ? 'text-rose-400' : 'text-slate-500'}`}>
                    {ev.delta >= 0 ? '+' : ''}{ev.delta.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug line-clamp-2">{ev.reason}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
