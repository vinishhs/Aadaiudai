"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/services/api';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <motion.div
            className="group relative cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay Gradient (Subtle) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Details */}
            <div className="mt-4 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-outfit text-gray-900 group-hover:text-black transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-inter mt-1">{product.category}</p>
                </div>
                <p className="text-lg font-medium font-outfit text-gray-900">
                    ₹{product.price.toLocaleString()}
                </p>
            </div>

            {/* Micro-interaction Line */}
            <div className="absolute -bottom-2 left-0 h-[1px] w-0 bg-black transition-all duration-500 ease-out group-hover:w-full" />
        </motion.div>
    );
};

export default ProductCard;
