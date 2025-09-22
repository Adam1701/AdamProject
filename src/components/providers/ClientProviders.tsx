'use client'
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/cart/CartProvider";
import CookieBanner from "@/components/gdpr/CookieBanner";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CookieBanner />
      </CartProvider>
    </SessionProvider>
  )
}
