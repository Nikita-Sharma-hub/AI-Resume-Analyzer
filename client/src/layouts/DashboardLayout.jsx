import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-full">
      <div className="app-gradient fixed inset-0 -z-10" aria-hidden="true" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <Navbar onMenu={() => setSidebarOpen(true)} />
        <main className="app-container py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

