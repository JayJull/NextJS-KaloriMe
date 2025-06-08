'use client'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Activity, FileText, Camera, Settings, LogOut } from 'lucide-react'
import { useEffect } from 'react'

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Makanan', icon: Activity, path: '/makanan' },
    { name: 'Laporan', icon: FileText, path: '/laporan' },
    { name: 'Pengaturan', icon: Settings, path: '/pengaturan' }
  ]

  // Update active menu berdasarkan pathname
  useEffect(() => {
    const currentMenu = menuItems.find(item => item.path === pathname)
    if (currentMenu) {
      setActiveMenu(currentMenu.name)
    }
  }, [pathname, setActiveMenu])

  const handleMenuClick = (item) => {
    setActiveMenu(item.name)
    router.push(item.path)
  }

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked')
    // router.push('/login')
  }

  return (
    <div className="w-64 bg-white shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-bold text-gray-800">KaloriMe</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.name
            
            return (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-teal-100 text-teal-600 border-r-2 border-teal-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  )
}