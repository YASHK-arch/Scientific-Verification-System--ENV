import { FileText, Database, File, Trash2, CheckSquare, Square, Trash } from 'lucide-react'

const TYPE_ICON = {
  paper_summary: FileText,
  dataset_snippet: Database,
  trial_outcome: File,
}
const TYPE_COLOR = {
  paper_summary: 'text-electric-400',
  dataset_snippet: 'text-violet-400',
  trial_outcome: 'text-amber-400',
}
const EXT_BADGE = {
  pdf: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  csv: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  json: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  txt: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

export default function EvidenceRepository({ repository, selectedIds, onToggle, onDelete, onSelectAll, onClearAll }) {
  if (repository.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
      <Database size={28} className="text-slate-700" />
      <p className="text-xs text-slate-600">No documents yet.<br />Upload research files above.</p>
    </div>
  )

  const allSelected = repository.every(r => selectedIds.includes(r.id))

  return (
    <div className="flex flex-col gap-2">
      {/* Controls */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{repository.length} document{repository.length !== 1 ? 's' : ''}</span>
        <div className="flex gap-2">
          <button onClick={onSelectAll}
            className="text-xs text-electric-400 hover:text-electric-300 transition-colors">
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
          <button onClick={onClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
            <Trash size={10} /> Clear all
          </button>
        </div>
      </div>

      {/* Item list */}
      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
        {repository.map((item) => {
          const selected = selectedIds.includes(item.id)
          const Icon = TYPE_ICON[item.type] || File
          const iconCls = TYPE_COLOR[item.type] || 'text-slate-400'
          const extCls = EXT_BADGE[item.ext] || EXT_BADGE.txt

          return (
            <div
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer
                          transition-all duration-200
                          ${selected
                            ? 'border-electric-500/30 bg-electric-500/8'
                            : 'border-white/5 bg-navy-900/40 hover:bg-navy-800/50'
                          }`}
            >
              {/* Checkbox */}
              <div className="flex-shrink-0 mt-0.5">
                {selected
                  ? <CheckSquare size={15} className="text-electric-400" />
                  : <Square size={15} className="text-slate-600" />
                }
              </div>

              {/* Icon */}
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className={iconCls} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${extCls}`}>
                    .{item.ext}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-snug">{item.preview}</p>
                <p className="text-xs text-slate-700 mt-0.5">{fmtSize(item.size)}</p>
              </div>

              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
                className="flex-shrink-0 w-6 h-6 rounded-lg bg-rose-500/0 hover:bg-rose-500/15
                           flex items-center justify-center transition-colors"
              >
                <Trash2 size={11} className="text-rose-500/50 hover:text-rose-400" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
