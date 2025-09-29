import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  currentUser: User | null;
  isGuestSession: boolean;
  loading: boolean;
  signup: (userData: Omit<User, 'guestCode'>) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsGuest: (guestCode: string) => Promise<{ success: boolean; ownerName?: string }>;
  generateGuestCode: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('app_users', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuestSession, setIsGuestSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect is to check for a persisted session on app load
    try {
      const sessionUserPhone = sessionStorage.getItem('currentUserPhone');
      const sessionIsGuest = sessionStorage.getItem('isGuestSession') === 'true';
      if (sessionUserPhone) {
        const user = users.find(u => u.phone === sessionUserPhone);
        if (user) {
          setCurrentUser(user);
          setIsGuestSession(sessionIsGuest);
        }
      }
    } catch (e) {
        console.error("Could not restore session.", e);
    } finally {
        setLoading(false);
    }
  }, [users]);
  
  const persistSession = (user: User, isGuest: boolean) => {
      sessionStorage.setItem('currentUserPhone', user.phone);
      sessionStorage.setItem('isGuestSession', String(isGuest));
  };
  
  const clearSession = () => {
      sessionStorage.removeItem('currentUserPhone');
      sessionStorage.removeItem('isGuestSession');
  };

  const signup = async (userData: Omit<User, 'guestCode'>): Promise<void> => {
    const userExists = users.some(user => user.phone === userData.phone);
    if (userExists) {
      throw new Error('هذا الرقم مسجل بالفعل.');
    }
    const newUser = { ...userData, guestCode: generateGuestCodeInternal() };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsGuestSession(false);
    persistSession(newUser, false);
  };

  const login = async (phone: string, password: string): Promise<void> => {
    const user = users.find(user => user.phone === phone && user.password === password);
    if (!user) {
      throw new Error('رقم التليفون أو كلمة المرور غلط.');
    }
    setCurrentUser(user);
    setIsGuestSession(false);
    persistSession(user, false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsGuestSession(false);
    clearSession();
  };

  const loginAsGuest = async (guestCode: string): Promise<{ success: boolean; ownerName?: string }> => {
    if (!guestCode || guestCode.length < 4) return { success: false };
    const userAccount = users.find(user => user.guestCode === guestCode);
    if (!userAccount) {
      return { success: false };
    }
    setCurrentUser(userAccount);
    setIsGuestSession(true);
    persistSession(userAccount, true);
    return { success: true, ownerName: userAccount.name };
  };

  const generateGuestCodeInternal = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const generateGuestCode = (): string => {
    if (!currentUser || isGuestSession) return '';
    const newCode = generateGuestCodeInternal();
    const updatedUsers = users.map(user => 
      user.phone === currentUser.phone ? { ...user, guestCode: newCode } : user
    );
    setUsers(updatedUsers);
    setCurrentUser(prev => prev ? { ...prev, guestCode: newCode } : null);
    return newCode;
  };

  return (
    <AuthContext.Provider value={{ currentUser, isGuestSession, loading, signup, login, logout, loginAsGuest, generateGuestCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};