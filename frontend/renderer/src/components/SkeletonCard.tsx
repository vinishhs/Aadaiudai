import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="animate-pulse">
            {/* Image Placeholder - Matches ProductCard aspect ratio [3/4] */}
            <div className="relative aspect-[3/4] rounded-lg bg-gray-200" />

            {/* Text Placeholders */}
            <div className="mt-4 flex justify-between items-start">
                <div className="w-2/3 space-y-2">
                    <div className="h-5 w-full rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
                <div className="h-5 w-1/4 rounded bg-gray-200" />
            </div>
        </div>
    );
};

export default SkeletonCard;
