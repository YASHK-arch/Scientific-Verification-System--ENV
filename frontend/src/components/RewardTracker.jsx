import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function RewardTracker({ observation }) {
  if (!observation) return null

  const { cumulative_reward, reward_history = [] } = observation
  const maxAbs = Math.max(...reward_history.map(e => Math.abs(e.delta)), 0.1)

  const rewardColor = cumulative_reward >= 0.5
    ? 'text-emerald-400'
    : cumulative_reward >= 0
    ? 'text-amber-400'
    : 'text-rose-400'

  return (
    <div className="glass p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="section-label mb-0">Reward Tracker</p>
        <span className={`text-xl font-bold font-mono ${rewardColor}`}>
          {cumulative_reward >= 0 ? '+' : ''}{cumulative_reward.toFixed(3)}
        </span>
      </div>

      {/* History */}
      {reward_history.length === 0 ? (
        <p className="text-xs text-slate-600 text-center py-2">No actions taken yet</p>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
          {[...reward_history].reverse().map((ev, i) => {
            const isPos = ev.delta > 0
            const isNeg = ev.delta < 0
            const Icon = isPos ? TrendingUp : isNeg ? TrendingDown : Minus
            const barWidth = Math.abs(ev.delta) / maxAbs * 100

            return (
              <div key={i} className="flex items-start gap-2.5 group">
                {/* Step number */}
                <span className="text-xs text-slate-600 font-mono w-4 flex-shrink-0 mt-0.5">
                  {ev.step}
                </span>

                {/* Bar + label */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={11} className={isPos ? 'text-emerald-400' : isNeg ? 'text-rose-400' : 'text-slate-500'} />
                    <span className="text-xs text-slate-400 font-mono capitalize">
                      {ev.action.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs font-bold font-mono ml-auto
                      ${isPos ? 'reward-positive' : isNeg ? 'reward-negative' : 'reward-neutral'}`}>
                      {ev.delta >= 0 ? '+' : ''}{ev.delta.toFixed(2)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 bg-navy-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500
                        ${isPos ? 'bg-emerald-500/60' : isNeg ? 'bg-rose-500/60' : 'bg-slate-500/60'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  {/* Reason tooltip on hover */}
                  <p className="text-xs text-slate-600 mt-0.5 leading-tight line-clamp-1 group-hover:line-clamp-none transition-all">
                    {ev.reason}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
