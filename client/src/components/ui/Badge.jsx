import { cn } from '../../utils/cn.jsx'

const styles = {
  success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-200 border-amber-500/20',
  danger: 'bg-rose-500/15 text-rose-700 dark:text-rose-200 border-rose-500/20',
  info: 'bg-sky-500/15 text-sky-700 dark:text-sky-200 border-sky-500/20',
  neutral:
    'bg-slate-500/10 text-slate-700 dark:text-slate-200 border-slate-500/15',
}

export default function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        styles[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

