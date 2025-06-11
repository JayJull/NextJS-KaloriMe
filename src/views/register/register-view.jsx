'use client'

import Image from 'next/image'
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { useState } from 'react'
import LoginModal from '@/views/login/LoginModal'
import RegisterModal from '@/views/register/RegisterModal'
import { AnimatePresence } from 'framer-motion'
import { handleRegister } from '@/presenters/authPresenter'

const RegisterView = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await handleRegister(formData)

    if (res?.success) {
      setSuccess(true)
      setFormData({ nama: '', email: '', password: '' }) // reset form
    } else {
      setError(res?.message || 'Gagal mendaftar.')
    }

    setLoading(false)
  }

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden p-8">
        <div className="flex flex-col items-center space-y-1 mb-4">
          <Image
            src="/images/KaloriME2.png"
            alt="logo KaloriME"
            width={200}
            height={200}
          />
          <p className="text-gray-700 text-lg font-semibold">Daftar akun baru Anda</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-600" />
              </div>
              <input
                id="nama"
                name="nama"
                type="text"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Masukkan Nama Anda"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-600" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Masukkan Email Anda"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-600" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Masukkan Password"
              />
            </div>
          </div>

          {/* Tombol daftar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-6 rounded-full shadow-md font-semibold transition duration-300 ${
              loading
                ? 'bg-teal-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:opacity-80'
            }`}
          >
            {loading ? 'Mendaftar...' : (
              <>
                Daftar <FiArrowRight className="ml-2" />
              </>
            )}
          </button>

          {/* Feedback */}
          {error && (
            <div className="text-red-500 text-sm flex items-center justify-center mt-2">
              <FiXCircle className="mr-1" /> {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-sm flex items-center justify-center mt-2">
              <FiCheckCircle className="mr-1" /> Pendaftaran berhasil!
            </div>
          )}
        </form>

        {/* Switch ke login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <button
              onClick={(e) => {
                e.preventDefault()
                onSwitchToRegister()
              }}
              className="font-medium text-teal-600 hover:text-teal-500 hover:underline"
            >
              Masuk
            </button>
          </p>
        </div>
      </div>

      {/* Optional modal login & register */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRegister && (
          <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default RegisterView
