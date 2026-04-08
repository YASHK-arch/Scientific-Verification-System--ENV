import { Search, FileText, StickyNote, Scale, Send, ChevronRight } from 'lucide-react'

const ACTIONS = [
  {
    key: 'evaluate',
    Icon: Search,
    label: 'Evaluate Evidence',
    desc: 'Read an evidence item',
    cls: 'border-electric-500/20 bg-electric-500/5 hover:bg-electric-500/10 text-electric-400',
  },
  {
    key: 'notes',
    Icon: StickyNote,
    label: 'Update Notes',
    desc: 'Add to your scratchpad',
    cls: 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400',
  },
  {
    key: 'verdict',
    Icon: Scale,
    label: 'Set Verdict',
    desc: 'Choose supported / unsupported / inconclusive',
    cls: 'border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 text-violet-400',
  },
  {
    key: 'finalize',
    Icon: Send,
    label: 'Finalize',
    desc: 'Submit verdict and end episode',
    cls: 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400',
  },
]

export default function ActionBar({ observation, onActionClick }) {
  if (!observation) return null

  const evaluated = Object.keys(observation.evaluated_evidence || {}).length
  const hasVerdict = observation.current_status !== 'unassessed'
  const done = observation.done

  // Determine recommended next action
  const recommended = done ? null
    : evaluated === 0 ? 'evaluate'
    : evaluated < observation.available_evidence.length ? 'evaluate'
    : !hasVerdict ? 'verdict'
    : 'finalize'

  return (
    <div className="glass p-4">
      <p className="section-label">Actions</p>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map(a => {
          const isRecommended = a.key === recommended
          const { Icon } = a
          return (
            <button
              key={a.key}
              id={`action-${a.key}`}
              onClick={() => onActionClick(a.key)}
              disabled={done}
              className={`relative flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left
                          transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                          ${a.cls} ${isRecommended && !done ? 'ring-1 ring-white/20 scale-[1.02]' : ''}`}
            >
              {isRecommended && !done && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-electric-400 animate-pulse" />
              )}
              <Icon size={15} />
              <div>
                <p className="text-xs font-semibold text-white">{a.label}</p>
                <p className="text-xs opacity-60 mt-0.5">{a.desc}</p>
              </div>
              {isRecommended && !done && (
                <span className="text-xs opacity-70 flex items-center gap-0.5 mt-0.5">
                  <ChevronRight size={10} /> Recommended
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
