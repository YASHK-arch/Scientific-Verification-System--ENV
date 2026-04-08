import { Database, Upload as UploadIcon, Info } from 'lucide-react'
import UploadZone from './UploadZone'
import EvidenceRepository from './EvidenceRepository'
import ClaimInput from './ClaimInput'
import AnalysisResult from './AnalysisResult'

export default function ResearchWorkspace({ research }) {
  const {
    repository, uploading, uploadProgress, analyzing, analysisResult,
    error, claim, selectedIds,
    setClaim, clearError, uploadFile, deleteItem, clearAll,
    toggleSelect, selectAll, analyzeClaim, setAnalysisResult,
  } = research

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:h-full lg:max-h-[calc(100vh-120px)]">

      {/* ── LEFT: Upload + Repository ── */}
      <div className="flex flex-col gap-4 overflow-y-auto min-h-0 pr-1">

        {/* Upload Zone */}
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-4">
            <UploadIcon size={14} className="text-electric-400" />
            <p className="section-label mb-0">Upload Evidence</p>
          </div>
          <UploadZone
            onUpload={uploadFile}
            uploading={uploading}
            progress={uploadProgress}
          />
        </div>

        {/* Evidence Repository */}
        <div className="glass p-4 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Database size={14} className="text-violet-400" />
            <p className="section-label mb-0">Evidence Repository</p>
            {repository.length > 0 && (
              <span className="ml-auto text-xs text-slate-500 bg-navy-900/60 px-2 py-0.5 rounded-full border border-white/5">
                {selectedIds.length}/{repository.length} selected
              </span>
            )}
          </div>
          <EvidenceRepository
            repository={repository}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            onDelete={deleteItem}
            onSelectAll={selectAll}
            onClearAll={clearAll}
          />
        </div>

        {/* LocalStorage notice */}
        <div className="flex items-start gap-2 text-xs text-slate-600 px-1">
          <Info size={11} className="flex-shrink-0 mt-0.5" />
          <span>Documents are saved to your browser's local storage and persist between sessions.</span>
        </div>
      </div>

      {/* ── RIGHT: Claim input + Results ── */}
      <div className="flex flex-col gap-4 overflow-y-auto min-h-0 pr-1">

        {/* Claim Input */}
        <ClaimInput
          claim={claim}
          onChange={setClaim}
          onAnalyze={analyzeClaim}
          analyzing={analyzing}
          selectedCount={selectedIds.length}
          error={error}
        />

        {/* Loading skeleton while analyzing */}
        {analyzing && !analysisResult && (
          <div className="glass p-6 animate-pulse flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-32 h-32 rounded-full bg-navy-700/60" />
              <div className="flex-1 flex flex-col gap-3">
                <div className="h-3 bg-navy-700/60 rounded-full w-3/4" />
                <div className="h-3 bg-navy-700/60 rounded-full w-full" />
                <div className="h-3 bg-navy-700/60 rounded-full w-2/3" />
              </div>
            </div>
            <div className="h-24 bg-navy-700/40 rounded-xl" />
            <div className="h-20 bg-violet-500/10 rounded-xl" />
            <p className="text-xs text-slate-500 text-center">
              AI is scanning all selected evidence documents…
            </p>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && !analyzing && (
          <AnalysisResult
            result={analysisResult}
            onReset={() => setAnalysisResult(null)}
          />
        )}

        {/* Empty state */}
        {!analyzing && !analysisResult && (
          <div className="glass p-8 flex flex-col items-center justify-center text-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-500/15 to-violet-500/15
                            border border-electric-500/15 flex items-center justify-center">
              <span className="text-2xl">🔬</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Ready to Verify</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Upload your research documents on the left, select the ones you want to use,
                type your claim above, and click <strong className="text-white">Analyze Claim with AI</strong>.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2">
              {[
                { icon: '📄', label: 'Upload Docs' },
                { icon: '✏️', label: 'Enter Claim' },
                { icon: '🤖', label: 'AI Analyzes' },
              ].map(s => (
                <div key={s.label} className="glass-sm p-3 text-center">
                  <div className="text-lg mb-1">{s.icon}</div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
