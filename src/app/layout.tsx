import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ClientProviders from "@/components/providers/ClientProviders";
import Image from "next/image";
import CookieBanner from "@/components/gdpr/CookieBanner";
import Logo from "@/components/ui/Logo";
import NavLinks from "@/components/ui/NavLinks";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adam'sneakers",
  description: "Adam'sneakers – Trouve ta paire, dépasse-toi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
            <header className="border-b border-slate-200 bg-white">
              <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center">
                  <Logo />
                </Link>
                <NavLinks />
              </nav>
            </header>
          <main className="max-w-6xl mx-auto p-4">{children}</main>
          <CookieBanner />
        </ClientProviders>
      </body>
    </html>
  );
}
