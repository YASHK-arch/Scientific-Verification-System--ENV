import { useCallback, useState } from 'react'
import { Upload, FileText, Database, File, X, Loader2 } from 'lucide-react'

const ACCEPTED = { pdf: 'application/pdf', csv: 'text/csv', json: 'application/json', txt: 'text/plain' }
const EXT_ICON = { pdf: FileText, csv: Database, json: Database, txt: File }
const EXT_COLOR = { pdf: 'text-rose-400', csv: 'text-violet-400', json: 'text-violet-400', txt: 'text-slate-400' }

export default function UploadZone({ onUpload, uploading, progress }) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(f => onUpload(f))
  }, [onUpload])

  const handleInput = (e) => {
    Array.from(e.target.files || []).forEach(f => onUpload(f))
    e.target.value = ''
  }

  return (
    <div>
      <label
        htmlFor="file-upload"
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed
                    cursor-pointer transition-all duration-300
                    ${dragging
                      ? 'border-electric-500 bg-electric-500/10 scale-[1.02]'
                      : 'border-white/10 bg-navy-900/40 hover:border-electric-500/40 hover:bg-navy-800/60'
                    }`}
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="text-electric-400 animate-spin" />
            <div className="w-full max-w-[160px]">
              <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-electric-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-center text-slate-400 mt-1">{progress}%</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-electric-500/10 flex items-center justify-center">
              <Upload size={20} className="text-electric-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-200">Drop files or click to upload</p>
              <p className="text-xs text-slate-500 mt-1">PDF, CSV, JSON, TXT supported</p>
            </div>
          </>
        )}
      </label>
      <input id="file-upload" type="file" multiple className="hidden"
        accept=".pdf,.csv,.json,.txt" onChange={handleInput} disabled={uploading} />

      {/* File type chips */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {Object.entries(EXT_ICON).map(([ext, Icon]) => (
          <span key={ext} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full
            bg-navy-900/60 border border-white/5 ${EXT_COLOR[ext]}`}>
            <Icon size={10} />.{ext}
          </span>
        ))}
      </div>
    </div>
  )
}
