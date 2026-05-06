import { cn } from '../utils/cn.jsx'

export default function Loader({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600',
        sizeClasses[size],
        className
      )}
    />
  )
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
}

export function InlineLoader({ message = 'Loading...', showText = true }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader size="sm" />
      {showText && <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>}
    </div>
  )
}
