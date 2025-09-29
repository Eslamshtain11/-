import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Payment, NewPayment } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

// A simple unique ID generator
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface DataContextProps {
  payments: Payment[];
  addPayment: (payment: NewPayment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  groups: string[];
  addGroup: (groupName: string) => boolean;
  deleteGroup: (groupName: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useLocalStorage<Payment[]>(`payments_${currentUser?.phone}`, []);
  const [groups, setGroups] = useLocalStorage<string[]>(`groups_${currentUser?.phone}`, ['3 ثانوي', '2 ثانوي', '1 ثانوي']);

  // This effect will re-initialize the state when the user logs in/out
  useEffect(() => {
    if (currentUser) {
      const userPayments = localStorage.getItem(`payments_${currentUser.phone}`);
      const userGroups = localStorage.getItem(`groups_${currentUser.phone}`);
      setPayments(userPayments ? JSON.parse(userPayments) : []);
      setGroups(userGroups ? JSON.parse(userGroups) : ['3 ثانوي', '2 ثانوي', '1 ثانوي']);
    } else {
      setPayments([]);
      setGroups([]);
    }
  }, [currentUser, setPayments, setGroups]);


  const addPayment = (payment: NewPayment) => {
    const newPayment = { ...payment, id: uuidv4() };
    setPayments(prev => [...prev, newPayment].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updatePayment = (updatedPayment: Payment) => {
    setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const addGroup = (groupName: string): boolean => {
    const trimmedGroupName = groupName.trim();
    if (!trimmedGroupName || groups.find(g => g.toLowerCase() === trimmedGroupName.toLowerCase())) {
        return false;
    }
    setGroups(prev => [...prev, trimmedGroupName]);
    return true;
  };

  const deleteGroup = (groupName: string) => {
    setGroups(prev => prev.filter(g => g !== groupName));
    // Optional: Also remove payments associated with this group
    // setPayments(prev => prev.filter(p => p.groupName !== groupName));
  };

  const value = { payments, addPayment, updatePayment, deletePayment, groups, addGroup, deleteGroup };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};