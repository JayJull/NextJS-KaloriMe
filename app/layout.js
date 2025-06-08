import { Quicksand } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata = {
  title: "KaloriMe",
  description: "Aplikasi Canggih Berbasis Web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className={quicksand.className}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
