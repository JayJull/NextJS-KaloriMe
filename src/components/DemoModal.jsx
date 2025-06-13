// Di DemoModal.jsx
'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DemoModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Tampilkan hanya di halaman beranda
  if (pathname !== '/') return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto bg-white/90 text-teal-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-teal-500 shadow-md hover:bg-teal-500 hover:text-white transition-all duration-300 ease-in-out backdrop-blur-sm hover:scale-105"
      >
        Lihat Demo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-3xl aspect-video">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-4 -right-4 text-white text-3xl font-bold z-10 hover:scale-110 transition-transform"
            >
                &times;
            </button>
            <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/WIjJyiY4850"
                title="Demo KaloriME"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            </div>
        </div>
        )}
    </>
  );
}
