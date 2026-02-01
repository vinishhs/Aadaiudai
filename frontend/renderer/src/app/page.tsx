"use client";

import { motion } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="relative bg-white">
      {/* Sticky Hero - Layered on Top */}
      <section className="relative h-[100vh] w-full px-8 md:px-20 py-20 z-10 flex flex-col items-center justify-center text-center bg-white">
        <div className="sticky top-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-6 block font-outfit">
              The Essence of Elegance
            </span>
            <h1 className="text-6xl md:text-9xl font-outfit tracking-tighter text-black mb-8">
              AADAIUDAI
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="max-w-xl mx-auto text-gray-500 font-inter font-light leading-relaxed text-lg"
          >
            Crafting bespoke silhouettes that redefine minimalist luxury. Experience the boutique touch on your desktop.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "circOut" }}
            className="w-20 h-px bg-black mt-16 mx-auto"
          />
        </div>
      </section>

      {/* Product Discovery - Slides behind or emerges from behind hero */}
      <section className="relative z-0 -mt-[20vh] pb-40 bg-white">
        <ProductGrid />
      </section>
    </div>
  );
}
