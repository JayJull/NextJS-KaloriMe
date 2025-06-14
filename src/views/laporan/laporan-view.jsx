import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Download,
  Camera,
  TrendingUp,
  Clock,
  Utensils,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import App from "@/layout/app";
import { sampleFoodData } from "@/data/interface";

// Custom hook untuk mendeteksi ukuran layar
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default function LaporanView() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [selectedDateRange, setSelectedDateRange] = useState("7");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5));
  const tableRef = useRef();
  const { width } = useWindowSize();

  const getFoodItemsToShow = () => {
    if (width < 640) return 4;  // mobile
    if (width < 1024) return 6; // tablet
    return 6; // desktop
  };

  const getPaginationPageCount = () => {
    if (width < 640) return 3;  // mobile
    if (width < 1024) return 5; // tablet
    return 7; // desktop
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTotalCalories = (foods) => {
    return foods.reduce((total, food) => total + food.calories, 0);
  };

  const getAllFoods = () => {
    return sampleFoodData.flatMap((day) =>
      day.foods.map((food) => ({
        ...food,
        date: day.date,
        formattedDate: formatDate(day.date),
      }))
    );
  };

  const exportToPDF = () => {
    alert(
      "Fitur export PDF akan segera hadir! Data laporan Anda akan diunduh dalam format PDF."
    );
  };

  const getCalorieStatus = (totalCalories) => {
    if (totalCalories > 2000)
      return { status: "Tinggi", color: "text-red-600 bg-red-50" };
    if (totalCalories > 1500)
      return { status: "Normal", color: "text-green-600 bg-green-50" };
    return { status: "Rendah", color: "text-yellow-600 bg-yellow-50" };
  };

  const getDaysInMonth = (date) => {
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
  };

  const getFoodDataForDate = (day) => {
    if (!day) return null;
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return sampleFoodData.find((data) => data.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const monthNames = [
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
  ];

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const getCurrentPageData = () => {
    const allFoods = getAllFoods();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allFoods.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getAllFoods().length / itemsPerPage);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1);
    }
  };

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
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full xs:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm text-black sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Pilih rentang waktu laporan"
              >
                <option value="7">7 Hari Terakhir</option>
                <option value="14">14 Hari Terakhir</option>
                <option value="30">30 Hari Terakhir</option>
              </select>
            </div>

            <button
              onClick={exportToPDF}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
              aria-label="Export laporan ke PDF"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </section>

        {/* Summary Cards */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-6 md:mb-7 lg:mb-8"
          aria-label="Ringkasan Statistik"
        >
          <article className="bg-white rounded-xl shadow-sm border p-4 md:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  Total Kalori
                </h3>
                <p className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900">
                  {getAllFoods()
                    .reduce((total, food) => total + food.calories, 0)
                    .toLocaleString()}{" "}
                  kal
                </p>
              </div>
              <div className="bg-orange-100 p-2 md:p-2.5 lg:p-3 rounded-full">
                <TrendingUp className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
            </div>
          </article>

          <article className="bg-white rounded-xl shadow-sm border p-4 md:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  Rata-rata Harian
                </h3>
                <p className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900">
                  {Math.round(
                    getAllFoods().reduce(
                      (total, food) => total + food.calories,
                      0
                    ) / sampleFoodData.length
                  ).toLocaleString()}{" "}
                  kal
                </p>
              </div>
              <div className="bg-blue-100 p-2 md:p-2.5 lg:p-3 rounded-full">
                <Clock className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </article>

          <article className="bg-white rounded-xl shadow-sm border p-4 md:p-5 lg:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  Total Makanan
                </h3>
                <p className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900">
                  {getAllFoods().length} item
                </p>
              </div>
              <div className="bg-green-100 p-2 md:p-2.5 lg:p-3 rounded-full">
                <Utensils className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </article>
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
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-3 sm:p-4 md:p-5 lg:p-6">
              {/* Day Names Header */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-2 mb-2 sm:mb-3 md:mb-4">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2"
                  >
                    <span className="hidden sm:inline">{day.slice(0, 3)}</span>
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-2">
                {getDaysInMonth(currentMonth).map((day, index) => {
                  const foodData = getFoodDataForDate(day);
                  const totalCalories = foodData
                    ? getTotalCalories(foodData.foods)
                    : 0;
                  const calorieStatus =
                    totalCalories > 0 ? getCalorieStatus(totalCalories) : null;

                  return (
                    <div
                      key={index}
                      className={`
                      min-h-[80px] sm:min-h-[100px] md:min-h-[110px] lg:min-h-[120px] p-1 sm:p-2 border rounded-lg transition-all duration-200
                      ${
                        day
                          ? "bg-white hover:bg-gray-50 cursor-pointer border-gray-200"
                          : "bg-gray-50 border-transparent"
                      }
                      ${
                        selectedDate === day
                          ? "ring-1 sm:ring-2 ring-blue-500 bg-blue-50"
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
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                new Date().getDate() === day &&
                                new Date().getMonth() ===
                                  currentMonth.getMonth() &&
                                new Date().getFullYear() ===
                                  currentMonth.getFullYear()
                                  ? "text-blue-600 bg-blue-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full"
                                  : "text-gray-700"
                              }`}
                            >
                              {day}
                            </span>
                            {calorieStatus && (
                              <span
                                className={`text-xs px-1 sm:px-1.5 py-0.5 rounded-full hidden sm:inline ${calorieStatus.color}`}
                              >
                                {calorieStatus.status}
                              </span>
                            )}
                          </div>

                          {foodData && (
                            <div className="space-y-1">
                              {/* Food Icons Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-0.5 sm:gap-1">
                                {foodData.foods
                                   .slice(0, getFoodItemsToShow())
                                  .map((food, foodIndex) => (
                                    <div
                                      key={foodIndex}
                                      className="relative group"
                                      title={`${food.name} - ${food.calories} kal`}
                                    >
                                      <img
                                        src={food.image}
                                        alt={food.name}
                                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 object-cover rounded border shadow-sm"
                                        onError={(e) => {
                                          e.target.src =
                                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCA0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHA+";
                                        }}
                                      />
                                      {/* Category indicator */}
                                      <div
                                        className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white ${
                                          food.category === "Sarapan"
                                            ? "bg-yellow-400"
                                            : food.category === "Makan Siang"
                                            ? "bg-orange-400"
                                            : "bg-purple-400"
                                        }`}
                                      ></div>
                                    </div>
                                  ))}
                                {foodData.foods.length > getFoodItemsToShow() && (
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-gray-200 rounded border flex items-center justify-center">
                                    <span className="text-xs text-gray-600">
                                      +{foodData.foods.length - getFoodItemsToShow()}
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
                            <div className="flex items-center justify-center h-8 sm:h-10 md:h-12 lg:h-16 text-gray-400">
                              <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {getFoodDataForDate(selectedDate).foods.map((food, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg shadow-sm flex-shrink-0"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xOCAyMUgxOFYyN0gxOFYyMVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDIxSDMwVjI3SDMwVjIxWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{food.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {food.time} • {food.category}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-orange-600">
                        {food.calories} kalori
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

            {/* Mobile Card View */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {getCurrentPageData().map((food, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <img
                        src={food.image}
                        alt={`Foto ${food.name}`}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xOCAyMUgxOFYyN0gxOFYyMVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDIxSDMwVjI3SDMwVjIxWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {food.name}
                          </h3>
                          <span className="text-sm font-medium text-orange-600 ml-2">
                            {food.calories} kal
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {food.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span>#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(food.date).toLocaleDateString("id-ID")}</span>
                          <span className="mx-2">•</span>
                          <span>{food.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto" ref={tableRef}>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 md:px-5 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-5 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tanggal
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-5 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Waktu
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-5 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Makanan
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-5 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kategori
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-5 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kalori
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-5 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Foto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPageData().map((food, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 md:px-5 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 md:px-5 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(food.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 md:px-5 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {food.time}
                      </td>
                      <td className="px-4 md:px-5 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {food.name}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 lg:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {food.category}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                        {food.calories} kal
                      </td>
                      <td className="px-4 md:px-5 lg:px-6 py-4 whitespace-nowrap">
                        <img
                          src={food.image}
                          alt={`Foto ${food.name}`}
                          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xOCAyMUgxOFYyN0gxOFYyMVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDIxSDMwVjI3SDMwVjIxWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-3 sm:px-4 md:px-6 py-3 md:py-4 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  sampai{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, getAllFoods().length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">{getAllFoods().length}</span>{" "}
                  makanan
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-1.5 sm:p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>

                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {(() => {
                      const totalPages = getTotalPages();
                      // Responsive page count: 3 for mobile, 5 for tablet, 7 for desktop
                      const maxVisible = getPaginationPageCount();
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                      
                      if (endPage - startPage + 1 < maxVisible) {
                        startPage = Math.max(1, endPage - maxVisible + 1);
                      }
                      
                      return Array.from(
                        { length: Math.min(totalPages, maxVisible) },
                        (_, i) => startPage + i
                      );
                    })().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors min-w-[32px] sm:min-w-[36px] md:min-w-[40px] ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === getTotalPages()}
                    className="p-1.5 sm:p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </App>
  );
}