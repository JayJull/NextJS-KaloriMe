'use client'

import App from '@/layout/app'
import StatCard from '@/components/StatCard'
import ActivityList from '@/components/ActivityList'
import { TrendingUp, Target, Calendar, Coffee } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') // Ambil userId dari URL

  const statsData = [
    {
      title: "Kalori Hari Ini",
      value: "1250",
      subtitle: "dari 2000 target",
      color: "#3B82F6",
      icon: TrendingUp,
      progress: 62.5
    },
    {
      title: "Sisa Kalori",
      value: "750",
      subtitle: "kalori tersisa",
      color: "#10B981",
      icon: Target
    },
    {
      title: "Rata-rata Minggu",
      value: "1843",
      subtitle: "kalori/hari",
      color: "#F59E0B",
      icon: Calendar
    },
    {
      title: "Makanan Hari Ini",
      value: "3",
      subtitle: "item makanan",
      color: "#8B5CF6",
      icon: Coffee
    }
  ]

  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await fetch(`/api/food/upload?userId=${userId}&type=foods`)
        const data = await res.json()
        if (data.success) {
          setFoods(data.data)
        } else {
          console.error("Gagal memuat data:", data.message)
        }
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchFoods()
  }, [userId])

  return (
    <App title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Aktivitas Makanan Hari Ini */}
        {loading ? (
          <p className="text-gray-500">Memuat aktivitas makanan...</p>
        ) : (
          <ActivityList foods={foods} />
        )}
      </div>
    </App>
  )
}
