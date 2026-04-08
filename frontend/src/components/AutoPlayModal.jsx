import { Cpu, X, Square, ChevronRight } from 'lucide-react'

export default function AutoPlayModal({ isActive, observation, onStart, onStop, onClose }) {
  const steps = observation?.reward_history || []

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(5,8,20,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && !isActive && onClose()}
    >
      <div className="glass w-full max-w-md animate-slide-up border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center
              ${isActive ? 'bg-violet-500/20 animate-pulse-slow' : 'bg-violet-500/10'}`}>
              <Cpu size={15} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Auto-Play</h3>
              <p className="text-xs text-slate-500">Automated evidence evaluation</p>
            </div>
          </div>
          {!isActive && (
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
              <X size={14} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="p-5">
          {!isActive && steps.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-slate-300 mb-1">Ready to auto-play</p>
              <p className="text-xs text-slate-500">
                The AI agent will systematically evaluate all evidence,
                build reasoning notes, and finalize a calibrated verdict.
              </p>
            </div>
          )}

          {isActive && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-violet-300 text-sm">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                AI Agent Running…
              </div>
              <p className="text-xs text-slate-500">Step {steps.length} completed</p>
            </div>
          )}

          {/* Recent steps */}
          {steps.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto flex flex-col gap-1.5">
              {[...steps].reverse().slice(0, 8).map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400 animate-fade-in">
                  <ChevronRight size={10} className="text-violet-400 flex-shrink-0" />
                  <span className="capitalize font-medium text-slate-300">
                    {s.action.replace(/_/g, ' ')}
                  </span>
                  <span className={`ml-auto font-mono font-bold
                    ${s.delta > 0 ? 'text-emerald-400' : s.delta < 0 ? 'text-rose-400' : 'text-slate-500'}`}
                  >
                    {s.delta >= 0 ? '+' : ''}{s.delta.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 pt-0 flex gap-3">
          {!isActive ? (
            <>
              <button
                id="start-autoplay-btn"
                onClick={onStart}
                disabled={observation?.done}
                className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Cpu size={14} />
                Start Auto-Play
              </button>
              <button onClick={onClose} className="btn-ghost">
                Cancel
              </button>
            </>
          ) : (
            <button
              id="stop-autoplay-btn"
              onClick={onStop}
              className="btn-danger flex-1 justify-center"
            >
              <Square size={13} />
              Stop Agent
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
