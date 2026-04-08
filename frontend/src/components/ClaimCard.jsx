import { Quote, AlertCircle, CheckCircle, HelpCircle, Clock } from 'lucide-react'

const VERDICT_CONFIG = {
  unassessed:   { label: 'Unassessed',   cls: 'badge-unassessed',   Icon: Clock,         ring: '' },
  supported:    { label: 'Supported',    cls: 'badge-supported',    Icon: CheckCircle,   ring: 'verdict-ring-supported' },
  unsupported:  { label: 'Unsupported',  cls: 'badge-unsupported',  Icon: AlertCircle,   ring: 'verdict-ring-unsupported' },
  inconclusive: { label: 'Inconclusive', cls: 'badge-inconclusive', Icon: HelpCircle,    ring: 'verdict-ring-inconclusive' },
}

export default function ClaimCard({ observation }) {
  if (!observation) return null

  const { claim, current_status, step_count, max_steps } = observation
  const vc = VERDICT_CONFIG[current_status] || VERDICT_CONFIG.unassessed
  const { Icon } = vc

  const progress = (step_count / max_steps) * 100

  return (
    <div className={`glass p-5 animate-fade-in ${vc.ring ? vc.ring : ''} transition-all duration-500`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-electric-500/15 flex items-center justify-center flex-shrink-0">
            <Quote size={14} className="text-electric-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Scientific Claim</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={vc.cls}>
            <Icon size={11} />
            {vc.label}
          </span>
        </div>
      </div>

      {/* Claim text */}
      <blockquote className="text-slate-100 text-base leading-relaxed font-medium border-l-2 border-electric-500/40 pl-3">
        "{claim}"
      </blockquote>

      {/* Step progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Episode Progress</span>
          <span className="font-mono">{step_count} / {max_steps} steps</span>
        </div>
        <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: progress > 80
                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                : progress > 50
                ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
