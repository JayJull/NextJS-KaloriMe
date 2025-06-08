'use client'
import { useState } from 'react'
import { Search, Bell, User, Menu } from 'lucide-react'

export default function Header({ title, subtitle }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
              />
            </form>

            {/* Mobile Search Button */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 md:hidden">
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={handleNotificationClick}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-800">Target kalori hari ini hampir tercapai!</p>
                      <p className="text-xs text-gray-500 mt-1">2 jam yang lalu</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-800">Jangan lupa sarapan sehat!</p>
                      <p className="text-xs text-gray-500 mt-1">1 hari yang lalu</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">Laporan mingguan sudah tersedia</p>
                      <p className="text-xs text-gray-500 mt-1">2 hari yang lalu</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <button className="text-sm text-teal-600 hover:text-teal-700">
                      Lihat semua notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <button 
              onClick={handleProfileClick}
              className="flex items-center space-x-2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <User size={20} />
              <span className="hidden md:block text-sm font-medium">Mohamad Joko</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}