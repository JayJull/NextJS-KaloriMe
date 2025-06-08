"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, Image } from "lucide-react";
import { makanan, kategoriMakanan } from "@/data/interface";
import App from "@/layout/app";
import UploadModal from "@/views/makanan/uploadModal";


export default function MakananView() {
  const title = "Makanan";

  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    setFoods(makanan);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpload = (newImage) => {
    const newFood = {
      id: Date.now(),
      nama: "Makanan Baru",
      kategori: "Lainnya",
      kalori: 0,
      foto: URL.createObjectURL(newImage),
    };
    setFoods([newFood, ...foods]);
  };

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
              </div>
              <button
                onClick={() => openModal()}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
              >
                <Plus size={20} />
                Tambah Makanan{" "}
              </button>
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

              {foods.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Belum ada data makanan
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
