"use client";
import Image from "next/image";
import { FiMail, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";
import RegisterModal from "@/views/register/RegisterModal";
import LoginModal from "@/views/login/LoginModal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginView = ({ onSwitchToRegister }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Validasi real-time untuk field
  const validateField = (fieldName, value) => {
    let error = null;

    switch (fieldName) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          error = "Format email tidak valid";
        }
        break;
      case "password":
        if (value && value.length > 0 && value.length < 6) {
          error = "Password harus minimal 6 karakter";
        }
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.ok) {
        const response = await fetch("/api/session-user");
        const data = await response.json();

        if (data?.user?.id) {
          localStorage.setItem("userId", data.user.id);
        }
        router.push("/dashboard");
      } else {
        setError("Email atau password salah. Silakan periksa kembali.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError(null);
      const result = await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });

      // signIn dengan redirect: true akan langsung redirect,
      // jadi kode di bawah mungkin tidak akan dieksekusi
      if (result?.error) {
        setError(`Gagal login dengan ${provider}. Silakan coba lagi.`);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(`Terjadi kesalahan saat login dengan ${provider}.`);
    }
  };

  return (
    <>
      {/* Kontainer utama */}
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden p-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Image
            src="/images/KaloriME2.png"
            alt="logo KaloriME"
            width={200}
            height={200}
            priority
          />
          <p className="text-gray-700 text-lg font-semibold">
            Masuk ke akun Anda
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
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
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              required
              className={`w-full text-black font-semibold pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
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
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              required
              className={`w-full text-black font-semibold pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Remember me + lupa password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Ingat saya
              </label>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors"
              onClick={() => {
                // TODO: Implement forgot password
                alert("Fitur lupa password akan segera hadir!");
              }}
            >
              Lupa password?
            </button>
          </div>

          {/* Tombol masuk */}
          <button
            type="submit"
            disabled={
              isLoading ||
              Object.values(fieldErrors).some((error) => error !== null)
            }
            className={`w-full flex justify-center items-center py-3 px-6 rounded-full font-semibold shadow-md transition-all duration-300 ${
              isLoading ||
              Object.values(fieldErrors).some((error) => error !== null)
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
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
            Belum punya akun?{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister();
              }}
              className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
            >
              Daftar sekarang
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Atau masuk dengan
              </span>
            </div>
          </div>
        </div>

        {/* Login sosial */}
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => handleSocialLogin("google")}
            >
              <img
                src="/icons/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
          </div>
        </div>
      </div>

      {/* Modal harus di luar kontainer */}
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
            onSwitchToLogin={() => {
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
