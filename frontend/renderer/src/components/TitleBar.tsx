"use client";

import React from 'react';
import { Minus, Square, X } from 'lucide-react';

const TitleBar = () => {
    const handleMinimize = () => {
        // @ts-ignore
        window.electronAPI?.minimize();
    };

    const handleMaximize = () => {
        // @ts-ignore
        window.electronAPI?.maximize();
    };

    const handleClose = () => {
        // @ts-ignore
        window.electronAPI?.close();
    };

    return (
        <div className="h-10 w-full flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 select-none drag-region fixed top-0 z-[9999]">
            <div className="flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 mt-0.5">
                    AADAIUDAI
                </span>
            </div>

            <div className="flex h-full no-drag-region">
                <button
                    onClick={handleMinimize}
                    className="px-3 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                    <Minus size={14} strokeWidth={1.5} />
                </button>
                <button
                    onClick={handleMaximize}
                    className="px-3 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                    <Square size={12} strokeWidth={1.5} />
                </button>
                <button
                    onClick={handleClose}
                    className="px-4 flex items-center justify-center hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                >
                    <X size={14} strokeWidth={1.5} />
                </button>
            </div>

            <style jsx>{`
        .drag-region {
          -webkit-app-region: drag;
        }
        .no-drag-region {
          -webkit-app-region: no-drag;
        }
      `}</style>
        </div>
    );
};

export default TitleBar;
