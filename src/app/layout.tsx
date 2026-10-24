import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HavenSwap — Curated Home Exchange & Travel Platform",
  description:
    "Exchange access to verified homes, host travelers to earn credits, and stay across Bhopal, Goa, Jaipur, Bengaluru, and worldwide without paying expensive hotel bills.",
  keywords: [
    "home exchange",
    "travel credits",
    "house swapping India",
    "Goa villas",
    "Bhopal stay",
    "non-reciprocal exchange",
    "HavenSwap",
  ],
  authors: [{ name: "HavenSwap Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
