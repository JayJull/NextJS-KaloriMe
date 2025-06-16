import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  color,
  icon: Icon,
  progress,
  loading,
  isExceeded = false,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          {progress !== undefined && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Apply exceeded styling
  const cardBorderColor = isExceeded ? "border-red-200" : "border-gray-100";
  const cardBgColor = isExceeded ? "bg-red-50" : "bg-white";
  const titleColor = isExceeded ? "text-red-700" : "text-gray-600";
  const valueColor = isExceeded ? "text-red-600" : "text-gray-900";
  const subtitleColor = isExceeded ? "text-red-600" : "text-gray-500";
  const iconBgColor = isExceeded ? "bg-red-100" : "bg-gray-100";
  const progressColor = isExceeded ? "#EF4444" : color;

  return (
    <div
      className={`${cardBgColor} rounded-xl p-6 shadow-sm border ${cardBorderColor} transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-medium ${titleColor}`}>
          {isExceeded && title === "Kalori Hari Ini" && "⚠️ "}
          {title}
        </h3>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}
          style={{ backgroundColor: isExceeded ? undefined : color + "20" }}
        >
          <Icon size={20} style={{ color: isExceeded ? "#EF4444" : color }} />
        </div>
      </div>

      <div className={`text-3xl font-bold ${valueColor} mb-1`}>{value}</div>

      <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: progressColor,
              }}
            />
            {/* Show overflow indicator if progress > 100% */}
            {progress > 100 && (
              <div className="relative">
                <div
                  className="absolute top-0 left-0 h-2 bg-red-500 opacity-50 rounded-full animate-pulse"
                  style={{
                    width: `${Math.min(progress - 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
          {progress > 100 && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              Melebihi target {progress - 100}%
            </p>
          )}
        </div>
      )}

      {/* Additional warning for exceeded calories */}
      {isExceeded && title === "Kalori Hari Ini" && (
        <div className="mt-3 p-2 bg-red-100 rounded-lg">
          <p className="text-xs text-red-700 font-medium">
            💡 Hindari makan berlebihan hari ini
          </p>
        </div>
      )}
    </div>
  );
}
