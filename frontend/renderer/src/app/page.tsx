"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="relative h-[200vh] w-full bg-white px-8 md:px-20 py-20">
      <div className="sticky top-40 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-6 block">
            The Essence of Elegance
          </span>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight text-black mb-8">
            AADAIUDAI
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="max-w-xl text-gray-500 font-light leading-relaxed text-lg"
        >
          Crafting bespoke silhouettes that redefine minimalist luxury. Experience the boutique touch on your desktop.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "circOut" }}
          className="w-20 h-px bg-black mt-16"
        />
      </div>

      <div className="absolute top-[120vh] left-1/2 -translate-x-1/2 w-full px-20 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="h-[60vh] bg-gray-50 rounded-[2px] overflow-hidden group">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1539109132314-34a9366195fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
        </div>
        <div className="h-[60vh] bg-gray-50 rounded-[2px] mt-20 overflow-hidden group">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
        </div>
      </div>
    </section>
  );
}
