import { useState } from 'react';
import Image from 'next/image';

const tabs = [
  { key: 'misi', label: 'Misi Tubuh Ideal' },
  { key: 'kandungan', label: 'Kandungan Makanan' },
  { key: 'nutrisi', label: 'Nutrisi Harian' },
];

const contents = {
  misi: {
    title: 'Cari Makanan, Cek Gizi, Capai Target',
    subtitle: 'Misi Tubuh Ideal',
    description: `Wujudkan tubuh ideal tanpa repot.
      Gunakan fitur pencarian kami untuk mengetahui kandungan kalori dan gizi dari lebih dari 100 makanan—mulai dari masakan rumahan, produk kemasan, hingga menu restoran.
      Ambil keputusan makan yang lebih cerdas setiap hari dan tetap terarah dalam perjalanan menuju tubuh sehat dan ideal.`,
    image: '/images/man-eating-dragon-fruit-outdoors.jpg',
  },

  kandungan: {
    title: 'Temukan Kandungan Makanan Anda dengan Mudah',
    subtitle: 'Kandungan Makanan',
    description: `Ingin tahu apa yang Anda makan?
      Fitur pencarian kami memudahkan Anda menemukan informasi kalori dan nutrisi dari berbagai jenis makanan—mulai dari makanan sehari-hari, camilan kemasan, hingga hidangan restoran favorit.
      Data yang telah diverifikasi membantu Anda membuat pilihan makan yang lebih cerdas dan sehat setiap hari. Temukan kandungan makanan Anda dengan mudah, dan dukung gaya hidup sehat yang lebih terarah.`,
    image: '/images/5703146_59473.jpg',
  },
  
  nutrisi: {
    title: 'Bahan Bakar Sehat untuk Aktivitas Sehari-hari',
    subtitle: 'Nutrisi Harian',
    description: `Setiap hari, tubuh Anda membutuhkan asupan yang tepat untuk tetap aktif, fokus, dan sehat. Fitur Nutrisi Harian membantu Anda memantau kebutuhan kalori, makronutrien, dan gizi penting lainnya yang sesuai dengan gaya hidup Anda.
      Tak perlu lagi menebak apa yang Anda makan—ketahui kandungan gizi dari berbagai jenis makanan dan jaga keseimbangan nutrisi setiap hari. Mulai hari ini, jadikan nutrisi sebagai bagian dari rutinitas cerdas Anda.`,
    image: '/images/1531149_4105.jpg',
  },
};

export default function LandingTabs() {
  const [selectedTab, setSelectedTab] = useState('misi');

  const current = contents[selectedTab];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`border-2 px-6 py-2 rounded-full font-semibold transition-all ${
              selectedTab === tab.key
                ? 'text-teal-600 border-teal-500'
                : 'text-gray-500 border-gray-300 hover:border-teal-400 hover:text-teal-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className='text-left'>
          <h4 className="text-teal-500 text-xl font-semibold mb-2">{current.subtitle}</h4>
          <h2 className="text-black text-3xl md:text-4xl font-bold mb-4">{current.title}</h2>
          <p className="text-lg text-black font-normal whitespace-pre-line">{current.description}</p>
        </div>
        <div className="flex justify-end">
          <div className="relative w-[350px] h-[430px]">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
