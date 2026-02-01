"use client";

import { useAuth } from '@/context/AuthContext';
import { useCallback } from 'react';

/**
 * A hook to wrap actions that require authentication.
 * If the user is GUEST, it intercepts, queues the action, and opens the Login Modal.
 * If the user is AUTHED, it executes immediately.
 */
export const useAuthAction = () => {
    const { user, queueAction } = useAuth();

    const runWithAuth = useCallback((action: () => void, metadata: { type: 'WISHLIST' | 'BUY', productId: string }) => {
        if (user) {
            action();
        } else {
            console.log(`Intercepting ${metadata.type} for product ${metadata.productId}`);
            queueAction({ type: metadata.type, productId: metadata.productId });
            // The actual callback "action" can't be stored in sessionStorage, 
            // so we rely on the type/productId to resume it in AuthContext/Component.
        }
    }, [user, queueAction]);

    return { runWithAuth };
};
