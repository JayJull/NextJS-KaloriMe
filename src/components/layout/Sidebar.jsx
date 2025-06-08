'use client'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Activity, FileText, Camera, Settings, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { signOut } from "next-auth/react"

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Makanan', icon: Activity, path: '/makanan' },
    { name: 'Scan / Upload', icon: Camera, path: '/upload' },
    { name: 'Laporan', icon: FileText, path: '/laporan' },
    { name: 'Pengaturan', icon: Settings, path: '/pengaturan' }
  ]

  // Atur active menu berdasarkan pathname
  useEffect(() => {
    if (!activeMenu) {
      const currentMenu = menuItems.find(item => item.path === pathname)
      if (currentMenu) {
        setActiveMenu(currentMenu.name)
      }
    }
  }, [pathname, menuItems, activeMenu])

  // Atur sidebarOpen berdasarkan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768) // md: 768px
    }

    handleResize() // Set awal saat component mount
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMenuClick = (item) => {
    setActiveMenu(item.name)
    router.push(item.path)
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    // router.push('/login')
  }

  return (
    <div
      className={clsx(
        'bg-white shadow-sm flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 flex justify-center items-center">
        <Image
          src={sidebarOpen ? '/images/KaloriME2.png' : '/images/Logo KaloriME.png'}
          alt="Logo KaloriME"
          width={sidebarOpen ? 200 : 60}
          height={60}
          priority
        />
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.name
            return (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={clsx(
                    'w-full flex items-center px-3 py-2 rounded-lg transition-colors lg:text-md xl:text-xl',
                    isActive
                      ? 'bg-teal-100 text-teal-600 border-r-4 border-teal-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  )}
                >
                  <Icon size={20} />
                  {sidebarOpen && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={() => signOut({callbackUrl: '/'})}
          className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={20} />
          {sidebarOpen && (
            <span className="ml-3 font-medium">Keluar</span>
          )}
        </button>
      </div>
    </div>
  )
}
