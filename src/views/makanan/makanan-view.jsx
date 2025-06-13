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

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID tidak ditemukan. Silakan login kembali.");
        return;
      }

      const response = await fetch(
        `/api/food/upload?userId=${userId}&type=foods`
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

  const openModal = () => setIsModalOpen(true);
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

  if (loading) {
    return (
      <App>
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
    <App>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                <p className="text-gray-600 mt-2">
                  Kelola makanan dan kalori Anda
                </p>
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
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
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
                    Belum ada data makanan
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Klik "Tambah Makanan" untuk menambah data
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
