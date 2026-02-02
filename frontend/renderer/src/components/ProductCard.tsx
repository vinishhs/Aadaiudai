"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/services/api';
import { FiHeart } from 'react-icons/fi';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useAuth } from '@/context/AuthContext';
import CheckoutModal from './CheckoutModal';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { runWithAuth } = useAuthAction();
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        runWithAuth(() => {
            setIsWishlisted(!isWishlisted);
            console.log(`Action Resumed: Wishlisted ${product.name}`);
        }, { type: 'WISHLIST', productId: product._id });
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        runWithAuth(() => {
            setIsCheckoutOpen(true);
        }, { type: 'BUY', productId: product._id });
    };

    return (
        <>
            <motion.div
                className="group relative cursor-pointer"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                onClick={handleBuyNow}
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

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlist}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white active:scale-90"
                    >
                        <div className={isWishlisted ? "text-black" : "text-gray-400"}>
                            <FiHeart
                                size={18}
                                className={isWishlisted ? "fill-current" : ""}
                            />
                        </div>
                    </button>
                </div>

                {/* Details */}
                <div className="mt-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-outfit text-gray-900 group-hover:text-black transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-inter mt-1">{product.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-medium font-outfit text-gray-900">
                            ₹{product.price.toLocaleString()}
                        </p>
                        <button
                            onClick={handleBuyNow}
                            className="mt-2 text-xs font-outfit font-bold tracking-widest uppercase text-black border-b border-black opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Micro-interaction Line */}
                <div className="absolute -bottom-2 left-0 h-[1px] w-0 bg-black transition-all duration-500 ease-out group-hover:w-full" />
            </motion.div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={product}
            />
        </>
    );
};

export default ProductCard;
