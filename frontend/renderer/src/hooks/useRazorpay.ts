"use client";

import { useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/services/firebase';

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefill: {
        name: string;
        contact: string;
    };
    theme: {
        color: string;
    };
}

export const useRazorpay = () => {
    const { user } = useAuth();

    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const processPayment = useCallback(async (orderData: { totalPrice: number, orderItems: any[] }, onSuccess: (order: any) => void) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            // 1. Create Order on Backend
            const idToken = await auth.currentUser?.getIdToken();
            const { data } = await axios.post('http://localhost:5000/api/orders/create', orderData, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });

            const { razorpayOrder, order: mongoOrder } = data;

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_KEY_ID",
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "AADAIUDAI",
                description: `Order for ${orderData.orderItems[0].name}`,
                order_id: razorpayOrder.id,
                handler: async (response: any) => {
                    try {
                        // 2. Verify Payment on Backend
                        const idToken = await auth.currentUser?.getIdToken();
                        const verifyRes = await axios.post('http://localhost:5000/api/orders/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }, {
                            headers: {
                                Authorization: `Bearer ${idToken}`
                            }
                        });

                        if (verifyRes.data.success) {
                            onSuccess(verifyRes.data.order);
                        }
                    } catch (err) {
                        console.error("Verification failed", err);
                    }
                },
                prefill: {
                    name: user?.name || "Guest",
                    contact: user?.phoneNumber || "",
                },
                theme: {
                    color: "#000000",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment initialization failed", error);
        }
    }, [user]);

    return { processPayment };
};
