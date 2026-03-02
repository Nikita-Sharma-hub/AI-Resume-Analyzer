import { cn } from '../../utils/cn.jsx'

export default function Card({ className, children }) {
  return <div className={cn('app-surface rounded-2xl p-5', className)}>{children}</div>
}

