
export const makanan = [
  { id: 1, nama: "Ayam Goreng", kategori: "Protein", kalori: 350, foto: "..." }, // Assumed a piece of fried chicken
  { id: 2, nama: "Burger", kategori: "Karbohidrat, Protein", kalori: 450, foto: "..." }, // Assumed a standard burger
  { id: 3, nama: "French Fries", kategori: "Karbohidrat", kalori: 300, foto: "..." }, // Assumed a medium portion
  { id: 4, nama: "Gado-Gado", kategori: "Sayuran, Protein", kalori: 350, foto: "..." }, // Assumed a standard portion with peanut sauce
  { id: 5, nama: "Ikan Goreng", kategori: "Protein", kalori: 300, foto: "..." }, // Assumed a medium-sized fried fish
  { id: 6, nama: "Mie Goreng", kategori: "Karbohidrat, Protein", kalori: 400, foto: "..." }, // Assumed a standard portion
  { id: 7, nama: "Nasi Goreng", kategori: "Karbohidrat, Protein", kalori: 380, foto: "..." }, // Assumed a standard portion
  { id: 8, nama: "Nasi Padang", kategori: "Karbohidrat, Protein, Lemak", kalori: 600, foto: "..." }, // This can vary significantly, assuming a typical plate with rice and 2-3 dishes
  { id: 9, nama: "Pizza", kategori: "Karbohidrat, Protein", kalori: 280, foto: "..." }, // Assumed one slice of a typical pizza
  { id: 10, nama: "Rawon", kategori: "Protein, Karbohidrat", kalori: 300, foto: "..." }, // Assumed a bowl with rice
  { id: 11, nama: "Rendang", kategori: "Protein, Lemak", kalori: 320, foto: "..." }, // Assumed a medium portion of beef rendang
  { id: 12, nama: "Sate", kategori: "Protein", kalori: 250, foto: "..." }, // Assumed 5-6 sticks of chicken sate with peanut sauce
  { id: 13, nama: "Soto", kategori: "Protein, Karbohidrat", kalori: 280, foto: "..." }, // Assumed a bowl with rice
];

export const kategoriMakanan = [
  'Makanan Utama',
  'Snack',
  'Minuman',
  'Salad',
  'Dessert',
  'Appetizer',
  'Sup'
];

export const sampleFoodData = [
  {
    id: 1,
    date: "2025-06-07",
    foods: [
      {
        name: "Nasi Gudeg",
        calories: 450,
        time: "07:30",
        image: "https://source.unsplash.com/100x80/?gudeg",
        category: "Sarapan",
      },
      {
        name: "Ayam Bakar",
        calories: 320,
        time: "12:15",
        image: "/api/placeholder/100/80",
        category: "Makan Siang",
      },
      {
        name: "Gado-gado",
        calories: 280,
        time: "19:00",
        image: "/api/placeholder/100/80",
        category: "Makan Malam",
      },
    ],
  },
  {
    id: 2,
    date: "2025-06-06",
    foods: [
      {
        name: "Bubur Ayam",
        calories: 350,
        time: "08:00",
        image: "/api/placeholder/100/80",
        category: "Sarapan",
      },
      {
        name: "Soto Betawi",
        calories: 420,
        time: "13:30",
        image: "/api/placeholder/100/80",
        category: "Makan Siang",
      },
      {
        name: "Pecel Lele",
        calories: 380,
        time: "18:45",
        image: "/api/placeholder/100/80",
        category: "Makan Malam",
      },
    ],
  },
  {
    id: 3,
    date: "2025-06-05",
    foods: [
      {
        name: "Lontong Sayur",
        calories: 300,
        time: "07:45",
        image: "/api/placeholder/100/80",
        category: "Sarapan",
      },
      {
        name: "Rendang",
        calories: 480,
        time: "12:00",
        image: "/api/placeholder/100/80",
        category: "Makan Siang",
      },
      {
        name: "Rawon",
        calories: 350,
        time: "19:30",
        image: "/api/placeholder/100/80",
        category: "Makan Malam",
      },
    ],
  },
  {
    id: 4,
    date: "2025-06-04",
    foods: [
      {
        name: "Nasi Kuning",
        calories: 400,
        time: "08:15",
        image: "/api/placeholder/100/80",
        category: "Sarapan",
      },
      {
        name: "Bakso",
        calories: 320,
        time: "13:00",
        image: "/api/placeholder/100/80",
        category: "Makan Siang",
      },
    ],
  },
  {
    id: 5,
    date: "2025-06-03",
    foods: [
      {
        name: "Roti Bakar",
        calories: 250,
        time: "07:30",
        image: "/api/placeholder/100/80",
        category: "Sarapan",
      },
      {
        name: "Nasi Padang",
        calories: 520,
        time: "12:30",
        image: "/api/placeholder/100/80",
        category: "Makan Siang",
      },
      {
        name: "Martabak Telur",
        calories: 450,
        time: "20:00",
        image: "/api/placeholder/100/80",
        category: "Makan Malam",
      },
    ],
  },
];