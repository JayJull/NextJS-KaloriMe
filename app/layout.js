import { Quicksand } from "next/font/google";
import "./globals.css";
import { SessionProvider } from '@/contexts/SessionContext'

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
    <html lang="id">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
