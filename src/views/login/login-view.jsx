"use client";
import Image from "next/image";
import { FiMail, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";
import RegisterModal from "@/views/register/RegisterModal";
import LoginModal from "@/views/login/LoginModal";
import LoadingAnimation from "@/components/LoadingAnimation";
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
  const [showSuccessLoading, setShowSuccessLoading] = useState(false);

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
        // Show success loading animation
        setIsLoading(false);
        setShowSuccessLoading(true);

        const response = await fetch("/api/session-user");
        const data = await response.json();

        if (data?.user?.id) {
          localStorage.setItem("userId", data.user.id);
        }

        // Wait for 2 seconds to show success animation
        setTimeout(() => {
          setShowSuccessLoading(false);
          router.push("/dashboard");
        }, 2000);
      } else {
        setError("Email atau password salah. Silakan periksa kembali.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError(null);
      setShowSuccessLoading(true);

      const result = await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: false, // Changed to false to handle redirect manually
      });

      if (result?.ok) {
        // Wait for animation then redirect
        setTimeout(() => {
          setShowSuccessLoading(false);
          router.push("/dashboard");
        }, 2000);
      } else if (result?.error) {
        setShowSuccessLoading(false);
        setError(`Gagal login dengan ${provider}. Silakan coba lagi.`);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setShowSuccessLoading(false);
      setError(`Terjadi kesalahan saat login dengan ${provider}.`);
    }
  };

  return (
    <>
      {/* Success Loading Animation */}
      <LoadingAnimation
        message="Login Berhasil! 🎉"
        subtitle="Sedang mengarahkan ke dashboard..."
        isVisible={showSuccessLoading}
        variant="success"
        showLogo={true}
      />

      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden p-8">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Image
            src="/images/KaloriME2.webp"
            alt="logo KaloriME"
            width={200}
            height={200}
            priority
          />
          <p className="text-gray-700 text-lg font-semibold">
            Masuk ke akun Anda
          </p>
        </div>

        <form className="space-y-6 text-black" onSubmit={handleLogin}>
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

          <button
            type="submit"
            disabled={
              isLoading ||
              showSuccessLoading ||
              Object.values(fieldErrors).some((error) => error !== null)
            }
            className={`w-full flex justify-center items-center py-3 px-6 rounded-full font-semibold shadow-md transition-all duration-300 ${
              isLoading ||
              showSuccessLoading ||
              Object.values(fieldErrors).some((error) => error !== null)
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin mr-2" /> Memproses...
              </>
            ) : showSuccessLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Berhasil!
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
          <div>
            <button
              type="button"
              disabled={isLoading || showSuccessLoading}
              className={`w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 transition-colors duration-200 ${
                isLoading || showSuccessLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
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
