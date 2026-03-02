import { cn } from '../../utils/cn.jsx'

export default function Button({
  as: Comp = 'button',
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/20',
    secondary:
      'app-surface text-slate-800 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-900/60',
    ghost:
      'text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/40',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-600/20',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  return (
    <Comp
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
          <span>Loading</span>
        </span>
      ) : (
        children
      )}
    </Comp>
  )
}

