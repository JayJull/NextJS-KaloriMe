'use client'
import { Coffee, Utensils, Cookie, Plus, Clock } from 'lucide-react'

export default function ActivityList() {
  const activities = [
    { 
      id: 1,
      time: '08:30', 
      activity: 'Sarapan - Nasi Gudeg', 
      calories: '420 kal',
      type: 'breakfast',
      description: 'Nasi gudeg dengan ayam dan telur'
    },
    { 
      id: 2,
      time: '12:15', 
      activity: 'Makan Siang - Ayam Bakar', 
      calories: '650 kal',
      type: 'lunch',
      description: 'Ayam bakar dengan nasi dan lalapan'
    },
    { 
      id: 3,
      time: '15:45', 
      activity: 'Snack - Pisang Goreng', 
      calories: '180 kal',
      type: 'snack',
      description: 'Pisang goreng dengan teh manis'
    }
  ]

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
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          Tambah Makanan
        </button>
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

      {/* Quick Add Section */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-3">Tambah Cepat:</p>
        <div className="flex flex-wrap gap-2">
          {['Nasi Putih', 'Ayam Goreng', 'Sayur Bayam', 'Teh Manis', 'Pisang'].map((food) => (
            <button
              key={food}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-purple-100 hover:text-purple-600 transition-colors"
            >
              + {food}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}