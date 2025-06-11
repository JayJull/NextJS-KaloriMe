'use client'

import Image from "next/image";
import { FiMail, FiLock, FiArrowRight, FiLoader } from 'react-icons/fi';
import RegisterModal from "@/views/register/RegisterModal";
import LoginModal from "@/views/login/LoginModal";
import { useState } from "react";
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { handleLogin } from "@/presenters/authPresenter";

const LoginView = ({ onSwitchToRegister }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await handleLogin({ email, password });

    setIsLoading(false);

    if (res?.success) {
      router.push('/dashboard');
    } else {
      setError(res?.message || 'Email atau password salah');
    }
  };

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden p-8">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Image
            src='/images/KaloriME2.png'
            alt='logo KaloriME'
            width={200}
            height={200}
          />
          <p className="text-gray-700 text-lg font-semibold">Masuk ke akun Anda</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmitLogin}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-600" />
            </div>
            <input
              id="email"
              value={email}
              type="email"
              placeholder="Email Anda"
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-600" />
            </div>
            <input
              id="password"
              value={password}
              type="password"
              placeholder="Password Anda"
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full text-black font-semibold pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

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

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 ${
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

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister();
              }}
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Daftar
            </a>
          </p>
        </div>
      </div>

      {/* Modal pop-up jika login/register dalam bentuk modal */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRegister && (
          <RegisterModal
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
            onSwitchToRegister={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginView;
