import { cn } from '../../utils/cn.jsx'

export default function ProgressBar({ value = 0, className, tone = 'indigo' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0))
  const toneClass =
    tone === 'emerald'
      ? 'from-emerald-500 to-cyan-400'
      : tone === 'amber'
        ? 'from-amber-500 to-rose-400'
        : 'from-indigo-500 to-fuchsia-400'

  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-200/70 dark:bg-slate-800/60', className)}>
      <div
        className={cn('h-2 rounded-full bg-gradient-to-r transition-all', toneClass)}
        style={{ width: `${v}%` }}
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  )
}

