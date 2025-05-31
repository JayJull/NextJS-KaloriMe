'use client'
import { TrendingUp, Calendar } from 'lucide-react'

export default function ProgressChart() {
  // Sample data untuk 7 hari terakhir
  const weekData = [
    { day: 'Sen', calories: 1850, target: 2000 },
    { day: 'Sel', calories: 1920, target: 2000 },
    { day: 'Rab', calories: 1750, target: 2000 },
    { day: 'Kam', calories: 2100, target: 2000 },
    { day: 'Jum', calories: 1880, target: 2000 },
    { day: 'Sab', calories: 2200, target: 2000 },
    { day: 'Min', calories: 1250, target: 2000 }, // Hari ini
  ]

  const maxCalories = Math.max(...weekData.map(d => Math.max(d.calories, d.target)))

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={24} className="text-purple-600" />
            Progress Mingguan
          </h2>
          <p className="text-gray-600 text-sm mt-1">Kalori harian selama 7 hari terakhir</p>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors">
          Lihat Detail
        </button>
      </div>
      
      {/* Chart */}
      <div className="h-64 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-4">
          <span>{maxCalories}</span>
          <span>{Math.round(maxCalories * 0.75)}</span>
          <span>{Math.round(maxCalories * 0.5)}</span>
          <span>{Math.round(maxCalories * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full flex items-end justify-between gap-2">
          {weekData.map((data, index) => {
            const isToday = index === weekData.length - 1
            const calorieHeight = (data.calories / maxCalories) * 100
            const targetHeight = (data.target / maxCalories) * 100

            return (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                {/* Bar container */}
                <div className="relative w-full h-48 flex items-end justify-center">
                  {/* Target line */}
                  <div 
                    className="absolute w-full border-t-2 border-dashed border-gray-300"
                    style={{ bottom: `${targetHeight}%` }}
                  />
                  
                  {/* Actual calories bar */}
                  <div 
                    className={`w-8 rounded-t-md transition-all duration-500 ${
                      isToday 
                        ? 'bg-gradient-to-t from-purple-500 to-purple-400' 
                        : data.calories >= data.target
                        ? 'bg-gradient-to-t from-green-500 to-green-400'
                        : 'bg-gradient-to-t from-blue-500 to-blue-400'
                    }`}
                    style={{ height: `${calorieHeight}%` }}
                  />
                </div>

                {/* Day label */}
                <span className={`text-xs font-medium ${
                  isToday ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {data.day}
                </span>

                {/* Calories value */}
                <span className="text-xs text-gray-500">
                  {data.calories}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></div>
          <span className="text-xs text-gray-600">Kalori Aktual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded"></div>
          <span className="text-xs text-gray-600">Target Tercapai</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded"></div>
          <span className="text-xs text-gray-600">Hari Ini</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 border-t-2 border-dashed border-gray-400"></div>
          <span className="text-xs text-gray-600">Target Harian</span>
        </div>
      </div>
    </div>
  )
}