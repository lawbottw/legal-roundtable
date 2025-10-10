"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isAdmin } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user?.email) {
        // 驗證管理員權限
        const response = await fetch('/api/check-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        const data = await response.json();
        setIsAdminUser(data.isAdmin);
        
        // 儲存管理員列表到 localStorage（僅用於客戶端檢查）
        if (data.isAdmin && data.adminEmails) {
          localStorage.setItem('adminEmails', JSON.stringify(data.adminEmails));
        }
      } else {
        setIsAdminUser(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 驗證是否為管理員
      const response = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userCredential.user.email })
      });
      const data = await response.json();
      
      if (!data.isAdmin) {
        await firebaseSignOut(auth);
        throw new Error('您沒有權限訪問此頁面');
      }
      
      if (data.adminEmails) {
        localStorage.setItem('adminEmails', JSON.stringify(data.adminEmails));
      }
    } catch (error: any) {
      throw new Error(error.message || '登入失敗');
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem('adminEmails');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: isAdminUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
