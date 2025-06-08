"use client"
import Image from "next/image";
import LandingTabs from "../src/components/landingtabs";
import { MdRestaurant, MdSearch, MdEco, } from "react-icons/md";
import { FaArrowUp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useState, useRef, useEffect } from "react";
import LoginModal from "@/views/login/LoginModal";
import RegisterModal from "@/views/register/RegisterModal";
import dynamic from 'next/dynamic';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  const berandaRef = useRef(null);
  const programdietRef = useRef(null);
  const carakerjaRef = useRef(null);
  const tentangkamiRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const DynamicMap = dynamic(() => import('../src/components/MapComponent'), {
    ssr: false,
  });

  const scrollToSection = (ref, sectionName) => {
    setActiveSection(sectionName);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: '#00A999',
          backgroundImage: "url('/images/grey-felt-texture.jpg')"
        }}>
        <div className="absolute inset-0 bg-[#00A999]/95"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[70px] sm:h-[80px] lg:h-[90px]">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="">
                <Image
                  src="/images/KaloriME Putih.png"
                  alt="KaloriME"
                  width={150}
                  height={150}
                  className="drop-shadow-lg sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px]"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button onClick={() => scrollToSection(berandaRef, "beranda")}
                className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${activeSection === "beranda" ? "underline" : ""}`}>
                Beranda
              </button>
              <button onClick={() => scrollToSection(programdietRef, "programdiet")}
                className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${activeSection === "programdiet" ? "underline" : ""}`}>
                Program Diet
              </button>
              <button onClick={() => scrollToSection(carakerjaRef, "carakerja")}
                className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${activeSection === "carakerja" ? "underline" : ""}`}>
                Cara Kerja
              </button>
              <button onClick={() => scrollToSection(tentangkamiRef, "tentangkami")}
                className={`text-white hover:underline underline-offset-4 font-semibold text-base xl:text-lg transition-all duration-200 ${activeSection === "tentangkami" ? "underline" : ""}`}>
                Tentang Kami
              </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <a href="#"
                 onClick={(e) => {e.preventDefault(); setShowRegister(true);}}
                 className="bg-white text-teal-600 px-4 py-2 xl:px-6 xl:py-2 rounded-full font-semibold text-sm xl:text-base border border-white hover:bg-transparent hover:text-white transition-all duration-300"
              >DAFTAR</a>

              <a href="#"
                 onClick={(e) => {e.preventDefault(); setShowLogin(true);}}
                 className="border border-white text-white px-4 py-2 xl:px-6 xl:py-2 rounded-full hover:bg-white hover:text-teal-600 transition-colors font-semibold duration-300"
              >LOGIN</a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gray-200 focus:outline-none p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
            <div className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-lg mt-2 shadow-lg">
              <button
                onClick={() => {
                  scrollToSection(berandaRef, "beranda");
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${activeSection === "beranda" ? "bg-teal-100 text-teal-700" : ""}`}>
                Beranda
              </button>
              <button
                onClick={() => {
                  scrollToSection(programdietRef, "programdiet");
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${activeSection === "programdiet" ? "bg-teal-100 text-teal-700" : ""}`}>
                Program Diet
              </button>
              <button
                onClick={() => {
                  scrollToSection(carakerjaRef, "carakerja");
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${activeSection === "carakerja" ? "bg-teal-100 text-teal-700" : ""}`}>
                Cara Kerja
              </button>
              <button
                onClick={() => {
                  scrollToSection(tentangkamiRef, "tentangkami");
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-gray-800 font-semibold hover:bg-teal-50 px-4 py-3 transition-colors ${activeSection === "tentangkami" ? "bg-teal-100 text-teal-700" : ""}`}>
                Tentang Kami
              </button>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 px-4 pt-3 border-t border-gray-200">
                <a href="#"
                   onClick={(e) => {
                   e.preventDefault(); setShowRegister(true);}}
                className="bg-teal-600 text-white px-4 py-2 rounded-full font-semibold text-center hover:bg-teal-700 transition-colors duration-300"
              >DAFTAR</a>

              <a href="#"
                 onClick={(e) => {e.preventDefault(); setShowLogin(true);}}
                 className="border border-teal-600 text-teal-600 px-4 py-2 rounded-full font-semibold text-center hover:bg-teal-600 hover:text-white transition-colors duration-300"
              >LOGIN</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
        <section id="beranda" ref={berandaRef} className="relative overflow-hidden min-h-[55vh] sm:min-h-[70vh] md:min-h-[70vh] lg:min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20"
          style={{
            backgroundColor: '#00A999',
            backgroundImage: "url('/images/grey-felt-texture.jpg')"
          }}>
          <div className="absolute inset-0 bg-[#00A999]/95"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:py-10 lg:px-8 w-full relative z-10">
            <div className="flex justify-center items-center -mt-50">
              <div className="text-white text-center w-full">
                <h1 className="text-md mt-45 sm:mt-25 text-2xl mb-1 md:text-4xl mt-8 lg:text-5xl font-bold leading-tight mb-3">
                  Buat Perjalanan Sehatmu
                  <span className="block text">
                    Lebih Mudah dan Fun!
                  </span>
                </h1>
                <p className="text-sm font-normal mb-8 leading-relaxed mx-auto max-w-2xl sm:text-md max-w-md md:max-w-2xl lg:text-2xl xl:max-w-4xl">
                  Dari tracking kalori hingga konsultasi dengan ahli gizi
                  langsung yang cocok untuk kamu semua jadi lebih mudah dengan
                  teknologi AI yang canggih!
                </p>
              </div>
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
          <div className="absolute inset-0 pointer-events-none">

            {/* Left Side Images */}
            <div className="absolute left-5 top-0 sm:left-5 top-0 md:left-10 top-0 lg:left-10 top-[220] xl:left-35 top-70">
              <div className="relative w-[80] h-[80] sm:w-[100] sm:h-[90] md:w-[110] md:h-[100] lg:w-[160] lg:h-[160] xl:w-[180] xl:h-[180]">
                <Image
                  src="/images/pisang.png"
                  alt="Pisang"
                  fill
                  className="drop-shadow-lg"
                />
              </div>
            </div>

            <div className="absolute top-[85px] left-0 sm:left-5 top-0 md:left-20 top-0 lg:left-35 top-10 xl:left-50 top-20">
              <div className="relative w-[60] h-[60] sm:w-[70] sm:h-[70] md:w-[80] md:h-[80] lg:w-[90] lg:h-[90] xl:w-[100] xl:h-[100]">
                <Image
                  src="/images/straw.png"
                  alt="stroberi"
                  fill
                  className="drop-shadow-lg"
                  />
              </div>
            </div>

            <div className="absolute right-66 top-[275px] sm:right-110 top-81 md:right-135 top-74 lg:top-[392px] lg:left-[-100px] xl:left-[-100px] xl:top-[420px]">
              <div className="relative w-[150] h-[100] sm:w-[250] sm:h-[165] md:w-[300] md:h-[200] lg:w-[480] lg:h-[320] xl:w-[600px] xl:h-[400px]">
                <div className="absolute"></div>
                <Image
                  src="/images/54999735_9329466.png"
                  alt="Fresh Vegetables"
                  fill
                  className="relative z-10 drop-shadow-lg"
                />
              </div>
            </div>

            <div className="absolute right-14 sm:right-30 md:right-28 lg:right-65 xl:right-85 top-67 sm:top-75 md:top-[280px] lg:top-[380px] xl:top-[420px]">
              <div className="relative w-[260px] h-[126px] sm:w-[400px] sm:h-[180px] md:w-[550px] md:h-[248px] lg:w-[700px] lg:h-[315px] xl:w-[850px] xl:h-[382px]">
                <Image
                  src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bdddbe6abf.png"
                  alt="Fresh Vegetables Main"
                  fill
                  className="object-contain"
                  style={{ 
                    filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.2)) drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.3))'
                  }}
                />
              </div>
            </div>

            {/* Right Side Images */}
            <div className="absolute right-1 top-0 sm:right-1 top-0 md:right-2 top-35 lg:right-10 top-35 xl:right-15 top-40 ">
              <div className="relative w-[75] h-[75] sm:w-[90] sm:h-[90] md:w-[110] md:h-[110] lg:w-[130] lg:h-[130] xl:w-[150] xl:h-[150]">
                <Image
                  src="/images/straw.png"
                  alt="stroberi"
                  fill
                  className="drop-shadow-lg"
                  />
              </div>
            </div>

            <div className="absolute right-0 bottom-0 sm:right-5 bottom-[50px] md:right-2 bottom-[25px] lg:right-10 bottom-0 xl:right-15 bottom-20">
              <div className="relative w-[100] h-[100] sm:w-[150] sm:h-[150] md:w-[180] md:h-[180] lg:w-[270] lg:h-[270] xl:w-[300] xl:h-[300]">
                <Image
                  src="/images/kiwi.png"
                  alt="kiwi"
                  fill
                  className="drop-shadow-lg"
                />
              </div>
            </div>
          </div>
          <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
          <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
        </section>

      {/* Isi Konten 1 */}
      <section 
        id="programdiet" 
        ref={programdietRef} 
        className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white text-center px-4 sm:px-6 md:px-8 lg:px-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-red-600 mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight">
          Temukan KaloriME
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          Solusi digital berbasis data Kaggle untuk bantu kelola berat badan dan pahami gizi.
          <br className="hidden sm:block" />
          <span className="block sm:inline mt-2 sm:mt-0">
            Langkah awal menuju hidup lebih sehat dan terinformasi.
          </span>
        </p>
        <div className="w-full max-w-7xl mx-auto">
          <LandingTabs />
        </div>
      </section>

      {/* Isi Konten 2 */}
      <section 
        id="carakerja" 
        ref={carakerjaRef} 
        className="relative overflow-hidden min-h-[35vh] sm:min-h-[80vh] md:min-h-[90vh] lg:min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20  rounded-4xl"
        style={{
          backgroundColor: '#A6A6A6',
          backgroundImage: "url('/images/gray-textured-wall.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className="absolute inset-0 bg-black/40 sm:bg-black/45 md:bg-black/50 z-20"></div>
        <div className="absolute inset-0 bg-[#A6A6A6]/40 sm:bg-[#A6A6A6]/45 md:bg-[#A6A6A6]/50 z-10"></div>

        <div className="absolute right-[-105px] sm:right-[-145px] md:right-[-178px] lg:right-[-230px] xl:right-[-285px] top-[5px] sm:top-[-5px] md:top-[-15px] lg:top-[-30px] xl:top-[-40px] z-30">
          <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] xl:w-[566px] xl:h-[566px]">
            <Image
              src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bddbe6abf.png"
              alt="bg image kanan"
              fill
              className="drop-shadow-lg object-contain"
            />
          </div>
        </div>

        <div className="absolute left-[-105px] sm:left-[-145px] md:left-[-178px] lg:left-[-230px] xl:left-[-285px] bottom-[5px] sm:bottom-[-5px] md:bottom-[-15px] lg:bottom-[-30px] xl:bottom-[-40px] z-30">
          <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] xl:w-[566px] xl:h-[566px]">
            <Image
              src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bddbe6abf.png"
              alt="bg image kiri"
              fill
              className="drop-shadow-lg"
            />
          </div>
        </div>

        <div className="relative w-full flex justify-center z-30 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="relative w-full max-w-[200px] h-[300px] sm:max-w-[700px] sm:h-[608px] md:max-w-[800px] md:h-[600px] lg:max-w-[850px] lg:h-[680px] xl:max-w-[1000px] xl:h-[850px]">
          <Image
            src="/images/Group 9.png"
            alt="cara kerja"
            fill
            className="drop-shadow-lg object-contain hidden sm:block w-full"
          />

          <Image
            src="/images/cara kerja m.png"
            alt="cara kerja mobile"
            fill
            className="block sm:hidden"
          />
        </div>
      </div>
      </section>

      {/* Isi konten 3 */}
      {/* Tentang Kami Section */}
      <section 
        id="tentangkami" 
        ref={tentangkamiRef} 
        className="bg-white grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16"
      >
        {/* Image */}
        <div className="flex justify-center order-1 lg:order-1">
          <div className="relative w-full max-w-[280px] h-[340px] sm:max-w-[320px] sm:h-[390px] md:max-w-[350px] md:h-[430px] lg:max-w-[380px] lg:h-[460px]">
            <Image
              src='/images/7775312_3760906.jpg'
              alt='tentang kami'
              fill
              className="object-cover rounded-xl sm:rounded-2xl"
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
            KaloriME adalah platform kesehatan digital yang membantu Anda mencapai berat badan ideal dan hidup lebih sehat melalui pendekatan ilmiah dan teknologi cerdas.
            Dengan fitur pelacak kalori, pencarian makanan, dan rekomendasi pola makan, KaloriME menjadi pendamping harian Anda dalam perjalanan menuju gaya hidup sehat yang lebih mudah, efektif, dan menyenangkan.
          </p>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-t-2 border-teal-400 w-4/5 sm:w-5/6 mx-auto drop-shadow-lg my-6 sm:my-8 md:my-10" />

      {/* Fitur Unggulan Section */}
      <section className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
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
              <span className="text-left">Rekomendasi pola makan personal</span>
            </li>
            <li className="flex items-center gap-3 justify-center lg:justify-start">
              <MdEco 
                size={35} 
                className="sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] bg-orange-400 text-white p-2 rounded-full flex-shrink-0" 
              />
              <span className="text-left">Pencarian makanan bergizi berbasis data</span>
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
              <a href="#"
                   onClick={(e) => {
                   e.preventDefault(); setShowRegister(true);}}
                className="w-full sm:w-auto bg-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-teal-500 shadow-md hover:bg-white/90 hover:text-teal-500 transition-all duration-300 ease-in-out backdrop-blur-sm hover:scale-105"
              >Daftar Gratis Sekarang</a>

              <a href="" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white/90 text-teal-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-teal-500 shadow-md hover:bg-teal-500 hover:text-white transition-all duration-300 ease-in-out backdrop-blur-sm hover:scale-105">
                  Lihat Demo
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo dan Sosial Media */}
          <div className="flex flex-col items-center justify-start space-y-5">

            {/* Logo Placeholder */}
            <Image
              src='/images/KaloriME2.png'
              alt='Logo KaloriME'
              width={250}
              height={250}
            />

            {/* Icon Media Sosial */}
            <div className="flex space-x-4 mt-2 text-white text-2xl">
              <a href="#"><i className="fab fa-facebook-f text-xl"></i><FaFacebook /></a>
              <a href="#"><i className="fab fa-instagram text-xl"></i><FaInstagram /></a>
              <a href="#"><i className="fab fa-x-twitter text-xl"></i><FaTwitter /></a>
            </div>
          </div>

          {/* Layanan */}
          <div className="mx-auto w-fit">
            <h4 className="text-xl font-semibold mb-3">Layanan</h4>
            <ul className="space-y-2 text-lg text-gray-300">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact US</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms Of Use</a></li>
            </ul>
          </div>


          {/* Tautan Cepat */}
          <div className="mx-auto w-fit">
            <h4 className="text-xl font-semibold mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-lg text-gray-300">
              <li><button onClick={() => scrollToSection(berandaRef)}>Beranda</button></li>
              <li><button onClick={() => scrollToSection(programdietRef)}>Progam Diet</button></li>
              <li><button onClick={() => scrollToSection(carakerjaRef)}>Cara Kerja</button></li>
              <li><button onClick={() => scrollToSection(tentangkamiRef)}>Tentang Kami</button></li>
            </ul>
          </div>

          {/* Map */}
          <div className="mx-auto w-fit mb-10">
            <h4 className="text-xl font-semibold mb-3">Lokasi</h4>
            <div>
              <DynamicMap />
              <h2 className="text-lg my-5 font-medium"></h2>
            </div>
          </div>
        </div>

        <hr className="my-10 border-white" />

        <div className="text-center text-lg text-white">
          © 2025 KaloriME.
        </div>
      </footer>

      {/* button back to top */}
      {showButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-teal-500 text-white px-6 py-6 rounded-full shadow-lg z-[9999] drop-shadow-lg hover: transition"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

