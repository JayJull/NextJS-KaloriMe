"use client";
import Image from "next/image";
import { MdRestaurant, MdSearch, MdEco } from "react-icons/md";
import { Facebook, Instagram, Twitter, ArrowUp, } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const LoginModal = dynamic(() => import("@/views/login/LoginModal"), { ssr: false });
const RegisterModal = dynamic(() => import("@/views/register/RegisterModal"), { ssr: false });
const LandingTabs = dynamic(() => import("@/components/LandingTabs"));
const DemoModal = dynamic(() => import("@/components/DemoModal"));

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [isOpen, setIsOpen] = useState(false);
  const berandaRef = useRef(null);
  const programdietRef = useRef(null);
  const carakerjaRef = useRef(null);
  const tentangkamiRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const DynamicMap = dynamic(() => import("../src/components/MapComponent"), {
    ssr: false,
  });

  const scrollToSection = (ref, sectionName) => {
    setActiveSection(sectionName);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("showLogin") === "1") {
      setShowLogin(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);

      const sections = [
        { name: "beranda", ref: berandaRef },
        { name: "programdiet", ref: programdietRef },
        { name: "carakerja", ref: carakerjaRef },
        { name: "tentangkami", ref: tentangkamiRef },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const el = section.ref.current;
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          const offsetTop = top + window.scrollY;
          const offsetBottom = bottom + window.scrollY;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Navbar */}
        <nav
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            backgroundColor: "#00A999",
            backgroundImage: "url('/images/grey-felt-texture.webp')",
          }}
        >
          <div className="absolute inset-0 bg-[#00A999]/95"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-[70px] sm:h-[80px] lg:h-[90px]">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="">
                  <Image
                    src="/images/KaloriME Putih.webp"
                    alt="KaloriME"
                    width={150}
                    height={150}
                    className="drop-shadow-lg sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px]"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection(berandaRef, "beranda")}
                  className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${
                    activeSection === "beranda" ? "underline" : ""
                  }`}
                >
                  Beranda
                </button>
                <button
                  onClick={() => scrollToSection(programdietRef, "programdiet")}
                  className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${
                    activeSection === "programdiet" ? "underline" : ""
                  }`}
                >
                  Program Diet
                </button>
                <button
                  onClick={() => scrollToSection(carakerjaRef, "carakerja")}
                  className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${
                    activeSection === "carakerja" ? "underline" : ""
                  }`}
                >
                  Cara Kerja
                </button>
                <button
                  onClick={() => scrollToSection(tentangkamiRef, "tentangkami")}
                  className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${
                    activeSection === "tentangkami" ? "underline" : ""
                  }`}
                >
                  Tentang Kami
                </button>
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRegister(true);
                  }}
                  className="bg-white text-teal-600 px-4 py-2 xl:px-6 xl:py-2 rounded-full font-semibold text-sm xl:text-base border border-white hover:bg-transparent hover:text-white transition-all duration-300"
                >
                  DAFTAR
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogin(true);
                  }}
                  className="border border-white text-white px-4 py-2 xl:px-6 xl:py-2 rounded-full hover:bg-white hover:text-teal-600 transition-colors font-semibold duration-300"
                >
                  MASUK
                </a>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:text-gray-200 focus:outline-none p-2"
                  aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
              className={`lg:hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-lg mt-2 shadow-lg">
                <button
                  onClick={() => {
                    scrollToSection(berandaRef, "beranda");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${
                    activeSection === "beranda"
                      ? "bg-teal-100 text-teal-700"
                      : ""
                  }`}
                >
                  Beranda
                </button>
                <button
                  onClick={() => {
                    scrollToSection(programdietRef, "programdiet");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${
                    activeSection === "programdiet"
                      ? "bg-teal-100 text-teal-700"
                      : ""
                  }`}
                >
                  Program Diet
                </button>
                <button
                  onClick={() => {
                    scrollToSection(carakerjaRef, "carakerja");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${
                    activeSection === "carakerja"
                      ? "bg-teal-100 text-teal-700"
                      : ""
                  }`}
                >
                  Cara Kerja
                </button>
                <button
                  onClick={() => {
                    scrollToSection(tentangkamiRef, "tentangkami");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${
                    activeSection === "tentangkami"
                      ? "bg-teal-100 text-teal-700"
                      : ""
                  }`}
                >
                  Tentang Kami
                </button>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 px-4 pt-3 border-t border-gray-200">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowRegister(true);
                    }}
                    className="bg-teal-600 text-white px-4 py-2 rounded-full font-semibold text-center hover:bg-teal-700 transition-colors duration-300"
                  >
                    DAFTAR
                  </a>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLogin(true);
                    }}
                    className="border border-teal-600 text-teal-600 px-4 py-2 rounded-full font-semibold text-center hover:bg-teal-600 hover:text-white transition-colors duration-300"
                  >
                    MASUK
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          id="beranda"
          ref={berandaRef}
          className="relative overflow-hidden min-h-[55vh] sm:min-h-[70vh] md:min-h-[70vh] lg:min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20"
          style={{
            backgroundColor: "#00A999",
            backgroundImage: "url('/images/grey-felt-texture.webp')",
          }}
        >
          <div className="absolute inset-0 bg-[#00A999]/95"></div>
          
          <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex justify-center items-center">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-white text-center w-full max-w-5xl mt-[-10%] md:mt-[-15%]"
          >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                Buat Perjalanan Sehatmu
                <span className="block">Lebih Mudah dan Fun!</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-normal leading-relaxed mx-auto max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                  Dari tracking kalori hingga konsultasi dengan ahli gizi
                  langsung yang cocok untuk kamu semua jadi lebih mudah dengan
                  teknologi AI yang canggih!
                </p>
              </motion.div>
            </div>
          </div>

          {/* Curve Bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full "
            >
              <path
                fill="white"
                d="M0,0 C360,100 1080,100 1440,0 L1440,100 L0,100 Z"
              />
            </svg>
          </div>

          {/* Floating Images */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="absolute inset-0 pointer-events-none"
          >
        
            {/* 🍌 Pisang Kiri Tengah */}
            <div className="absolute top-[40%] md:top-[27%] left-[2%] sm:left-[4%] md:left-[6%] lg:left-[8%] xl:left-[5%]">
              <div className="relative w-[80px] sm:w-[100px] md:w-[120px] lg:w-[160px] xl:w-[180px] aspect-[3/4]">
                <Image 
                  src="/images/pisang.webp" 
                  alt="Pisang" 
                  fill 
                  loading="lazy"
                  sizes="(max-width: 768px) 80px, 120px"
                />
              </div>
            </div>

            {/* 🍓 Stroberi Kiri Atas */}
            <div className="absolute top-[16%] md:top-[13%] left-[5%] sm:left-[7%] md:left-[8%] lg:left-[10%] xl:left-[15%]">
              <div className="relative w-[60px] sm:w-[70px] md:w-[80px] lg:w-[90px] xl:w-[100px] aspect-square">
                <Image 
                  src="/images/straw.webp" 
                  alt="Strawberry" 
                  fill 
                  className="drop-shadow-lg" 
                  loading="lazy"
                  sizes="(max-width: 768px) 70px, 100px"
                />
              </div>
            </div>

            {/* 🥬 Sayur Background Kiri Bawah */}
            <div className="absolute bottom-[-2%] sm:bottom-[-3%] md:bottom-[-2%] lg:bottom-[-4%] xl:bottom-[-5%] left-[-12%] sm:left-[-5%] lg:left-[-10%] xl:left-[-7%]">
              <div className="relative w-[150px] sm:w-[250px] md:w-[300px] lg:w-[480px] xl:w-[600px] aspect-[3/2]">
                <Image 
                  src="/images/54999735_9329466.webp" 
                  alt="Vegetable Side" 
                  fill 
                  className="relative z-10 drop-shadow-lg" 
                  loading="lazy"
                  sizes="(max-width: 768px) 250px, 600px"
                />
              </div>
            </div>

            {/* 🥗 Gambar Utama (Tengah) */}
            <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-full px-4 sm:px-8">
              <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[850px] aspect-[850/382]">
                <Image
                  src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bdddbe6abf.webp"
                  alt="Fresh Vegetables Main"
                  width={850}
                  height={382}
                  className="object-contain"
                  priority={true}
                  loading="eager"
                  style={{
                    filter:
                      'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.2)) drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.3))',
                  }}
                  sizes="(max-width: 768px) 100vw, 850px"
                />
              </div>
            </div>

            {/* 🍓 Stroberi Kanan Atas */}
            <div className="absolute top-[20%] right-[10%] sm:right-[7%] md:right-[8%] lg:right-[10%] xl:right-[10%]">
              <div className="relative w-[75px] sm:w-[90px] md:w-[110px] lg:w-[130px] xl:w-[150px] aspect-square">
                <Image 
                  src="/images/straw.webp" 
                  alt="Strawberry" 
                  fill 
                  className="drop-shadow-lg" 
                  loading="lazy"
                  sizes="(max-width: 768px) 90px, 150px"
                />
              </div>
            </div>

            {/* 🥝 Kiwi Kanan Bawah */}
            <div className="absolute bottom-[15%] md:bottom-[10%] right-[0%] sm:right-[2%] md:right-[0%] lg:right-[2%] xl:right-[3%]">
              <div className="relative w-[100px] sm:w-[150px] md:w-[180px] lg:w-[250px] xl:w-[300px] aspect-[4/4]">
                <Image 
                  src="/images/kiwi.webp" 
                  alt="Kiwi" 
                  fill 
                  className="drop-shadow-lg" 
                  loading="lazy"
                  sizes="(max-width: 768px) 150px, 300px"
                />
              </div>
            </div>

          </motion.div>
          <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
          <RegisterModal
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
          />
        </section>

        {/* Isi Konten 1 */}
        <motion.section
          id="programdiet"
          ref={programdietRef}
          className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white text-center px-4 sm:px-6 md:px-8 lg:px-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-red-600 mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight">
            Temukan KaloriME
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            Solusi digital berbasis data Kaggle untuk bantu kelola berat badan
            dan pahami gizi.
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-2 sm:mt-0">
              Langkah awal menuju hidup lebih sehat dan terinformasi.
            </span>
          </p>
          <div className="w-full max-w-7xl mx-auto">
            <LandingTabs />
          </div>
        </motion.section>

        {/* Isi Konten 2 */}
        <motion.section
          id="carakerja"
          ref={carakerjaRef}
          className="relative overflow-hidden min-h-[35vh] sm:min-h-[80vh] md:min-h-[90vh] lg:min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20  rounded-4xl"
          style={{
            backgroundColor: "#A6A6A6",
            backgroundImage: "url('/images/gray-textured-wall.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-black/40 sm:bg-black/45 md:bg-black/50 z-20"></div>
          <div className="absolute inset-0 bg-[#A6A6A6]/40 sm:bg-[#A6A6A6]/45 md:bg-[#A6A6A6]/50 z-10"></div>

          <div className="absolute right-[-105px] sm:right-[-145px] md:right-[-178px] lg:right-[-230px] xl:right-[-285px] top-[5px] sm:top-[-5px] md:top-[-15px] lg:top-[-30px] xl:top-[-40px] z-30">
            <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] xl:w-[566px] xl:h-[566px]">
              <Image
                src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bddbe6abf.webp"
                alt="bg image kanan"
                fill
                className="drop-shadow-lg object-contain"
                loading="lazy"
                sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, (max-width: 1024px) 350px, (max-width: 1280px) 450px, 566px"
              />
            </div>
          </div>

          <div className="absolute left-[-105px] sm:left-[-145px] md:left-[-178px] lg:left-[-230px] xl:left-[-285px] bottom-[5px] sm:bottom-[-5px] md:bottom-[-15px] lg:bottom-[-30px] xl:bottom-[-40px] z-30">
            <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] xl:w-[566px] xl:h-[566px]">
              <Image
                src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bddbe6abf.webp"
                alt="bg image kiri"
                fill
                className="drop-shadow-lg"
                loading="lazy"
                sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, (max-width: 1024px) 350px, (max-width: 1280px) 450px, 566px"
              />
            </div>
          </div>

          <div className="relative w-full flex justify-center z-30 px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="relative w-full max-w-[300px] h-[500px] sm:max-w-[700px] sm:h-[608px] md:max-w-[800px] md:h-[600px] lg:max-w-[850px] lg:h-[680px] xl:max-w-[1000px] xl:h-[850px]">
              <Image
                src="/images/Group 9.webp"
                alt="cara kerja"
                fill
                className="drop-shadow-lg object-contain hidden sm:block w-full"
                loading="lazy"
                sizes="(max-width: 640px) 300px, (max-width: 768px) 700px, (max-width: 1024px) 800px, (max-width: 1280px) 850px, 1000px"
              />

              <Image
                src="/images/cara kerja m.webp"
                alt="cara kerja mobile"
                fill
                className="block sm:hidden"
                loading="lazy"
                sizes="100vw"
              />
            </div>
          </div>
        </motion.section>

        {/* Isi konten 3 */}
        {/* Tentang Kami Section */}
        <motion.section
          id="tentangkami"
          ref={tentangkamiRef}
          className="bg-white grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Image */}
          <div className="flex justify-center order-1 lg:order-1">
            <div className="relative w-full max-w-[280px] h-[340px] sm:max-w-[320px] sm:h-[390px] md:max-w-[350px] md:h-[430px] lg:max-w-[380px] lg:h-[460px]">
              <Image
                src="/images/7775312_3760906.webp"
                alt="tentang kami"
                fill
                className="object-cover rounded-xl sm:rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-left order-2 lg:order-2 px-2 sm:px-4 md:px-6 lg:px-8">
            <h4 className="text-teal-500 text-base sm:text-lg md:text-xl font-semibold mb-2">
              Tentang Kami
            </h4>
            <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              "KaloriME, solusi modern yang didukung sains untuk tubuh idealmu."
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-black font-normal whitespace-pre-line leading-relaxed">
              KaloriME adalah platform kesehatan digital yang membantu Anda
              mencapai berat badan ideal dan hidup lebih sehat melalui
              pendekatan ilmiah dan teknologi cerdas. Dengan fitur pelacak
              kalori, pencarian makanan, dan rekomendasi pola makan, KaloriME
              menjadi pendamping harian Anda dalam perjalanan menuju gaya hidup
              sehat yang lebih mudah, efektif, dan menyenangkan.
            </p>
          </div>
        </motion.section>

        {/* Divider */}
        <hr className="border-t-2 border-teal-400 w-4/5 sm:w-5/6 mx-auto drop-shadow-lg my-6 sm:my-8 md:my-10" />

        {/* Fitur Unggulan Section */}
        <motion.section className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Kiri - Fitur Unggulan */}
          <div className="text-center lg:text-left max-w-md lg:max-w-none">
            <h2 className="text-red-600 text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Fitur Unggulan :
            </h2>
            <ul className="space-y-3 sm:space-y-4 text-black text-base sm:text-lg font-medium">
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <MdRestaurant
                  size={35}
                  className="sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] bg-teal-400 text-white p-2 rounded-full flex-shrink-0"
                />
                <span className="text-left">Pelacak kalori otomatis</span>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <MdSearch
                  size={35}
                  className="sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] bg-blue-500 text-white p-2 rounded-full flex-shrink-0"
                />
                <span className="text-left">
                  Rekomendasi pola makan personal
                </span>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <MdEco
                  size={35}
                  className="sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] bg-orange-400 text-white p-2 rounded-full flex-shrink-0"
                />
                <span className="text-left">
                  Pencarian makanan bergizi berbasis data
                </span>
              </li>
            </ul>
          </div>

          {/* Garis Vertikal (hanya di desktop) */}
          <div className="hidden lg:block w-px h-32 md:h-40 lg:h-50 bg-gray-400"></div>

          {/* Kanan - Tombol CTA */}
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="text-center px-2 sm:px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-4 sm:mb-6 leading-tight">
                Siap Memulai Perjalanan Sehat Anda?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-black mb-6 sm:mb-8">
                Bergabunglah dengan ribuan orang yang telah merasakan manfaatnya
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRegister(true);
                  }}
                  className="w-full sm:w-auto bg-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-teal-500 shadow-md hover:bg-white/90 hover:text-teal-500 transition-all duration-300 ease-in-out backdrop-blur-sm hover:scale-105"
                >
                  Daftar Gratis Sekarang
                </a>
                  <DemoModal />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Logo dan Sosial Media */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <div className="mb-6">
                  {/* Logo */}
                  <div className="flex items-center mb-4 ml-[-30]">
                    <Image
                    src="/images/KaloriME2.webp"
                    alt="Logo KaloriME"
                    width={250}
                    height={250}
                    priority={true}
                  />
                  </div>
                  
                  {/* Deskripsi Singkat */}
                  <p className="text-gray-300 text-sm mb-6 max-w-xs">
                    Platform diet sehat dan gaya hidup yang membantu Anda mencapai berat badan ideal dengan mudah.
                  </p>
                  
                  {/* Social Media Icons */}
                  <div className="flex space-x-4">
                    <a href="#"
                       aria-label="Facebook" 
                       className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Facebook size={18} />
                    </a>
                    <a href="#" 
                       aria-label="Instagram"
                       className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Instagram size={18} />
                    </a>
                    <a href="#" 
                       aria-label="Twitter"
                       className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Twitter size={18} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              {/* Layanan */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Layanan</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                      Terms of Use
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tautan Cepat */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Tautan Cepat</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <button 
                      onClick={() => scrollToSection('berandaRef')}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm text-left"
                    >
                      Beranda
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('programdietRef')}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm text-left"
                    >
                      Program Diet
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('carakerjaRef')}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm text-left"
                    >
                      Cara Kerja
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('tentangkamiRef')}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm text-left"
                    >
                      Tentang Kami
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xl font-semibold mb-3">Lokasi</h4>
              <div>
                <DynamicMap />
                <h2 className="text-lg my-5 font-medium"></h2>
              </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-2 sm:mb-0">
              © 2025 KaloriME. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

        {/* button back to top */}
        {showButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-teal-500 text-white px-6 py-6 rounded-full shadow-lg z-[9999] drop-shadow-lg hover: transition"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>

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
}
