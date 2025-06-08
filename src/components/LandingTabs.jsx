"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { key: "misi", label: "Misi Tubuh Ideal" },
  { key: "kandungan", label: "Kandungan Makanan" },
  { key: "nutrisi", label: "Nutrisi Harian" },
];

const contents = {
  misi: {
    title: "Cari Makanan, Cek Gizi, Capai Target",
    subtitle: "Misi Tubuh Ideal",
    description: `Wujudkan tubuh ideal tanpa repot.
Gunakan fitur pencarian kami untuk mengetahui kandungan kalori dan gizi dari lebih dari 100 makanan—mulai dari masakan rumahan, produk kemasan, hingga menu restoran.
Ambil keputusan makan yang lebih cerdas setiap hari dan tetap terarah dalam perjalanan menuju tubuh sehat dan ideal.`,
    image: "/images/man-eating-dragon-fruit-outdoors.jpg",
  },

  kandungan: {
    title: "Temukan Kandungan Makanan Anda dengan Mudah",
    subtitle: "Kandungan Makanan",
    description: `Ingin tahu apa yang Anda makan?
Fitur pencarian kami memudahkan Anda menemukan informasi kalori dan nutrisi dari berbagai jenis makanan—mulai dari makanan sehari-hari, camilan kemasan, hingga hidangan restoran favorit.
Data yang telah diverifikasi membantu Anda membuat pilihan makan yang lebih cerdas dan sehat setiap hari. Temukan kandungan makanan Anda dengan mudah, dan dukung gaya hidup sehat yang lebih terarah.`,
    image: "/images/5703146_59473.jpg",
  },

  nutrisi: {
    title: "Bahan Bakar Sehat untuk Aktivitas Sehari-hari",
    subtitle: "Nutrisi Harian",
    description: `Setiap hari, tubuh Anda membutuhkan asupan yang tepat untuk tetap aktif, fokus, dan sehat. Fitur Nutrisi Harian membantu Anda memantau kebutuhan kalori, makronutrien, dan gizi penting lainnya yang sesuai dengan gaya hidup Anda.
Tak perlu lagi menebak apa yang Anda makan—ketahui kandungan gizi dari berbagai jenis makanan dan jaga keseimbangan nutrisi setiap hari. Mulai hari ini, jadikan nutrisi sebagai bagian dari rutinitas cerdas Anda.`,
    image: "/images/1531149_4105.jpg",
  },
};

export default function LandingTabs() {
  const [selectedTab, setSelectedTab] = useState("misi");

  const current = contents[selectedTab];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`border-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold transition-all text-sm sm:text-base ${
              selectedTab === tab.key
                ? "text-teal-600 border-teal-500"
                : "text-gray-500 border-gray-300 hover:border-teal-400 hover:text-teal-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center"
        >
          {/* Text Content */}
          <div className="text-left order-2 lg:order-1">
            <h4 className="text-teal-500 text-base sm:text-lg md:text-xl font-semibold mb-2">
              {current.subtitle}
            </h4>
            <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              {current.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-black font-normal whitespace-pre-line leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[200px] h-[260px] sm:max-w-[240px] sm:h-[310px] md:max-w-[270px] md:h-[350px] lg:max-w-[380px] lg:h-[460px]">
              <Image
                src={current.image}
                alt={current.title}
                fill
                className="object-cover rounded-xl sm:rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
