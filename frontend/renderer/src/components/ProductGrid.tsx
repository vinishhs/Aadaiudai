"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import FilterBar from './FilterBar';
import { fetchProducts, Product } from '@/services/api';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ProductGrid: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(products.map(p => p.category)));
        return unique;
    }, [products]);

    // GSAP Entrance Animation
    useEffect(() => {
        if (!loading && filteredProducts.length > 0) {
            const cards = gridRef.current?.children;
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        }
    }, [loading, filteredProducts]);

    return (
        <section className="container mx-auto px-6 py-20 relative z-0 bg-white">
            <FilterBar
                categories={categories}
                onSearch={setSearchQuery}
                onCategoryChange={setSelectedCategory}
            />

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
                >
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-400 font-inter text-lg">No pieces found matching your criteria.</p>
                </div>
            )}
        </section>
    );
};

export default ProductGrid;
