"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { FiX, FiPhone, FiCheckCircle } from 'react-icons/fi';

const LoginModal: React.FC = () => {
    const { showLoginModal, setShowLoginModal } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP' | 'SUCCESS'>('PHONE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const recaptchaRef = useRef<HTMLDivElement>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    useEffect(() => {
        if (showLoginModal && !window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => {
                        console.log('reCAPTCHA solved');
                    }
                });
            } catch (err) {
                console.error('Error initializing reCAPTCHA', err);
            }
        }

        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, [showLoginModal]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const appVerifier = window.recaptchaVerifier;
            if (!appVerifier) throw new Error('reCAPTCHA not initialized');

            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(result);
            setStep('OTP');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send OTP. Please check the number.');
            // Clear verifier on error to allow clean retry
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (confirmationResult) {
                await confirmationResult.confirm(otp);
                setStep('SUCCESS');
                setTimeout(() => setShowLoginModal(false), 2000);
            }
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowLoginModal(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8"
                    >
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            <FiX size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-outfit font-semibold tracking-tight text-black">
                                {step === 'PHONE' ? 'The Logic Wall' : step === 'OTP' ? 'Verify Identity' : 'Welcome Home'}
                            </h2>
                            <p className="text-gray-500 font-inter mt-2">
                                {step === 'PHONE'
                                    ? 'Exclusive access for our boutique members.'
                                    : step === 'OTP'
                                        ? `Enter the code sent to ${phoneNumber}`
                                        : 'Authentication successful.'}
                            </p>
                        </div>

                        {step === 'PHONE' && (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FiPhone />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-xl font-inter focus:ring-1 focus:ring-black outline-none transition-all"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-black text-white rounded-xl font-outfit font-medium hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    {loading ? 'Sending...' : 'Request OTP'}
                                </button>
                            </form>
                        )}

                        {step === 'OTP' && (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="6-Digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-xl font-outfit text-center tracking-[1em] text-2xl focus:ring-1 focus:ring-black outline-none transition-all"
                                    maxLength={6}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-black text-white rounded-xl font-outfit font-medium hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    {loading ? 'Verifying...' : 'Complete Access'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep('PHONE')}
                                    className="w-full text-sm text-gray-400 hover:text-black font-inter transition-colors"
                                >
                                    Change Number
                                </button>
                            </form>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="flex flex-col items-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10 }}
                                    className="text-green-500 text-7xl"
                                >
                                    <FiCheckCircle />
                                </motion.div>
                                <p className="mt-6 text-xl font-outfit text-black">Access Granted</p>
                            </div>
                        )}

                        {error && <p className="mt-4 text-center text-red-500 text-sm font-inter">{error}</p>}

                        {/* Permanent reCAPTCHA container - MUST stay in DOM while modal is open */}
                        <div id="recaptcha-container"></div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
