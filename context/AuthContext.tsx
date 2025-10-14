import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

// FIX: This file was malformed and causing multiple errors.
// It has been replaced with a complete authentication context implementation.

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (phone: string, pass: string) => Promise<void>;
  signup: (name: string, phone: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  generateGuestCode: () => Promise<string | null>;
  loginAsGuest: (guestCode: string) => Promise<void>;
  isGuestSession: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestSession, setIsGuestSession] = useState(false);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        await checkGuestSession();
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchUserProfile(session.user);
        setIsGuestSession(false);
        sessionStorage.removeItem('guestCode');
      } else {
        setCurrentUser(null);
        setIsGuestSession(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, phone, guest_code')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      setCurrentUser(null);
    } else if (data) {
      setCurrentUser({
        id: data.id,
        name: data.name,
        phone: data.phone,
        guestCode: data.guest_code,
      });
    }
  };
  
  const checkGuestSession = async () => {
    const guestCode = sessionStorage.getItem('guestCode');
    if (guestCode) {
      await loginAsGuest(guestCode).catch(err => {
        console.error(err);
        sessionStorage.removeItem('guestCode');
      });
    }
  };

  const login = async (phone: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: `${phone.trim()}@dummy.com`,
      password,
    });
    if (error) {
       if (error.message.includes('Email not confirmed')) {
        throw new Error("الحساب اتعمل بس محتاج يتفعّل. من فضلك الغي خاصية 'تأكيد البريد الإلكتروني' من إعدادات حسابك في Supabase.");
      }
      throw new Error("رقم الموبايل أو كلمة المرور غلط.");
    }
  };

  const signup = async (name: string, phone: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: `${phone.trim()}@dummy.com`,
      password: password,
      options: {
        data: {
          name: name.trim(),
          phone: phone.trim()
        }
      }
    });
    if (error) {
        if (error.message.includes('User already registered')) {
            throw new Error('رقم الموبايل ده متسجل قبل كده.');
        }
        throw error;
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('guestCode');
    setCurrentUser(null);
    setIsGuestSession(false);
  };
  
  const generateGuestCode = async (): Promise<string | null> => {
    if (!currentUser) return null;
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
      .from('profiles')
      .update({ guest_code: newCode })
      .eq('id', currentUser.id)
      .select('guest_code')
      .single();
    
    if (error) {
      console.error("Error generating guest code:", error);
      return null;
    }
    
    if (data) {
      setCurrentUser(prev => prev ? { ...prev, guestCode: data.guest_code } : null);
      return data.guest_code;
    }
    return null;
  };
  
  const loginAsGuest = async (guestCode: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, phone, guest_code')
      .eq('guest_code', guestCode.toUpperCase())
      .neq('guest_code', null)
      .single();
    
    setLoading(false);
    if (error || !data) {
      console.error("Invalid guest code:", error);
      throw new Error("كود الضيف غير صحيح.");
    } else {
      setCurrentUser({
        id: data.id,
        name: data.name,
        phone: data.phone,
        guestCode: data.guest_code,
      });
      setIsGuestSession(true);
      sessionStorage.setItem('guestCode', guestCode);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    generateGuestCode,
    loginAsGuest,
    isGuestSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};