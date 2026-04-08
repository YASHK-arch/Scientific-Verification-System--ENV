import { Search, Sparkles, AlertCircle } from 'lucide-react'

export default function ClaimInput({ claim, onChange, onAnalyze, analyzing, selectedCount, error }) {
  const canAnalyze = claim.trim().length > 10 && selectedCount > 0 && !analyzing

  return (
    <div className="glass p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Search size={16} className="text-electric-400" />
        <h2 className="text-sm font-bold text-white">Research Claim</h2>
      </div>

      <div>
        <p className="text-xs text-slate-500 mb-2">
          Type the scientific claim you want to verify against your uploaded documents.
        </p>
        <textarea
          id="claim-input"
          value={claim}
          onChange={e => onChange(e.target.value)}
          placeholder='e.g. "Drug X significantly reduces tumor growth in colorectal cancer patients"'
          rows={3}
          className="textarea text-sm leading-relaxed w-full"
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-slate-600">{claim.length} characters</span>
          {claim.length > 0 && claim.length < 10 && (
            <span className="text-xs text-amber-500">Make claim more specific</span>
          )}
        </div>
      </div>

      {/* Selection info */}
      <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg
        ${selectedCount > 0
          ? 'bg-electric-500/10 text-electric-300 border border-electric-500/20'
          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
        <span>{selectedCount > 0
          ? `✓ ${selectedCount} evidence document${selectedCount !== 1 ? 's' : ''} selected`
          : '⚠ Select at least 1 evidence document from the repository'
        }</span>
      </div>

      {/* Analyze button */}
      <button
        id="analyze-btn"
        onClick={onAnalyze}
        disabled={!canAnalyze}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                    font-semibold text-sm transition-all duration-300
                    ${canAnalyze
                      ? 'bg-gradient-to-r from-electric-500 to-violet-500 text-white shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 hover:scale-[1.01]'
                      : 'bg-navy-800 text-slate-600 cursor-not-allowed'
                    }`}
      >
        {analyzing ? (
          <>
            <span className="flex gap-1">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }} />
              ))}
            </span>
            Scanning Evidence…
          </>
        ) : (
          <>
            <Sparkles size={15} />
            Analyze Claim with AI
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10
                        border border-rose-500/20 rounded-lg px-3 py-2">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  )
}
