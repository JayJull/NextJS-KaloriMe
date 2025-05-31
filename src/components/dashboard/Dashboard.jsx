'use client'
import { useState } from 'react'
import Sidebar from '../layout/Sidebar'
import Header from '../layout/Header'

export default function DashboardLayout({ children, title, subtitle }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard')

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}