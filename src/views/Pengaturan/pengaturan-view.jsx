"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiActivity,
  FiTarget,
  FiSave,
  FiLoader,
} from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import App from "@/layout/app";

const ProfileView = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    umur: "",
    berat_badan: "",
    tinggi_badan: "",
    tingkat_aktivitas: "tidak pernah",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({});

  const { data: session, status } = useSession();
  const router = useRouter();

  // Load user profile data on component mount
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      loadProfileData();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  // Calculate health metrics when form data changes
  useEffect(() => {
    calculateHealthMetrics();
  }, [
    formData.berat_badan,
    formData.tinggi_badan,
    formData.umur,
    formData.tingkat_aktivitas,
  ]);

  const getActivityLevelOptions = () => {
    return [
      {
        value: "tidak pernah",
        label: "Sangat Sedikit",
        desc: "Tidak pernah olahraga",
        multiplier: 1.2,
      },
      {
        value: "ringan",
        label: "Ringan",
        desc: "Olahraga 1-3 hari/minggu",
        multiplier: 1.375,
      },
      {
        value: "sedang",
        label: "Sedang",
        desc: "Olahraga 3-5 hari/minggu",
        multiplier: 1.55,
      },
      {
        value: "aktif",
        label: "Aktif",
        desc: "Olahraga 6-7 hari/minggu",
        multiplier: 1.725,
      },
      {
        value: "sangat aktif",
        label: "Sangat Aktif",
        desc: "Olahraga 2x sehari atau pekerjaan fisik",
        multiplier: 1.9,
      },
    ];
  };

  const loadProfileData = async () => {
    try {
      setLoadingProfile(true);
      const response = await fetch("/api/profile/update", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        const userData = result.data;
        setFormData({
          nama: userData.nama || "",
          email: userData.email || "",
          umur: userData.umur ? userData.umur.toString() : "",
          berat_badan: userData.berat_badan
            ? userData.berat_badan.toString()
            : "",
          tinggi_badan: userData.tinggi_badan
            ? userData.tinggi_badan.toString()
            : "",
          tingkat_aktivitas: userData.tingkat_aktivitas || "tidak pernah", // Pastikan default value konsisten
        });
      } else {
        // If profile not found, use session data as fallback
        setFormData((prev) => ({
          ...prev,
          nama: session?.user?.name || "",
          email: session?.user?.email || "",
          tingkat_aktivitas: "tidak pernah", // Set default
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Use session data as fallback on error
      setFormData((prev) => ({
        ...prev,
        nama: session?.user?.name || "",
        email: session?.user?.email || "",
        tingkat_aktivitas: "tidak pernah", // Set default
      }));
      setErrors({
        general: "Gagal memuat data profil. Menggunakan data sesi.",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const calculateHealthMetrics = () => {
    const { berat_badan, tinggi_badan, umur, tingkat_aktivitas } = formData;

    let bmi = null;
    let bmiStatus = "";
    let dailyCalories = null;

    // Calculate BMI - sama dengan ProfileModel.calculateBMI
    if (berat_badan && tinggi_badan) {
      const weight = parseFloat(berat_badan);
      const height = parseFloat(tinggi_badan) / 100; // convert cm to m
      if (weight > 0 && height > 0) {
        bmi = (weight / (height * height)).toFixed(1);

        // BMI Status - sama dengan ProfileModel.getBMIStatus
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) bmiStatus = "Kurus";
        else if (bmiValue < 25) bmiStatus = "Normal";
        else if (bmiValue < 30) bmiStatus = "Gemuk";
        else bmiStatus = "Obesitas";
      }
    }

    // Calculate daily calories - sama dengan ProfileModel.calculateDailyCalories
    if (berat_badan && tinggi_badan && umur) {
      const weight = parseFloat(berat_badan);
      const height = parseFloat(tinggi_badan);
      const age = parseInt(umur);

      if (weight > 0 && height > 0 && age > 0) {
        // Harris-Benedict Formula - menggunakan male sebagai default
        const bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;

        // Activity multipliers - sesuai dengan database values
        const activityMultipliers = {
          "tidak pernah": 1.2,
          ringan: 1.375,
          sedang: 1.55,
          aktif: 1.725,
          "sangat aktif": 1.9,
        };

        const multiplier = activityMultipliers[tingkat_aktivitas] || 1.2;
        dailyCalories = Math.round(bmr * multiplier);
      }
    }

    setHealthMetrics({
      bmi,
      bmiStatus,
      dailyCalories,
    });
  };

  // Validation function
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "nama":
        if (!value || value.trim().length < 1) {
          return "Nama harus diisi";
        }
        if (value.trim().length > 100) {
          return "Nama maksimal 100 karakter";
        }
        return null;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return "Format email tidak valid";
        }
        return null;

      case "umur":
        if (value !== null && value !== undefined && value !== "") {
          const age = parseInt(value);
          if (isNaN(age) || age < 1 || age > 120) {
            return "Umur harus antara 1-120 tahun";
          }
        }
        return null;

      case "berat_badan":
        if (value !== null && value !== undefined && value !== "") {
          const weight = parseFloat(value);
          if (isNaN(weight) || weight < 10 || weight > 500) {
            return "Berat badan harus antara 10-500 kg";
          }
        }
        return null;

      case "tinggi_badan":
        if (value !== null && value !== undefined && value !== "") {
          const height = parseFloat(value);
          if (isNaN(height) || height < 50 || height > 300) {
            return "Tinggi badan harus antara 50-300 cm";
          }
        }
        return null;

      case "tingkat_aktivitas":
        if (value) {
          const validActivities = [
            "tidak pernah",
            "ringan",
            "sedang",
            "aktif",
            "sangat aktif",
          ];
          if (!validActivities.includes(value)) {
            return "Tingkat aktivitas tidak valid";
          }
        }
        return null;

      default:
        return null;
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Real-time validation
    if (value.trim()) {
      const fieldError = validateField(name, value);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    // Validate all fields before submitting
    const validationErrors = {};
    const fieldsToValidate = [
      "nama",
      "email",
      "umur",
      "berat_badan",
      "tinggi_badan",
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        validationErrors[field] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Kirim dengan format yang sesuai dengan ProfilePresenter
          nama: formData.nama.trim(), // Ubah dari 'name' ke 'nama'
          email: formData.email.toLowerCase().trim(),
          umur: formData.umur ? parseInt(formData.umur) : null, // Ubah dari 'age' ke 'umur'
          berat_badan: formData.berat_badan
            ? parseFloat(formData.berat_badan)
            : null, // Ubah dari 'weight'
          tinggi_badan: formData.tinggi_badan
            ? parseFloat(formData.tinggi_badan)
            : null, // Ubah dari 'height'
          tingkat_aktivitas: formData.tingkat_aktivitas, // Ubah dari 'activityLevel'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setErrors({});

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);

        // Optional: Reload profile data untuk sinkronisasi
        if (result.data) {
          setFormData({
            nama: result.data.nama || "",
            email: result.data.email || "",
            umur: result.data.umur ? result.data.umur.toString() : "",
            berat_badan: result.data.berat_badan
              ? result.data.berat_badan.toString()
              : "",
            tinggi_badan: result.data.tinggi_badan
              ? result.data.tinggi_badan.toString()
              : "",
            tingkat_aktivitas: result.data.tingkat_aktivitas || "tidak pernah",
          });
        }
      } else {
        setErrors(result.errors || {});
        // If there's a general error message, show it
        if (result.message && !result.errors) {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({
        general: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state for initial profile load
  if (status === "loading" || loadingProfile) {
    return (
      <App>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <FiLoader className="w-6 h-6 animate-spin text-teal-600" />
            <span>Memuat profil...</span>
          </div>
        </div>
      </App>
    );
  }

  // Avatar component
  const avatarLarge = session?.user?.image ? (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
      <Image
        src={session.user.image}
        alt="User"
        fill
        className="object-cover rounded-full"
      />
    </div>
  ) : (
    <div className="bg-teal-500 text-white font-bold w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-2xl">
      {(formData.nama || session?.user?.name || "Guest")
        .charAt(0)
        .toUpperCase()}
    </div>
  );

  return (
    <App>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mx-4 lg:mx-20 mt-5">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center mb-4">
                {avatarLarge}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData.nama || "User"}
              </h1>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Health Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <FiTarget className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {formData.berat_badan || "-"}
              </div>
              <div className="text-sm text-gray-600">kg</div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <FiActivity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {healthMetrics.bmi || "-"}
              </div>
              <div className="text-sm text-gray-600">BMI</div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center shadow-sm col-span-2 md:col-span-1">
              <FiTarget className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {healthMetrics.dailyCalories || "-"}
              </div>
              <div className="text-sm text-gray-600">kcal/hari</div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-600 text-sm font-medium">
                Profil berhasil diperbarui!
              </div>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm">{errors.general}</div>
            </div>
          )}

          {/* Profile Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiUser className="w-5 h-5 mr-2" />
              Edit Profil
            </h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={formData.nama}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.nama
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      }`}
                      placeholder="Masukkan nama lengkap"
                      disabled={loading}
                    />
                  </div>
                  {errors.nama && (
                    <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      }`}
                      placeholder="nama@email.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Physical Stats */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiTarget className="w-5 h-5 mr-2" />
                  Data Fisik
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Age Field */}
                  <div>
                    <label
                      htmlFor="umur"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Umur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        id="umur"
                        name="umur"
                        type="number"
                        value={formData.umur}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.umur
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        }`}
                        placeholder="tahun"
                        min="1"
                        max="120"
                        disabled={loading}
                      />
                    </div>
                    {errors.umur && (
                      <p className="mt-1 text-sm text-red-600">{errors.umur}</p>
                    )}
                  </div>

                  {/* Weight Field */}
                  <div>
                    <label
                      htmlFor="berat_badan"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Berat Badan
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTarget className="text-gray-400" />
                      </div>
                      <input
                        id="berat_badan"
                        name="berat_badan"
                        type="number"
                        value={formData.berat_badan}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.berat_badan
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        }`}
                        placeholder="kg"
                        min="10"
                        max="500"
                        step="0.1"
                        disabled={loading}
                      />
                    </div>
                    {errors.berat_badan && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.berat_badan}
                      </p>
                    )}
                  </div>

                  {/* Height Field */}
                  <div>
                    <label
                      htmlFor="tinggi_badan"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tinggi Badan
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTarget className="text-gray-400" />
                      </div>
                      <input
                        id="tinggi_badan"
                        name="tinggi_badan"
                        type="number"
                        value={formData.tinggi_badan}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.tinggi_badan
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        }`}
                        placeholder="cm"
                        min="50"
                        max="300"
                        step="0.1"
                        disabled={loading}
                      />
                    </div>
                    {errors.tinggi_badan && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tinggi_badan}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiActivity className="w-5 h-5 mr-2" />
                  Tingkat Aktivitas
                </h3>

                <div className="space-y-3">
                  {getActivityLevelOptions().map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="tingkat_aktivitas"
                        value={option.value}
                        checked={formData.tingkat_aktivitas === option.value}
                        onChange={handleChange}
                        className="text-teal-600 focus:ring-teal-500"
                        disabled={loading}
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* BMI Status */}
              {healthMetrics.bmi && (
                <div className="border-t pt-6">
                  <div className="bg-teal-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-teal-900">
                          Status BMI Anda
                        </h4>
                        <p className="text-sm text-teal-700 mt-1">
                          BMI {healthMetrics.bmi} - {healthMetrics.bmiStatus}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-teal-600">
                        {healthMetrics.bmi}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="border-t pt-6 flex items-center justify-end">
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    loading || success
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg"
                  } text-white`}
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>Simpan Profil</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </App>
  );
};

export default ProfileView;
