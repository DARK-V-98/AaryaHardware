'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let roleUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      // If there's an existing role listener, unsubscribe from it before setting up a new one
      if (roleUnsubscribe) {
        roleUnsubscribe();
      }

      if (user) {
        setUser(user);
        const userDocRef = doc(firestore, 'users', user.uid);
        
        // Listen for real-time updates to the user's role
        roleUnsubscribe = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          } else {
            // This case handles new users (e.g., first-time Google sign-in)
            // It also ensures that if a user's doc is deleted, they get reset to 'customer'
            await setDoc(userDocRef, { email: user.email, role: 'customer' });
            setRole('customer');
          }
          setLoading(false);
        }, (error) => {
            console.error("Error listening to user role:", error);
            // On error, log out the user's state in the app
            setUser(null);
            setRole(null);
            setLoading(false);
        });

      } else {
        // User is signed out
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    // Cleanup function to unsubscribe from listeners when the component unmounts
    return () => {
        authUnsubscribe();
        if (roleUnsubscribe) {
            roleUnsubscribe();
        }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {/* Don't render children until the initial auth state and role are determined */}
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
