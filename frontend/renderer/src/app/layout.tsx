import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import TitleBar from "@/components/TitleBar";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AADAIUDAI | Premium Boutique",
  description: "A premium, minimalist desktop shopping experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased text-gray-900 bg-white selection:bg-black selection:text-white`}
      >
        <TitleBar />
        <SmoothScroll>
          <main className="pt-10 min-h-screen">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
