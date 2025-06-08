'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import Sidebar from '../layout/Sidebar'
import Header from '../layout/Header'

export default function DashboardLayout({ children, title, subtitle }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto p-4">
          <div className="mb-4 text-gray-700">
            Selamat datang, <strong>{session?.user?.name}</strong>!
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
