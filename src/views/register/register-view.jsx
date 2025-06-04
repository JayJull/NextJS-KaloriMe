'use client'
import Image from 'next/image';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import { AnimatePresence } from 'framer-motion';

const RegisterView = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden p-8">
        {/* Header */}
        <div className="flex flex-col items-center space-y-1 mb-4">
          <Image
                      src='/images/KaloriME2.png'
                      alt='logo KaloriME'
                      width={200}
                      height={200}
                    />
          <p className="text-gray-700 text-lg font-semibold">Daftar akun baru Anda</p>
        </div>

        <form className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-600" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                required
                className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                required
                className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan Password"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Ingat Saya
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-teal-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:opacity-80 transition duration-300"
          >
            Daftar <FiArrowRight className="ml-2" />
          </button>
        </form>

        {/* Masuk Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah Mempunyai Akun?{' '}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowRegister(false);
                setShowLogin(true);   
              }}
              className="font-medium text-teal-600 hover:text-teal-500 hover:underline"
            >
              Masuk
            </button>
          </p>
        </div>
      </div>

      {/* Modal login di luar container */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRegister && (
          <RegisterModal
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RegisterView;
