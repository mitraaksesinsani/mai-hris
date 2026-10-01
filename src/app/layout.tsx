import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/providers/query-provider";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "MAI HRIS - PT. Mitra Akses Insani",
  description:
    "Human Resource Information System - Satu ID Karyawan, Satu ID Posisi, Satu Sistem Terintegrasi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MAI HRIS",
  },
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <QueryProvider>
          {children}
          <PwaRegister />
          <OfflineBanner />
          <InstallPrompt />
        </QueryProvider>
      </body>
    </html>
  );
}
