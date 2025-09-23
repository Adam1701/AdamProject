import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ClientProviders from "@/components/providers/ClientProviders";
import Image from "next/image";
import CookieBanner from "@/components/gdpr/CookieBanner";
import Logo from "@/components/ui/Logo";
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
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                    Boutique
                  </Link>
                  <Link href="/cart" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                    Panier
                  </Link>
                  <div className="h-6 w-px bg-slate-300"></div>
                  <Link href="/admin/stocks" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                    Stocks
                  </Link>
                  <Link href="/admin/orders" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                    Commandes
                  </Link>
                  <Link href="/api/auth/signin" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
                    Connexion
                  </Link>
                </div>
              </nav>
            </header>
          <main className="max-w-6xl mx-auto p-4">{children}</main>
          <CookieBanner />
        </ClientProviders>
      </body>
    </html>
  );
}
