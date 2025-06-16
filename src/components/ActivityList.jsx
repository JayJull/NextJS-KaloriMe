"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Clock, Utensils, Trash2 } from "lucide-react";

export default function ActivityList({ selectedDate }) {
  const { data: session } = useSession();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format date for API calls with proper timezone handling
  const formatDateForAPI = (date) => {
    if (!date) return new Date().toISOString().split("T")[0];

    // Handle Date objects
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Handle strings
    if (typeof date === "string") {
      // If already YYYY-MM-DD format, return as is
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      // Convert string to Date first
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Fallback to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch food consumption for selected date
  const fetchActivities = async () => {
    if (!session?.user?.email || !selectedDate) {
      setLoading(false);
      return;
    }

    const dateString = formatDateForAPI(selectedDate);
    console.log(
      "ActivityList: Fetching activities for date:",
      dateString,
      "Original selectedDate:",
      selectedDate
    );
    setLoading(true);

    try {
      const response = await fetch(`/api/food/consumption?date=${dateString}`);
      if (response.ok) {
        const data = await response.json();
        console.log("ActivityList: Activities fetched:", data.data);
        setActivities(data.data || []);
      } else {
        console.error("Failed to fetch activities:", response.status);
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect runs when session or selectedDate changes
  useEffect(() => {
    console.log("ActivityList useEffect triggered", {
      session: !!session,
      selectedDate,
      formattedDate: formatDateForAPI(selectedDate),
    });
    fetchActivities();
  }, [session?.user?.email, selectedDate]);

  // Check if selected date is today
  const isToday = () => {
    if (!selectedDate) return true;

    const today = new Date();
    const todayString = formatDateForAPI(today);
    const selectedString = formatDateForAPI(selectedDate);
    return selectedString === todayString;
  };

  const selectedDateFormatted = (() => {
    try {
      if (!selectedDate) {
        return new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      let dateObj = selectedDate;
      if (typeof selectedDate === "string") {
        dateObj = new Date(selectedDate + "T00:00:00");
      }

      return dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  })();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Aktivitas {isToday() ? "Hari Ini" : selectedDateFormatted}
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Aktivitas {isToday() ? "Hari Ini" : selectedDateFormatted}
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">
            {isToday()
              ? "Belum ada makanan yang dicatat hari ini"
              : "Tidak ada makanan yang dicatat pada tanggal ini"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <img
                  src={activity.foto || "/placeholder-food.jpg"}
                  alt={activity.nama_makanan}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.nama_makanan}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{activity.waktu}</span>
                  <span>•</span>
                  <span>{activity.kategori}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-blue-600">
                  {activity.kalori} kal
                </span>
              </div>
            </div>
          ))}

          {/* Total calories */}
          <div className="border-t pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total Kalori:
              </span>
              <span className="text-lg font-bold text-blue-600">
                {activities.reduce(
                  (total, activity) => total + (activity.kalori || 0),
                  0
                )}{" "}
                kal
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
