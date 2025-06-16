import { useSession } from "next-auth/react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  Download,
  Camera,
  TrendingUp,
  Clock,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import App from "@/layout/app";
import { useReports } from "@/hooks/useReport";
import { useReportSummary } from "@/hooks/useReportSummary";
import { useCalendarData } from "@/hooks/useCalendarData"; // Fixed import name
import { usePaginatedFoods } from "@/hooks/usePaginatedFood";
import { useExportData } from "@/hooks/useExportData";
import { useDateRange } from "@/hooks/useDateRange";

export default function LaporanView() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // State management
  const [selectedDateRange, setSelectedDateRange] = useState("7");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tableRef = useRef();

  // Custom hooks untuk data fetching
  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
    refetch: refetchReports,
  } = useReports(userId, {
    days: parseInt(selectedDateRange),
  });

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useReportSummary(userId, parseInt(selectedDateRange));

  const {
    calendarData,
    loading: calendarLoading,
    error: calendarError,
    refetch: refetchCalendar,
  } = useCalendarData(
    userId,
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1
  );

  const {
    data: paginatedFoods,
    pagination,
    loading: paginationLoading,
    error: paginationError,
    goToPage,
    goToNextPage,
    goToPrevPage,
    refetch: refetchPaginatedFoods,
  } = usePaginatedFoods(userId, {
    days: parseInt(selectedDateRange),
    itemsPerPage: 7,
  });

  const {
    exportToPDF,
    loading: exportLoading,
    error: exportError,
    clearError,
  } = useExportData();
  const { getDateRangeByDays } = useDateRange();

  // Memoized utility functions
  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }, []);

  const getTotalCalories = useCallback((foods) => {
    if (!foods || !Array.isArray(foods)) return 0;
    return foods.reduce(
      (total, food) => total + (food.kalori || food.calories || 0),
      0
    );
  }, []);

  const getCalorieStatus = useCallback((totalCalories) => {
    if (totalCalories > 2000)
      return { status: "Tinggi", color: "text-red-600 bg-red-50" };
    if (totalCalories > 1500)
      return { status: "Normal", color: "text-green-600 bg-green-50" };
    return { status: "Rendah", color: "text-yellow-600 bg-yellow-50" };
  }, []);

  // Handle export with better error handling
  const handleExportToPDF = useCallback(async () => {
    try {
      clearError(); // Clear previous errors
      const dateRange = await getDateRangeByDays(parseInt(selectedDateRange));
      if (dateRange) {
        const result = await exportToPDF(
          userId,
          dateRange.startDate,
          dateRange.endDate
        );
        if (result) {
          // Success feedback
          alert("Data berhasil diekspor!");
        }
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Gagal mengexport data. Silakan coba lagi.");
    }
  }, [selectedDateRange, userId, exportToPDF, getDateRangeByDays, clearError]);

  // Handle date range change with refresh
  const handleDateRangeChange = useCallback(
    async (newRange) => {
      setSelectedDateRange(newRange);
      setIsRefreshing(true);

      try {
        await Promise.all([
          refetchReports(),
          refetchSummary(),
          refetchPaginatedFoods(),
        ]);
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setIsRefreshing(false);
      }
    },
    [refetchReports, refetchSummary, refetchPaginatedFoods]
  );

  // Memoized calendar utilities
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, []);

  const getFoodDataForDate = useCallback(
    (day) => {
      if (!day || !calendarData) return null;
      const dateStr = `${currentMonth.getFullYear()}-${String(
        currentMonth.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return calendarData[dateStr] || null;
    },
    [calendarData, currentMonth]
  );

  const navigateMonth = useCallback((direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
    setSelectedDate(null); // Clear selected date when changing month
  }, []);

  // Memoized constants
  const monthNames = useMemo(
    () => [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    []
  );

  const dayNames = useMemo(
    () => ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    []
  );

  // Check if user is authenticated
  if (status === "loading") {
    return (
      <App>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </App>
    );
  }

  if (!session) {
    return (
      <App>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Akses Ditolak
            </h2>
            <p className="text-gray-600">
              Silakan login terlebih dahulu untuk mengakses laporan.
            </p>
          </div>
        </div>
      </App>
    );
  }

  // Loading component
  const LoadingSpinner = ({ message = "Memuat data..." }) => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 text-red-600">
      <AlertCircle className="w-8 h-8 mb-2" />
      <span className="text-center mb-4">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );

return (
    <App>
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 max-w-7xl mx-auto">
        {/* SEO Header */}
        <header className="mb-4 sm:mb-6 md:mb-7 lg:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Laporan Konsumsi Makanan Harian
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-base lg:text-lg">
            Pantau riwayat makanan dan kalori yang telah Anda konsumsi dalam
            beberapa hari terakhir
          </p>
        </header>

        {/* Filter Controls */}
        <section
          className="bg-white rounded-xl shadow-sm border p-4 md:p-5 lg:p-6 mb-4 sm:mb-5 md:mb-6"
          aria-label="Filter Laporan"
        >
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <label
                  htmlFor="date-range"
                  className="font-medium text-gray-700 text-sm sm:text-base"
                >
                  Rentang Waktu:
                </label>
              </div>
              <select
                id="date-range"
                value={selectedDateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Pilih rentang waktu laporan"
                disabled={reportLoading}
              >
                <option value="7">7 Hari Terakhir</option>
                <option value="14">14 Hari Terakhir</option>
                <option value="30">30 Hari Terakhir</option>
              </select>
            </div>

            <button
              onClick={handleExportToPDF}
              disabled={exportLoading || !reportData?.length}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Export laporan ke PDF"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export PDF
            </button>
          </div>
        </section>

        {/* Summary Cards */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-6 md:mb-7 lg:mb-8"
          aria-label="Ringkasan Statistik"
        >
          {summaryLoading ? (
            <div className="col-span-3">
              <LoadingSpinner />
            </div>
          ) : summaryError ? (
            <div className="col-span-3">
              <ErrorMessage message={summaryError} />
            </div>
          ) : (
            <>
              <article className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Total Kalori
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary?.totalCalories?.toLocaleString() || 0} kal
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Rata-rata Harian
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary?.averageCalories?.toLocaleString() || 0} kal
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Total Makanan
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary?.totalFoods || 0} item
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Utensils className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </article>
            </>
          )}
        </section>

        {/* Calendar View */}
        <section className="mb-4 sm:mb-6 md:mb-7 lg:mb-8" aria-label="Kalender Makanan Harian">
          <h2 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            Kalender Konsumsi Makanan
          </h2>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gray-50 px-3 sm:px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 border-b">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Bulan sebelumnya"
                  disabled={calendarLoading}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold text-gray-900">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Bulan selanjutnya"
                  disabled={calendarLoading}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {calendarLoading ? (
                <LoadingSpinner />
              ) : calendarError ? (
                <ErrorMessage message={calendarError} />
              ) : (
                <>
                  {/* Day Names Header */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth(currentMonth).map((day, index) => {
                      const foodData = getFoodDataForDate(day);
                      const totalCalories = foodData
                        ? getTotalCalories(foodData.foods || foodData.makanan)
                        : 0;
                      const calorieStatus =
                        totalCalories > 0
                          ? getCalorieStatus(totalCalories)
                          : null;

                      return (
                        <div
                          key={index}
                          className={`
                          min-h-[120px] p-2 border rounded-lg transition-all duration-200
                          ${
                            day
                              ? "bg-white hover:bg-gray-50 cursor-pointer border-gray-200"
                              : "bg-gray-50 border-transparent"
                          }
                          ${
                            selectedDate === day
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : ""
                          }
                        `}
                          onClick={() =>
                            day &&
                            setSelectedDate(selectedDate === day ? null : day)
                          }
                        >
                          {day && (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className={`text-sm font-medium ${
                                    new Date().getDate() === day &&
                                    new Date().getMonth() ===
                                      currentMonth.getMonth() &&
                                    new Date().getFullYear() ===
                                      currentMonth.getFullYear()
                                      ? "text-blue-600 bg-blue-100 px-2 py-1 rounded-full"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {day}
                                </span>
                                {calorieStatus && (
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded-full ${calorieStatus.color}`}
                                  >
                                    {calorieStatus.status}
                                  </span>
                                )}
                              </div>

                              {foodData &&
                                (foodData.foods || foodData.makanan) && (
                                  <div className="space-y-1">
                                    {/* Food Icons Grid */}
                                    <div className="grid grid-cols-3 gap-1">
                                      {(foodData.foods || foodData.makanan)
                                        .slice(0, 6)
                                        .map((food, foodIndex) => (
                                          <div
                                            key={foodIndex}
                                            className="relative group"
                                            title={`${
                                              food.nama_makanan || food.name
                                            } - ${
                                              food.kalori || food.calories
                                            } kal`}
                                          >
                                            <img
                                              src={
                                                food.foto ||
                                                food.image
                                              }
                                              alt={
                                                food.nama_makanan || food.name
                                              }
                                              className="w-6 h-6 object-cover rounded border shadow-sm"
                                              onError={(e) => {
                                                e.target.style.display = "none";
                                              }}
                                            />
                                            {/* Category indicator */}
                                            <div
                                              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                                                (food.kategori ||
                                                  food.category) === "Sarapan"
                                                  ? "bg-yellow-400"
                                                  : (food.kategori ||
                                                      food.category) ===
                                                    "Makan Siang"
                                                  ? "bg-orange-400"
                                                  : "bg-purple-400"
                                              }`}
                                            ></div>
                                          </div>
                                        ))}
                                      {(foodData.foods || foodData.makanan)
                                        .length > 6 && (
                                        <div className="w-6 h-6 bg-gray-200 rounded border flex items-center justify-center">
                                          <span className="text-xs text-gray-600">
                                            +
                                            {(
                                              foodData.foods || foodData.makanan
                                            ).length - 6}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Calorie count */}
                                    <div className="text-xs text-center text-gray-600 font-medium">
                                      {totalCalories} kal
                                    </div>
                                  </div>
                                )}

                              {!foodData && (
                                <div className="flex items-center justify-center h-16 text-gray-400">
                                  <Utensils className="w-4 h-4" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Legend */}
            <div className="bg-gray-50 px-3 sm:px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 border-t">
              <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full border"></div>
                  <span className="text-xs sm:text-sm">Sarapan</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full border"></div>
                  <span className="text-xs sm:text-sm">Siang</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full border"></div>
                  <span className="text-xs sm:text-sm">Malam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && getFoodDataForDate(selectedDate) && (
            <div className="mt-4 sm:mt-5 md:mt-6 bg-white rounded-xl shadow-sm border p-4 md:p-5 lg:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Detail Makanan - {selectedDate}{" "}
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(
                  getFoodDataForDate(selectedDate).foods ||
                  getFoodDataForDate(selectedDate).makanan ||
                  []
                ).map((food, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={
                        food.foto_makanan ||
                        food.image
                      }
                      alt={food.nama_makanan || food.name}
                      className="w-12 h-12 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/48/48";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {food.nama_makanan || food.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {food.waktu_makan || food.time} •{" "}
                        {food.kategori || food.category}
                      </p>
                      <p className="text-sm font-medium text-orange-600">
                        {food.kalori || food.calories} kalori
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Detailed Food Table */}
        <section aria-label="Tabel Detail Makanan">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <header className="bg-gray-50 px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Daftar Lengkap Makanan yang Dikonsumsi
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Tracking detail semua makanan dalam periode yang dipilih
              </p>
            </header>

            <div className="overflow-x-auto" ref={tableRef}>
              {paginationLoading ? (
                <LoadingSpinner />
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tanggal
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Waktu
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Makanan
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kategori
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kalori
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Foto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedFoods && paginatedFoods.length > 0 ? (
                      paginatedFoods.map((food, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {food.serialNumber ||
                              (pagination.currentPage - 1) *
                                pagination.itemsPerPage +
                                index +
                                1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {food.date_formatted ||
                              new Date(
                                food.tanggal || food.date
                              ).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {food.waktu || food.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {food.nama_makanan || food.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {food.kategori || food.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                            {food.kalori || food.calories} kal
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={
                                food.foto ||
                                food.image ||
                                "/api/placeholder/48/48"
                              }
                              alt={`Foto ${food.nama_makanan || food.name}`}
                              className="w-12 h-12 object-cover rounded-lg shadow-sm"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/48/48";
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          Tidak ada data makanan untuk periode yang dipilih
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Menampilkan{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}
                    </span>{" "}
                    sampai{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium">{pagination.totalItems}</span>{" "}
                    makanan
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={
                        pagination.currentPage === 1 || paginationLoading
                      }
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(pagination.totalPages, 5) },
                        (_, i) => {
                          const page =
                            pagination.currentPage <= 3
                              ? i + 1
                              : pagination.currentPage + i - 2;
                          if (page > pagination.totalPages) return null;
                          return (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              disabled={paginationLoading}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                pagination.currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={
                        pagination.currentPage === pagination.totalPages ||
                        paginationLoading
                      }
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </App>
  );
}
