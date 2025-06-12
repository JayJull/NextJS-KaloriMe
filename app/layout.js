import "./globals.css";
import { Quicksand } from "next/font/google";
import ClientLayout from "./client-layout";
import { SessionProvider } from "@/contexts/SessionContext";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata = {
  title: "KaloriMe",
  description: "Aplikasi Canggih Berbasis Web",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00A999" />
        <link rel="icon" href="/app/favicon.ico" type="image/x-icon" />
      </head>
      <body className={quicksand.className}>
        <SessionProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
