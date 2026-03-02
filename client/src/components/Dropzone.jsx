import { useCallback, useRef, useState } from 'react'
import Card from './ui/Card.jsx'
import Button from './ui/Button.jsx'
import { cn } from '../utils/cn.jsx'

function formatBytes(bytes) {
  const b = Number(bytes) || 0
  if (b < 1024) return `${b} B`
  const kb = b / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

export default function Dropzone({
  title = 'Upload resume',
  description = 'Drag & drop a PDF/DOCX, or browse',
  accept = '.pdf,.doc,.docx',
  file,
  onFile,
  disabled,
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const pick = useCallback(() => {
    if (disabled) return
    inputRef.current?.click()
  }, [disabled])

  const handleFiles = useCallback(
    (files) => {
      const f = files?.[0]
      if (!f) return
      onFile?.(f)
    },
    [onFile]
  )

  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        dragOver ? 'ring-2 ring-indigo-500/40' : ''
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        className={cn(
          'rounded-xl border border-dashed border-slate-300/70 dark:border-slate-600/60 p-5',
          'bg-white/40 dark:bg-slate-950/20 backdrop-blur',
          disabled ? 'opacity-60' : ''
        )}
        onDragEnter={(e) => {
          e.preventDefault()
          if (disabled) return
          setDragOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (disabled) return
          setDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragOver(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (disabled) return
          handleFiles(e.dataTransfer.files)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') pick()
        }}
        onClick={pick}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {title}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {file ? (
                <span className="inline-flex items-center gap-2">
                  <span className="truncate">{file.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({formatBytes(file.size)})
                  </span>
                </span>
              ) : (
                description
              )}
            </div>
          </div>

          <div className="shrink-0">
            <Button type="button" variant="secondary" size="sm" onClick={pick} disabled={disabled}>
              Browse files
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

