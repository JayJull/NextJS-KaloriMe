"use client";

import { useState } from "react";
import Image from "next/image";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-teal-600">KaloriME</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-teal-600 font-medium"
              >
                Beranda
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-teal-600 font-medium"
              >
                Program Diet
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-teal-600 font-medium"
              >
                Cara Kerja
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-teal-600 font-medium"
              >
                Tentang Kami
              </a>

              <div className="flex items-center space-x-4 ml-8">
                {/* Tombol Login (dua tampilan) */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogin(true);
                  }}
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors font-medium"
                >
                  LOGIN
                </a>

                <a
                  href="/register"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors font-medium"
                >
                  REGISTER
                </a>
              </div>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center">
              <button className="text-gray-500 hover:text-gray-600 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 relative overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex justify-center items-center">
            <div className="text-white text-center w-full">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Buat Perjalanan Sehatmu
                <span className="block">Lebih Mudah dan Fun!</span>
              </h1>
              <p className="text-xl text-teal-100 mb-8 leading-relaxed mx-auto max-w-2xl">
                Dari tracking kalori hingga konsultasi dengan ahli gizi langsung
                yang cocok untuk kamu semua jadi lebih mudah dengan teknologi AI
                yang canggih!
              </p>
            </div>
          </div>
        </div>

        {/* Floating Images */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-4 lg:left-12 top-1/4 transform -translate-y-1/2 animate-bounce">
            <Image
              src="/images/pisang.png"
              alt="Pisang"
              width={120}
              height={120}
              className="drop-shadow-lg"
            />
          </div>
          <div className="absolute left-4 lg:left-10 bottom-10">
            <Image
              src="/images/makanan.png"
              alt="Fresh Vegetables"
              width={330}
              height={330}
              className="drop-shadow-lg"
            />
          </div>
          <div className="absolute right-2 lg:right-15 top-25 transform -translate-y-1/2">
            <Image
              src="/images/straw.png"
              alt="Fitness Tracker"
              width={100}
              height={100}
              className="drop-shadow-lg"
            />
          </div>
          <div className="absolute right-9 lg:right-10 bottom-15 animate-pulse delay-500">
            <Image
              src="/images/kiwi.png"
              alt="Water Bottle"
              width={200}
              height={200}
              className="drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="daftar"
        className="bg-gradient-to-r from-teal-400 to-teal-400 py-20"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Siap Memulai Perjalanan Sehat Anda?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Bergabunglah dengan ribuan orang yang telah merasakan manfaatnya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <button className="bg-white text-teal-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Daftar Gratis Sekarang
              </button>
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-teal-600 transform hover:scale-105 transition-all duration-200">
              Lihat Demo
            </button>
          </div>
        </div>
      </section>

      <section id="masuk" className="bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Sudah Punya Akun?
          </h3>
          <p className="text-gray-300 mb-6">
            Masuk ke akun Anda dan lanjutkan perjalanan sehat
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors duration-200"
          >
            Masuk ke Akun
          </button>
        </div>
      </section>

      {/* Komponen Modal Login */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
