"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';

interface FilterBarProps {
    onSearch: (query: string) => void;
    onCategoryChange: (category: string) => void;
    categories: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, onCategoryChange, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        onCategoryChange(category);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            {/* Category Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
                <button
                    onClick={() => handleCategoryClick('All')}
                    className={`px-6 py-2 rounded-full text-sm font-outfit whitespace-nowrap transition-all duration-300 ${activeCategory === 'All'
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    All Collection
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-6 py-2 rounded-full text-sm font-outfit whitespace-nowrap transition-all duration-300 ${activeCategory === category
                                ? 'bg-black text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                    type="text"
                    placeholder="Search for a style..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-full font-inter text-sm focus:ring-1 focus:ring-black transition-all outline-none"
                />
            </div>
        </div>
    );
};

export default FilterBar;
