import { Microscope, Wifi, WifiOff, ChevronDown, RotateCcw, Cpu } from 'lucide-react'

const DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFFICULTY_BADGE = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' }

export default function Header({
  scenarios, selectedTask, onSelectTask, onReset,
  backendOnline, autoPlaying, onAutoPlay, observation
}) {
  const grouped = { easy: [], medium: [], hard: [] }
  scenarios.forEach(s => grouped[s.difficulty]?.push(s))

  const currentScenario = scenarios.find(s => s.task_id === selectedTask)

  return (
    <header className="glass border-b border-white/5 px-4 lg:px-6 py-3 flex items-center gap-4 flex-wrap">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center shadow-lg shadow-electric-500/30">
          <Microscope size={16} className="text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-white tracking-tight">ClaimLens</span>
          <span className="hidden sm:inline text-xs text-slate-500 ml-2 font-mono">SCV-ENV v1.0</span>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="flex-1 min-w-[240px] max-w-md relative">
        <div className="relative">
          <select
            id="scenario-select"
            value={selectedTask}
            onChange={e => onSelectTask(e.target.value)}
            className="w-full appearance-none glass-sm px-3 py-2 pr-8 text-sm text-slate-100
                       focus:outline-none focus:border-electric-500/50 focus:ring-1
                       focus:ring-electric-500/30 border border-white/10 rounded-lg
                       bg-navy-900/60 cursor-pointer transition-all"
          >
            <option value="" disabled>Select a scenario…</option>
            {['easy','medium','hard'].map(diff => (
              grouped[diff].length > 0 && (
                <optgroup key={diff} label={`── ${DIFFICULTY_LABELS[diff]} ──`}>
                  {grouped[diff].map(s => (
                    <option key={s.task_id} value={s.task_id}>
                      [{s.task_id}] {s.claim.slice(0, 55)}…
                    </option>
                  ))}
                </optgroup>
              )
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Difficulty badge */}
      {currentScenario && (
        <span className={DIFFICULTY_BADGE[currentScenario.difficulty]}>
          {DIFFICULTY_LABELS[currentScenario.difficulty]}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* AI Auto-play */}
        {observation && !observation.done && (
          <button
            id="autoplay-btn"
            onClick={onAutoPlay}
            className={`btn text-xs ${autoPlaying
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse-slow'
              : 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20'
            }`}
          >
            <Cpu size={13} />
            {autoPlaying ? 'AI Running…' : 'AI Auto-Play'}
          </button>
        )}

        {/* Reset */}
        <button
          id="reset-btn"
          onClick={onReset}
          disabled={!selectedTask}
          className="btn-ghost text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={13} />
          Reset
        </button>

        {/* Backend status */}
        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border
          ${backendOnline === true
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            : backendOnline === false
            ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
            : 'border-slate-500/20 bg-slate-500/10 text-slate-400'
          }`}>
          {backendOnline === true
            ? <><Wifi size={11} /> Online</>
            : backendOnline === false
            ? <><WifiOff size={11} /> Offline</>
            : <><span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" /> Checking…</>
          }
        </div>
      </div>
    </header>
  )
}
