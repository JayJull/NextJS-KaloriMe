"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { RegisterPresenter } from "@/presenters/RegisterPresenter";

const RegisterView = ({ onSwitchToLogin, onClose }) => {
  // State untuk form data
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    umur: "",
    berat_badan: "",
    tinggi_badan: "",
    tingkat_aktivitas: "",
    remember: false,
  });

  // State untuk UI
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Validasi real-time
    if (type !== "checkbox" && value.trim()) {
      const fieldError = RegisterPresenter.validateField(name, value, formData);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    }
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const result = await RegisterPresenter.handleRegister(formData);

      if (result.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          nama: "",
          email: "",
          password: "",
          umur: "",
          berat_badan: "",
          tinggi_badan: "",
          tingkat_aktivitas: "",
          remember: false,
        });

        // Auto close modal dan switch ke login setelah 2 detik
        setTimeout(() => {
          onClose();
          onSwitchToLogin();
        }, 2000);
      } else {
        setErrors(result.errors || {});
        // Jika ada error message umum, tampilkan di errors
        if (result.message && !result.errors) {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col items-center space-y-2 mb-6">
        <Image
          src="/images/KaloriME2.png"
          alt="Logo KaloriME"
          width={150}
          height={150}
          className="object-contain"
        />
        <h2 className="text-gray-800 text-xl font-bold">Daftar Akun Baru</h2>
        <p className="text-gray-600 text-sm text-center">
          Bergabunglah dengan KaloriME untuk memulai perjalanan hidup sehat Anda
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          Registrasi berhasil! Anda akan dialihkan ke halaman login...
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Lengkap
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
              placeholder="Masukkan nama lengkap Anda"
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
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
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
              placeholder="contoh@email.com"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              }`}
              placeholder="Minimal 6 karakter"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            disabled={loading}
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Saya setuju dengan syarat dan ketentuan
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className={`w-full flex justify-center items-center py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
            loading || success
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg"
          } text-white`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Mendaftar...
            </>
          ) : success ? (
            "Berhasil!"
          ) : (
            <>
              Daftar Sekarang
              <FiArrowRight className="ml-2" />
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Sudah memiliki akun?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
            className="font-medium text-teal-600 hover:text-teal-500 hover:underline transition-colors"
            aria-disabled={loading}
          >
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
