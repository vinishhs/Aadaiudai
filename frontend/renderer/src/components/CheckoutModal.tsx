"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { Product } from '@/services/api';
import { useRazorpay } from '@/hooks/useRazorpay';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, product }) => {
    const [step, setStep] = useState<'SUMMARY' | 'SUCCESS'>('SUMMARY');
    const [loading, setLoading] = useState(false);
    const { processPayment } = useRazorpay();

    const handleCheckout = async () => {
        setLoading(true);
        const orderData = {
            orderItems: [{
                name: product.name,
                qty: 1,
                image: product.images[0],
                price: product.price,
                product: product._id
            }],
            totalPrice: product.price
        };

        await processPayment(orderData, (verifiedOrder) => {
            setStep('SUCCESS');
        });
        setLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black z-20"
                        >
                            <FiX size={24} />
                        </button>

                        {step === 'SUMMARY' ? (
                            <div className="p-10">
                                <h2 className="text-3xl font-outfit font-semibold mb-8">Checkout</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 pb-6 border-bottom border-gray-100">
                                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-outfit font-medium">{product.name}</h3>
                                            <p className="text-gray-500 font-inter text-sm">{product.category}</p>
                                        </div>
                                        <p className="font-outfit font-semibold">₹{product.price.toLocaleString()}</p>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between text-gray-500 font-inter">
                                            <span>Subtotal</span>
                                            <span>₹{product.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500 font-inter text-sm">
                                            <span>Shipping</span>
                                            <span className="text-green-600 font-medium italic">Complimentary</span>
                                        </div>
                                        <div className="flex justify-between pt-4 text-xl font-outfit font-bold border-t border-gray-100 text-black">
                                            <span>Total</span>
                                            <span>₹{product.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={loading}
                                        className="w-full py-5 bg-black text-white rounded-xl font-outfit font-medium hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98] mt-4"
                                    >
                                        {loading ? 'Processing...' : 'Pay Now'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center py-16">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                                    className="text-green-500 flex justify-center mb-6"
                                >
                                    <FiCheckCircle size={80} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h2 className="text-3xl font-outfit font-semibold">Payment Confirmed</h2>
                                    <p className="text-gray-500 font-inter mt-3 mb-8">
                                        Your boutique pieces are being prepared.
                                    </p>

                                    <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4">
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex justify-between font-inter text-sm">
                                            <span className="text-gray-500">Receipt ID</span>
                                            <span className="font-medium">#AD{Math.floor(Math.random() * 90000) + 10000}</span>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex justify-between font-inter text-sm">
                                            <span className="text-gray-500">Item</span>
                                            <span className="font-medium truncate max-w-[150px]">{product.name}</span>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex justify-between font-outfit text-base border-t border-gray-200 pt-4">
                                            <span className="font-semibold">Billed Amount</span>
                                            <span className="font-bold">₹{product.price.toLocaleString()}</span>
                                        </motion.div>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="mt-10 px-8 py-3 bg-black text-white rounded-full font-outfit text-sm hover:bg-gray-900 transition-all flex items-center gap-2 mx-auto"
                                    >
                                        <FiShoppingBag size={16} />
                                        Continue Exploring
                                    </button>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
