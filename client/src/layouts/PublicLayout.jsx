import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-full">
      <div className="app-gradient fixed inset-0 -z-10" aria-hidden="true" />
      <Outlet />
    </div>
  )
}

