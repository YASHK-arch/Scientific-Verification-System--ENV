import { useEffect, useState } from 'react'
import { AlertCircle, X, Loader2, Microscope, FlaskConical, Upload } from 'lucide-react'

import { useEnvironment } from './hooks/useEnvironment'
import { useResearch } from './hooks/useResearch'
import Header from './components/Header'
import ClaimCard from './components/ClaimCard'
import EvidencePanel from './components/EvidencePanel'
import EvidenceDetail from './components/EvidenceDetail'
import ActionBar from './components/ActionBar'
import Scratchpad from './components/Scratchpad'
import VerdictPanel from './components/VerdictPanel'
import RewardTracker from './components/RewardTracker'
import GraderResult from './components/GraderResult'
import StepTimeline from './components/StepTimeline'
import AutoPlayModal from './components/AutoPlayModal'
import ResearchWorkspace from './components/ResearchWorkspace'

// ── Mode tab config ──
const MODES = [
  { key: 'research', label: 'Research Mode', Icon: Upload, desc: 'Upload your own documents & verify custom claims' },
  { key: 'demo',    label: 'Demo Mode',     Icon: FlaskConical, desc: 'Try built-in scenarios to test the model' },
]

export default function App() {
  const env = useEnvironment()
  const research = useResearch()

  const [mode, setMode] = useState('research')
  const [selectedTask, setSelectedTask] = useState('')
  const [detailEvidence, setDetailEvidence] = useState(null)
  const [showAutoPlay, setShowAutoPlay] = useState(false)
  const [activeSection, setActiveSection] = useState('evidence')

  useEffect(() => {
    env.checkHealth()
    env.loadScenarios()
  }, [])

  const handleReset = async () => {
    if (!selectedTask) return
    setDetailEvidence(null)
    setShowAutoPlay(false)
    await env.resetEnv(selectedTask)
  }

  const handleViewDetail = (ev) => {
    if (ev && env.observation?.evaluated_evidence?.[ev.id]) {
      setDetailEvidence({ ...ev, content: env.observation.evaluated_evidence[ev.id] })
    }
  }

  const handleAutoPlay = () => {
    if (env.autoPlaying) env.stopAutoPlay()
    else setShowAutoPlay(true)
  }

  const handleStartAutoPlay = async () => {
    setShowAutoPlay(false)
    await env.startAutoPlay()
  }

  const obs = env.observation

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Header (demo mode only shows full controls) ── */}
      <Header
        scenarios={env.scenarios}
        selectedTask={selectedTask}
        onSelectTask={setSelectedTask}
        onReset={handleReset}
        backendOnline={env.backendOnline}
        autoPlaying={env.autoPlaying}
        onAutoPlay={handleAutoPlay}
        observation={obs}
        mode={mode}
      />

      {/* ── Mode Tabs ── */}
      <div className="px-4 lg:px-6 pt-3">
        <div className="flex gap-1 p-1 glass-sm rounded-xl w-fit">
          {MODES.map(m => {
            const { Icon } = m
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${mode === m.key
                    ? m.key === 'research'
                      ? 'bg-gradient-to-r from-electric-500 to-violet-500 text-white shadow-lg'
                      : 'bg-navy-700 text-white'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Icon size={14} />
                {m.label}
                {m.key === 'research' && (
                  <span className="text-xs px-1.5 py-0.5 bg-white/20 rounded-full">Main</span>
                )}
              </button>
            )
          })}
        </div>
        {/* Mode description */}
        <p className="text-xs text-slate-600 mt-1.5 px-1">
          {MODES.find(m => m.key === mode)?.desc}
        </p>
      </div>

      {/* ── Error banner ── */}
      {(env.error) && (
        <div className="mx-4 lg:mx-6 mt-3 flex items-center gap-3 px-4 py-3
                        bg-rose-500/10 border border-rose-500/20 rounded-xl animate-slide-up">
          <AlertCircle size={15} className="text-rose-400 flex-shrink-0" />
          <p className="text-xs text-rose-300 flex-1">{env.error}</p>
          <button onClick={env.clearError}><X size={14} className="text-rose-400" /></button>
        </div>
      )}

      {/* ── Loading indicator ── */}
      {env.loading && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 glass-sm border border-electric-500/20 rounded-full">
            <Loader2 size={14} className="text-electric-400 animate-spin" />
            <span className="text-xs text-slate-300">Processing…</span>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto lg:overflow-hidden flex flex-col">

        {/* ════ RESEARCH MODE ════ */}
        {mode === 'research' && (
          <ResearchWorkspace research={research} />
        )}

        {/* ════ DEMO MODE ════ */}
        {mode === 'demo' && (
          !obs ? (
            /* Welcome screen */
            <div className="flex flex-col items-center justify-center h-full min-h-[55vh] text-center gap-6 animate-fade-in">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-500/20 to-violet-500/20
                              border border-electric-500/20 flex items-center justify-center">
                <Microscope size={36} className="text-electric-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Demo Mode</h1>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  Select one of the <strong className="text-white">10 built-in scenarios</strong> to test the
                  claim verification model. These are starter examples — for your own research,
                  switch to <strong className="text-white">Research Mode</strong>.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-sm">
                {[
                  { diff: 'Easy', desc: '4 scenarios', cls: 'badge-easy' },
                  { diff: 'Medium', desc: '3 scenarios', cls: 'badge-medium' },
                  { diff: 'Hard', desc: '3 scenarios', cls: 'badge-hard' },
                ].map(d => (
                  <div key={d.diff} className="glass-sm p-3 text-center">
                    <span className={d.cls}>{d.diff}</span>
                    <p className="text-xs text-slate-500 mt-1.5">{d.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600">
                {env.backendOnline === false
                  ? '⚠️ Backend offline — run: python -m uvicorn backend.server.app:app --port 8000'
                  : env.backendOnline === true ? '✅ Backend connected' : '⏳ Checking backend…'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop 3-col */}
              <div className="hidden lg:grid lg:grid-cols-[280px_1fr_300px] gap-4 h-full"
                style={{ maxHeight: 'calc(100vh - 160px)' }}>
                <div className="flex flex-col gap-4 overflow-hidden min-h-0 pr-1">
                  <EvidencePanel observation={obs} onEvaluate={env.evaluateEvidence}
                    loading={env.loading} onViewDetail={handleViewDetail} />
                </div>
                <div className="flex flex-col gap-4 overflow-y-auto min-h-0 pr-1">
                  <ClaimCard observation={obs} />
                  <Scratchpad notes={obs.agent_notes} onSaveNotes={env.updateNotes} loading={env.loading} />
                  <StepTimeline observation={obs} />
                </div>
                <div className="flex flex-col gap-4 overflow-y-auto min-h-0 pr-1">
                  <ActionBar observation={obs} onActionClick={(k) => {
                    if (k === 'evidence') setActiveSection('evidence')
                    else if (k === 'notes') setActiveSection('notes')
                    else setActiveSection('verdict')
                  }} />
                  <VerdictPanel observation={obs} onSetVerdict={env.setVerdict}
                    onFinalize={env.finalize} loading={env.loading} />
                  <RewardTracker observation={obs} />
                </div>
              </div>

              {/* Mobile tabs */}
              <div className="lg:hidden flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <ClaimCard observation={obs} />
                <div className="flex gap-1 p-1 glass-sm rounded-xl">
                  {['evidence','notes','verdict','timeline'].map(tab => (
                    <button key={tab} onClick={() => setActiveSection(tab)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                        ${activeSection === tab ? 'bg-electric-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
                {activeSection === 'evidence' && <>
                  <ActionBar observation={obs} onActionClick={k => setActiveSection(k === 'evaluate' ? 'evidence' : k === 'notes' ? 'notes' : 'verdict')} />
                  <EvidencePanel observation={obs} onEvaluate={env.evaluateEvidence} loading={env.loading} onViewDetail={handleViewDetail} />
                </>}
                {activeSection === 'notes' && <Scratchpad notes={obs.agent_notes} onSaveNotes={env.updateNotes} loading={env.loading} />}
                {activeSection === 'verdict' && <>
                  <VerdictPanel observation={obs} onSetVerdict={env.setVerdict} onFinalize={env.finalize} loading={env.loading} />
                  <RewardTracker observation={obs} />
                </>}
                {activeSection === 'timeline' && <StepTimeline observation={obs} />}
              </div>
            </>
          )
        )}
      </main>

      {/* ── Status bar (demo mode only) ── */}
      {obs && mode === 'demo' && (
        <div className="border-t border-white/5 px-4 lg:px-6 py-2 flex items-center gap-4 text-xs text-slate-600 flex-wrap">
          <span>Task: <span className="text-slate-400 font-mono">{env.state?.task_id}</span></span>
          <span>Step: <span className="text-slate-400 font-mono">{obs.step_count}/{obs.max_steps}</span></span>
          <span>Reward: <span className={`font-mono font-medium ${obs.cumulative_reward >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {obs.cumulative_reward >= 0 ? '+' : ''}{obs.cumulative_reward.toFixed(3)}
          </span></span>
          <span>Status:
            <span className={`ml-1 font-medium capitalize
              ${obs.current_status === 'supported' ? 'text-emerald-400'
                : obs.current_status === 'unsupported' ? 'text-rose-400'
                : obs.current_status === 'inconclusive' ? 'text-amber-400'
                : 'text-slate-500'}`}>
              ● {obs.current_status}
            </span>
          </span>
          {obs.done && <span className="text-amber-400 font-medium">● Episode Complete</span>}
          {env.autoPlaying && (
            <span className="text-violet-400 flex items-center gap-1 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI Auto-Playing…
            </span>
          )}
        </div>
      )}

      {/* ── Overlays ── */}
      {detailEvidence && (
        <EvidenceDetail evidence={detailEvidence} content={detailEvidence.content}
          onClose={() => setDetailEvidence(null)} />
      )}
      {showAutoPlay && (
        <AutoPlayModal isActive={env.autoPlaying} observation={obs}
          onStart={handleStartAutoPlay} onStop={env.stopAutoPlay}
          onClose={() => setShowAutoPlay(false)} />
      )}
      {env.gradeResult && mode === 'demo' && (
        <GraderResult result={env.gradeResult} onPlayAgain={() => env.resetEnv(selectedTask)} />
      )}
    </div>
  )
}
