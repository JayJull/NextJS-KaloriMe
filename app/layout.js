import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
})

export const metadata = {
  title: "KaloriMe",
  description: "Aplikasi Canggih Berbasis Web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className={quicksand.className}>{children}</body>
    </html>
  );
}