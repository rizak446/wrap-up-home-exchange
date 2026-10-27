import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DynamicTouchEffects from "@/components/ui/dynamic-touch-effects";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Wrap-Up — Curated Home Exchange & Travel Platform",
  description:
    "Wrap-Up: Travel More, Spend Less. Exchange access to verified homes, host travelers to earn credits, and stay across Bhopal, Goa, Jaipur, Bengaluru, and worldwide without paying expensive hotel bills.",
  keywords: [
    "Wrap-Up",
    "home exchange",
    "travel credits",
    "house swapping India",
    "Goa villas",
    "Bhopal stay",
    "non-reciprocal exchange",
    "Travel More Spend Less",
  ],
  authors: [{ name: "Wrap-Up Team" }],
  icons: {
    icon: "/wrap-up-logo.jpg",
    apple: "/wrap-up-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#261A10] antialiased selection:bg-[#C8792C] selection:text-white">
        <AuthProvider>
          <DynamicTouchEffects />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
