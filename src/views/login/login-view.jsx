'use client'
import Image from "next/image";
import { FiMail, FiLock, FiArrowRight, FiLoader } from 'react-icons/fi';
import RegisterModal from "@/components/RegisterModal";
import LoginModal from "@/components/LoginModal";
import { useState } from "react";
import { AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginView = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    })
    setIsLoading(false);
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('Email atau password salah')
    }
  }

  return (
    <>
      {/* Kontainer utama */}
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden p-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Image
            src='/images/KaloriME2.png'
            alt='logo KaloriME'
            width={200}
            height={200}
          />
          <p className="text-gray-700 text-lg font-semibold">Masuk ke akun Anda</p>
        </div>

        <form className="space-y-6 " onSubmit={handleLogin}>
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-600" />
            </div>
            <input
              id="email"
              value={email}
              type="email"
              placeholder="Email Anda"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-600" />
            </div>
            <input
              id="password"
              value={password}
              type="password"
              placeholder="Password Anda"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Remember me + lupa password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ingat saya
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-500">
              Lupa password?
            </a>
          </div>

          {/* Tombol masuk */}
          <button
            type="submit" disabled={isLoading}
            className={`w-full flex justify-center items-center bg-teal-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:opacity-80 transition duration-300
              ${
            isLoading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-600 hover:opacity-80 text-white"
              }`}
          >
          {isLoading ? (
          <>
            <FiLoader className="animate-spin mr-2" /> Memproses...
          </>
          ) : (
            <>
              Masuk <FiArrowRight className="ml-2" />
            </>
          )}
          </button>
        </form>

        {/* Link daftar */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLogin(false);   
                setShowRegister(true);
              }}
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Daftar
            </a>
          </p>
        </div>

        {/* Login sosial */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex justify-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            </button>

            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            >
              <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal harus di luar kontainer */}
      <AnimatePresence>
        {showRegister && (
          <RegisterModal
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <LoginModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginView;
