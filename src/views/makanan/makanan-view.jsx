"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Image,
  RefreshCw,
} from "lucide-react";
import { makanan, kategoriMakanan } from "@/data/interface";
import App from "@/layout/app";
import UploadModal from "@/views/makanan/uploadModal";

export default function MakananView() {
  const title = "Makanan";

  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initialize with current date in local timezone
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    // Reset time to start of day in local timezone
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  useEffect(() => {
    loadFoods();
  }, [selectedDate]); // Reload when date changes

  // Helper function to format date consistently for API calls
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID tidak ditemukan. Silakan login kembali.");
        return;
      }

      // Use consistent date formatting
      const dateString = formatDateForAPI(selectedDate);
      console.log("Loading foods for date:", dateString, "Selected date object:", selectedDate);

      const response = await fetch(
        `/api/food/upload?userId=${userId}&type=foods&date=${dateString}`
      );
      const result = await response.json();

      if (result.success) {
        setFoods(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error loading foods:", err);
      setError("Gagal memuat data makanan");
    } finally {
      setLoading(false);
    }
  };

  // This function will be called from Header via App component
  const handleDateChange = (date) => {
    // Ensure we're working with a proper Date object and reset time
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(normalizedDate);
    console.log("Date changed in MakananView:", normalizedDate, "Formatted:", formatDateForAPI(normalizedDate));
  };

  const openModal = () => {
    // Check if selected date is today (compare dates only, not time)
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedNormalized = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    const isToday = selectedNormalized.getTime() === todayNormalized.getTime();

    if (!isToday) {
      alert("Anda hanya dapat menambahkan makanan pada tanggal hari ini!");
      return;
    }

    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleUpload = async (newImage) => {
    // Refresh data setelah upload berhasil
    await loadFoods();
    closeModal();
  };

  const handleDelete = async (foodId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus makanan ini?")) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/food/upload?id=${foodId}&userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Makanan berhasil dihapus");
        await loadFoods(); // Refresh data
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting food:", error);
      alert("Gagal menghapus makanan");
    }
  };

  const handleRefresh = () => {
    loadFoods();
  };

  // Helper function to check if date is today
  const isToday = (date) => {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateNormalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dateNormalized.getTime() === todayNormalized.getTime();
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <App
        title={title}
        subtitle="Kelola makanan dan kalori Anda"
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      >
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-red-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <RefreshCw className="animate-spin" size={24} />
                <span className="text-lg">Memuat data makanan...</span>
              </div>
            </div>
          </div>
        </div>
      </App>
    );
  }

  return (
    <App
      title={title}
      subtitle="Kelola makanan dan kalori Anda"
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
    >
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                <p className="text-gray-600 mt-2">
                  Kelola makanan dan kalori Anda - {formatDate(selectedDate)}
                </p>
                {!isToday(selectedDate) && (
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-700 rounded-md text-sm">
                    <strong>Info:</strong> Anda sedang melihat data tanggal{" "}
                    {formatDate(selectedDate)}. Penambahan makanan hanya dapat
                    dilakukan pada hari ini.
                  </div>
                )}
                {error && (
                  <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                  disabled={loading}
                >
                  <RefreshCw
                    size={20}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
                <button
                  onClick={openModal}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md ${
                    isToday(selectedDate)
                      ? "bg-teal-500 hover:bg-teal-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isToday(selectedDate)}
                  title={
                    !isToday(selectedDate)
                      ? "Hanya dapat menambahkan makanan pada hari ini"
                      : "Tambah Makanan"
                  }
                >
                  <Plus size={20} />
                  Tambah Makanan
                </button>
              </div>
            </div>
          </div>

          {/* Tabel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Foto</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Nama Makanan
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Kalori
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Waktu</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food, index) => (
                    <tr
                      key={food.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-teal-50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <img
                          src={food.foto}
                          alt={food.nama}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {food.nama}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                          {food.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-700">
                          {food.kalori} kal
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {food.tanggal_formatted}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {food.waktu}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDelete(food.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {foods.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {isToday(selectedDate)
                      ? "Belum ada data makanan hari ini"
                      : `Tidak ada data makanan pada ${formatDate(
                          selectedDate
                        )}`}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {isToday(selectedDate)
                      ? 'Klik "Tambah Makanan" untuk menambah data'
                      : "Pilih tanggal lain atau kembali ke hari ini untuk menambah data"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUpload={handleUpload}
      />
    </App>
  );
}