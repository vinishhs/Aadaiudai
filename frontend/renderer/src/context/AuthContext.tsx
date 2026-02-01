"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/services/firebase';
import axios from 'axios';

interface AuthContextType {
    user: any | null;
    loading: boolean;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
    queueAction: (action: PendingAction) => void;
    logout: () => void;
}

interface PendingAction {
    type: 'WISHLIST' | 'BUY';
    productId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Sync with backend
                try {
                    const token = await firebaseUser.getIdToken();
                    const response = await axios.post('http://localhost:5000/api/auth/sync', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data.data);

                    // Execute queued action if exists
                    const pendingAction = sessionStorage.getItem('pendingAction');
                    if (pendingAction) {
                        console.log("Executing queued action:", JSON.parse(pendingAction));
                        // In a real app, this would trigger the actual logic here or via a hook listener
                        // For now, we clear it.
                        sessionStorage.removeItem('pendingAction');
                    }
                } catch (err) {
                    console.error("User sync failed", err);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const queueAction = (action: PendingAction) => {
        sessionStorage.setItem('pendingAction', JSON.stringify(action));
        setShowLoginModal(true);
    };

    const logout = () => {
        auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, showLoginModal, setShowLoginModal, queueAction, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
