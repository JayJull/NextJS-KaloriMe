"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import App from "@/layout/app";
import StatCard from "@/components/StatCard";
import ActivityList from "@/components/ActivityList";
import { TrendingUp, Target, Calendar, Coffee } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  // Initialize with today's date properly
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [statsData, setStatsData] = useState([
    {
      title: "Kalori Hari Ini",
      value: "0",
      subtitle: "dari 0 target",
      color: "#3B82F6",
      icon: TrendingUp,
      progress: 0,
    },
    {
      title: "Sisa Kalori",
      value: "0",
      subtitle: "kalori tersisa",
      color: "#10B981",
      icon: Target,
    },
    {
      title: "Rata-rata Minggu",
      value: "0",
      subtitle: "kalori/hari",
      color: "#F59E0B",
      icon: Calendar,
    },
    {
      title: "Makanan Hari Ini",
      value: "0",
      subtitle: "item makanan",
      color: "#8B5CF6",
      icon: Coffee,
    },
  ]);
  const [loading, setLoading] = useState(true);

  // Helper function to convert Date to YYYY-MM-DD string with proper timezone handling
  const formatDateForAPI = (date) => {
    if (!date) return new Date().toISOString().split("T")[0];

    if (typeof date === "string") {
      // If already YYYY-MM-DD format, return as is
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      date = new Date(date);
    }

    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch user profile data to get target calories
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile/update");
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Fetch food consumption data for selected date
  const fetchFoodConsumption = async (date) => {
    try {
      const dateString = formatDateForAPI(date);
      console.log("Fetching consumption for date:", dateString);
      const response = await fetch(`/api/food/consumption?date=${dateString}`);
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching food consumption:", error);
      return [];
    }
  };

  // Fetch weekly average consumption
  const fetchWeeklyAverage = async (currentDate) => {
    try {
      const dates = [];
      const baseDate = new Date(currentDate);

      for (let i = 6; i >= 0; i--) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() - i);
        dates.push(formatDateForAPI(date));
      }

      const weeklyData = await Promise.all(
        dates.map((date) => fetchFoodConsumption(date))
      );

      const dailyTotals = weeklyData.map((dayData) =>
        dayData.reduce((total, item) => total + (item.kalori || 0), 0)
      );

      const totalCalories = dailyTotals.reduce((sum, daily) => sum + daily, 0);
      const average = Math.round(totalCalories / 7);

      return average;
    } catch (error) {
      console.error("Error calculating weekly average:", error);
      return 0;
    }
  };

  // Update stats data
  const updateStatsData = async () => {
    if (!session?.user?.email) return;

    setLoading(true);

    try {
      const userProfile = await fetchUserProfile();
      const targetCalories = userProfile?.kalori || 2000;

      const consumptionData = await fetchFoodConsumption(selectedDate);
      const consumedCalories = consumptionData.reduce(
        (total, item) => total + (item.kalori || 0),
        0
      );

      const remainingCalories = Math.max(0, targetCalories - consumedCalories);
      const progress =
        targetCalories > 0
          ? Math.round((consumedCalories / targetCalories) * 100)
          : 0;

      const foodItemsCount = consumptionData.length;
      const weeklyAverage = await fetchWeeklyAverage(selectedDate);

      const isExceeded = consumedCalories > targetCalories;
      const excessCalories = consumedCalories - targetCalories;

      setStatsData([
        {
          title: "Kalori Hari Ini",
          value: consumedCalories.toString(),
          subtitle: isExceeded
            ? `melebihi ${excessCalories} dari target ${targetCalories}`
            : `dari ${targetCalories} target`,
          color: isExceeded ? "#EF4444" : "#3B82F6",
          icon: TrendingUp,
          progress: progress,
          isExceeded: isExceeded,
        },
        {
          title: "Sisa Kalori",
          value: isExceeded
            ? `+${excessCalories}`
            : remainingCalories.toString(),
          subtitle: isExceeded ? "kalori berlebih" : "kalori tersisa",
          color: remainingCalories > 0 ? "#10B981" : "#EF4444",
          icon: Target,
          isExceeded: isExceeded,
        },
        {
          title: "Rata-rata Minggu",
          value: weeklyAverage.toString(),
          subtitle: "kalori/hari",
          color: "#F59E0B",
          icon: Calendar,
        },
        {
          title: "Makanan Hari Ini",
          value: foodItemsCount.toString(),
          subtitle: "item makanan",
          color: "#8B5CF6",
          icon: Coffee,
        },
      ]);
    } catch (error) {
      console.error("Error updating stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    console.log("Date changed to:", date, "Formatted:", formatDateForAPI(date));
    setSelectedDate(date);
  };

  // Effect to update data when session or date changes
  useEffect(() => {
    console.log("Dashboard useEffect triggered", {
      session: !!session,
      selectedDate,
      formattedDate: formatDateForAPI(selectedDate),
    });
    updateStatsData();
  }, [session?.user?.email, selectedDate]);

  // Reset to today when component mounts
  useEffect(() => {
    const today = new Date();
    console.log("Component mounted, setting date to today:", today);
    setSelectedDate(today);
  }, []);

  return (
    <App
      title="Dashboard"
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
    >
      <div className="p-6 space-y-6">
        {/* Calorie Exceeded Warning */}
        {!loading && statsData[0]?.isExceeded && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-1">
                  ⚠️ Kalori Harian Terlampaui!
                </h3>
                <p className="text-red-700 text-sm mb-2">
                  Anda telah melebihi target kalori harian sebesar{" "}
                  <span className="font-semibold">
                    {parseInt(statsData[0]?.value) -
                      (statsData[0]?.subtitle.match(/\d+/)
                        ? parseInt(statsData[0]?.subtitle.match(/\d+/)[0])
                        : 0)}{" "}
                    kalori
                  </span>
                  .
                </p>
                <div className="bg-red-100 rounded-lg p-3 mt-3">
                  <h4 className="font-medium text-red-800 mb-2">
                    💡 Rekomendasi:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>
                      • <strong>Hindari makan berlebihan</strong> untuk sisa
                      hari ini
                    </li>
                    <li>
                      • <strong>Perbanyak minum air putih</strong> untuk
                      membantu metabolisme
                    </li>
                    <li>
                      • <strong>Lakukan aktivitas fisik ringan</strong> seperti
                      jalan santai
                    </li>
                    <li>
                      • <strong>Pilih camilan rendah kalori</strong> jika masih
                      lapar (buah-buahan)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} loading={loading} />
          ))}
        </div>

        {/* Pass the Date object directly to ActivityList */}
        <ActivityList selectedDate={selectedDate} />
      </div>
    </App>
  );
}
