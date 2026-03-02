import { cn } from '../../utils/cn.jsx'

export default function Input({ className, label, hint, error, ...props }) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
          {label}
        </div>
      ) : null}
      <input
        className={cn(
          'h-11 w-full rounded-xl px-3 text-sm outline-none transition app-surface',
          'placeholder:text-slate-400 dark:placeholder:text-slate-400',
          'focus:ring-2 focus:ring-indigo-500/60',
          error ? 'ring-2 ring-rose-500/50' : '',
          className
        )}
        {...props}
      />
      {error ? (
        <div className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">{error}</div>
      ) : hint ? (
        <div className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{hint}</div>
      ) : null}
    </label>
  )
}

