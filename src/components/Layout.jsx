import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <main
        className={`
          flex-1 min-h-screen overflow-x-hidden
          transition-all duration-300 ease-in-out
          ${collapsed ? 'ml-[72px]' : 'ml-[260px]'}
        `}
      >
        <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
