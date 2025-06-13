'use client'
import App from '@/layout/app'
import { Coffee, Utensils, Cookie, Clock } from 'lucide-react'

export default function ActivityList({ foods }) {
  // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10)

  // Format tanggal jika belum dalam format YYYY-MM-DD
  const formattedFoods = foods.map(food => ({
    ...food,
    tanggal_formatted: new Date(food.tanggal).toISOString().slice(0, 10)
  }))

  // Filter hanya makanan hari ini
  const todayFoods = formattedFoods.filter(food => food.tanggal_formatted === today)

  // Mapping data jadi format "activity"
  const activities = todayFoods.map((food) => ({
    id: food.id,
    time: food.waktu || '-', // fallback
    activity: `${food.kategori} - ${food.nama}`,
    calories: `${food.kalori} kal`,
    type: food.kategori.toLowerCase(),
    description: food.deskripsi || 'Tidak ada deskripsi',
  }))

  const getIcon = (type) => {
    switch (type) {
      case 'breakfast': return Coffee
      case 'lunch': return Utensils
      case 'snack': return Cookie
      default: return Utensils
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'breakfast': return 'text-orange-500 bg-orange-50'
      case 'lunch': return 'text-green-500 bg-green-50'
      case 'snack': return 'text-purple-500 bg-purple-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const totalCalories = activities.reduce((total, activity) => {
    return total + parseInt(activity.calories.replace(' kal', ''))
  }, 0)

  return (
    <App>
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock size={24} className="text-purple-600" />
            Aktivitas Terbaru
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Total hari ini: <span className="font-semibold text-purple-600">{totalCalories} kalori</span>
          </p>
        </div>  
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((item) => {
            const Icon = getIcon(item.type)
            const iconColorClass = getIconColor(item.type)
            
            return (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColorClass}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-gray-900">
                      {item.activity}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-purple-600">{item.calories}</span>
                  <button className="block text-xs text-gray-500 hover:text-purple-600 mt-1">
                    Edit
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <Coffee size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Belum ada aktivitas hari ini</p>
            <p className="text-gray-400 text-sm">Mulai tambahkan makanan yang Anda konsumsi</p>
          </div>
        )}
      </div>
    </div>
    </App>
  );
}
