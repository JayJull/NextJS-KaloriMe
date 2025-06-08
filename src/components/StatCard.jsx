export default function StatCard({ title, value, subtitle, color, icon: Icon, progress }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2 font-medium">{title}</p>
          <h3 className="text-3xl font-bold mb-1" style={{ color }}>
            {value}
          </h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div 
          className="p-3 rounded-full flex-shrink-0 ml-4" 
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-medium" style={{ color }}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ 
                width: `${Math.min(progress, 100)}%`, 
                background: `linear-gradient(90deg, ${color}, ${color}80)` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}