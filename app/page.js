"use client"
import Image from "next/image";
import LandingTabs from "./LandingTabs/landingtabs";
import { MdRestaurant, MdSearch, MdEco, } from "react-icons/md";
import { FaArrowUp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("beranda");

  const berandaRef = useRef(null);
  const programdietRef = useRef(null);
  const carakerjaRef = useRef(null);
  const tentangkamiRef = useRef(null);
  const [showButton, setShowButton] = useState(false);


  const scrollToSection = (ref,sectionName) => {
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
          <div className="w-auto h-[90px] flex justify-between h-16 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="">
                <Image 
                  src="/images/KaloriME Putih.png"
                  alt="KaloriME"
                  width={250}
                  height={250}
                  className="drop-shadow-lg"
                />
              </div> 
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12 text-lg">
              <button onClick={() => scrollToSection(berandaRef, "beranda")} className={`text-white hover:underline underline-offset-5 font-bold ${activeSection === "beranda" ? "underline" : ""}`}>Beranda</button>
              <button onClick={() => scrollToSection(programdietRef, "programdiet")} className={`text-white hover:underline underline-offset-5 font-bold ${activeSection === "programdiet" ? "underline" : ""}`}>Program Diet</button>
              <button onClick={() => scrollToSection(carakerjaRef, "carakerja")} className={`text-white hover:underline underline-offset-5 font-bold ${activeSection === "carakerja" ? "underline" : ""}`}>Cara Kerja</button>
              <button onClick={() => scrollToSection(tentangkamiRef, "tentangkami")} className={`text-white hover:underline underline-offset-5 font-bold ${activeSection === "tentangkami" ? "underline" : ""}`}>Tentang Kami</button>

              <div className="flex items-center space-x-4 ml-8">
                <a href="/register" className="bg-white text-teal-600 px-6 py-2 rounded-full font-semibold border border-white hover:bg-transparent hover:text-white transition-colors duration-300">
                  DAFTAR
                </a>
                <a href="/login" className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-teal-600 transition-colors font-semibold duration-300">
                  MASUK
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="text-white-500 hover:text-white-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

    {/* Hero Section */}
      <section id="beranda" ref={berandaRef} className="relative overflow-hidden min-h-screen flex items-center" 
               style={{ 
                backgroundColor: '#00A999',
                backgroundImage: "url('/images/grey-felt-texture.jpg')"
               }}>
               <div className="absolute inset-0 bg-[#00A999]/95"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex justify-center items-center -mt-40">
            <div className="text-white text-center w-full">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Buat Perjalanan Sehatmu
                <span className="block text">
                  Lebih Mudah dan Fun!
                </span>
              </h1>
              <p className="text-xl font-normal mb-8 leading-relaxed mx-auto max-w-2xl">
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
          <div className="absolute left-4 lg:left-30 top-90 transform -translate-y-1/2">
            <div className="">
              <Image
                src="/images/pisang.png"
                alt="Pisang"
                width={200}
                height={200}
                className="drop-shadow-lg"
              />
            </div>
          </div>

          <div className="absolute right-2 lg:right-325 top-30 transform -translate-y-1/2">
              <Image
                src="/images/straw.png"
                alt="stroberi"
                width={100}
                height={100}
                className="drop-shadow-lg"
              />
          </div>
          
          <div className="absolute lg:right-240 top-105">
            <div className="relative w-[700px] h-[700px]">
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-[40px] bg-black/20 rounded-full blur-md z-0"></div>
              <Image
                src="/images/54999735_9329466.png"
                alt="Fresh Vegetables"
                width={600}
                height={600}
                className="relative z-10 drop-shadow-lg"
              />
            </div>
          </div>

          <div className="absolute lg:right-85 top-110">
            <div className="">
              <Image
                src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bdddbe6abf.png"
                alt="Fresh Vegetables Main"
                width={850}
                height={382}
                style={{ filter: 'drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.3))' }}
              />
            </div>
          </div>

          {/* Right Side Images */}
          <div className="absolute right-2 lg:right-15 top-50 transform -translate-y-1/2">
              <Image
                src="/images/straw.png"
                alt="stroberi"
                width={150}
                height={150}
                className="drop-shadow-lg"
              />
          </div>

          <div className="absolute right-9 lg:right-15 bottom-20">
            <div className="">
              <Image
                src="/images/kiwi.png"
                alt="kiwi"
                width={300}
                height={300}
                className="drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Isi Konten 1 */}
      <section id="programdiet" ref={programdietRef} className="py-16 bg-white text-center px-4">

        <h2 className="text-3xl lg:text-5xl font-bold text-red-600 mb-4 tracking-tight">
          Temukan KaloriME
        </h2>
        <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
          Solusi digital berbasis data Kaggle untuk bantu kelola berat badan dan pahami gizi. 
          <br/>
          Langkah awal menuju hidup lebih sehat dan terinformasi.
        </p>
        <LandingTabs />
      </section>

      {/* Isi Konten 2 */}
      <section id="carakerja" ref={carakerjaRef} className="relative overflow-hidden min-h-screen flex items-center rounded-4xl"
        style={{ 
                backgroundColor: '#A6A6A6',
                backgroundImage: "url('/images/gray-textured-wall.jpg')",
                backgroundSize: 'cover'
               }}>
               <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
               <div className="absolute inset-0 bg-[#A6A6A6]/50"></div>
        
        <div className="absolute right-9 or right-[-285px] top-[-40px] z-30">
            <div className="">
              <Image
                src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bddbe6abf.png"
                alt="bg image kanan"
                width={566}
                height={566}
                className="drop-shadow-lg"
              />
            </div>
          </div>

        <div className="absolute left-9 or left-[-285px] top-[250px] z-30">
            <div className="">
              <Image
                src="/images/405493453_b83b297c-be8b-4cb8-b0cc-f79bddbe6abf.png"
                alt="bg image kiri"
                width={566}
                height={566}
                className="drop-shadow-lg"
              />
            </div>
          </div>

        <div className="absolute w-full flex justify-center z-30">
              <Image
                src="/images/Group 9.png"
                alt="cara kerja"
                width={1000}
                height={850}
                className="drop-shadow-lg"
              />
        </div>
      </section>

      {/* Isi konten 3 */}
      <section id="tentangkami" ref={tentangkamiRef} className="bg-white grid md:grid-cols-2 gap-10 items-center pt-15">
        <div className="flex justify-center">
            <div className="relative w-[350px] h-[430px] left-9 or left-[70px]">
                <Image
                    src='/images/7775312_3760906.jpg'
                    alt='tentang kami'
                    fill
                    className="object-cover rounded-2xl"
                />
            </div>
          </div>

        <div className='text-left px-10 relative right-9 or right-[70px]'>
          <h4 className="text-teal-500 text-xl font-semibold mb-2">Tentang Kami</h4>
          <h2 className="text-black text-3xl md:text-4xl font-bold mb-4">“KaloriME, solusi modern yang didukung sains untuk tubuh idealmu.”</h2>
          <p className="text-lg text-black font-normal whitespace-pre-line">KaloriME adalah platform kesehatan digital yang membantu Anda mencapai berat badan ideal dan hidup lebih sehat melalui pendekatan ilmiah dan teknologi cerdas.
            Dengan fitur pelacak kalori, pencarian makanan, dan rekomendasi pola makan, KaloriME menjadi pendamping harian Anda dalam perjalanan menuju gaya hidup sehat yang lebih mudah, efektif, dan menyenangkan.</p>
        </div>
      </section>

      {/* Fitur unggulan */}
      <hr className="border-t-2 border-teal-400 w-5/6 mx-auto drop-shadow-lg" />

      <section className="flex flex-col md:flex-row items-center justify-center gap-20 pt-15 pb-15">
        {/* Kiri - Fitur Unggulan */}
        <div className="text-center md:text-left">
          <h2 className="text-red-600 text-3xl font-bold mb-6">Fitur Unggulan :</h2>
          <ul className="space-y-4 text-black text-lg font-medium">
            <li className="flex items-center gap-3">
              <MdRestaurant size={45} className="text-xl bg-teal-400 text-white p-2 rounded-full"/>
              <span>Pelacak kalori otomatis</span>
            </li>
            <li className="flex items-center gap-3">
              <MdSearch size={45} className="text-xl bg-blue-500 text-white p-2 rounded-full"/>
              <span>Rekomendasi pola makan personal</span>
            </li>
            <li className="flex items-center gap-3">
              <MdEco size={45} className="text-xl bg-orange-400 text-white p-2 rounded-full"/>
              <span>Pencarian makanan bergizi berbasis data</span>
            </li>
          </ul>
        </div>

        {/* Garis Vertikal (hanya di desktop) */}
        <div className="hidden md:block w-px h-50 bg-gray-400"></div>

        {/* Kanan - Tombol CTA */}
        <div className="py-10">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-3xl font-bold text-red-600 mb-6">
              Siap Memulai Perjalanan Sehat Anda?
            </h2>
            <p className="text-l text-black mb-8">
              Bergabunglah dengan ribuan orang yang telah merasakan manfaatnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register">
                <button className="bg-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-teal-500 shadow-md hover:bg-white/90 hover:text-teal-500 transition-all duration-300 ease-in-out backdrop-blur-sm hover:scale-105">
                  Daftar Gratis Sekarang
                </button>
              </a>

              <a href="">
              <button className="bg-white/90 text-teal-500 px-8 py-4 rounded-full text-lg font-semibold border-2 border-teal-500 shadow-md hover:bg-teal-500 hover:text-white transition-all duration-300 ease-in-out backdrop-blur-sm hover:scale-105">
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
        <div className="flex flex-col items-start justify-center space-y-4">

          {/* Logo Placeholder */}
          <div>
            <Image
              src='/images/KaloriME2.png'
              alt='Logo KaloriME'
              width={250}
              height={250}
            />
          </div>

          {/* Icon Media Sosial */}
          <div className="flex space-x-4 mt-2 text-white text-3xl">
            <a href="#"><i className="fab fa-facebook-f text-xl"></i><FaFacebook/></a>
            <a href="#"><i className="fab fa-instagram text-xl"></i><FaInstagram/></a>
            <a href="#"><i className="fab fa-x-twitter text-xl"></i><FaTwitter/></a>
          </div>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Layanan</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
          </ul>
        </div>

        {/* Tautan Cepat */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Tautan Cepat</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
            <li><a href="#">Lorem Ipsum</a></li>
          </ul>
        </div>
      </div>

      <hr className="my-8 border-gray-500" />

      <div className="text-center text-sm text-gray-400">
        © 2025 KaloriME.
      </div>
    </footer>

      {/* button back to top */}
      {showButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-teal-500 text-white px-6 py-6 rounded-full shadow-lg z-40 drop-shadow-lg hover: transition"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}