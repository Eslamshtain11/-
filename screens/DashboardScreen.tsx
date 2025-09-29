
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Screen } from '../types';
import StatCard from '../components/StatCard';
import { DollarSign, Users, Calendar, PlusCircle, ClipboardList } from 'lucide-react';

interface DashboardScreenProps {
  setScreen: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ setScreen }) => {
  const { payments } = useData();

  const { totalIncome, paymentsThisMonth, totalStudents } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let currentMonthIncome = 0;
    const studentSet = new Set<string>();

    payments.forEach(p => {
      const paymentDate = new Date(p.date);
      if (paymentDate >= startOfMonth) {
        currentMonthIncome += p.amount;
      }
      studentSet.add(p.studentName.trim());
    });

    const total = payments.reduce((acc, p) => acc + p.amount, 0);

    return {
      totalIncome: total,
      paymentsThisMonth: currentMonthIncome,
      totalStudents: studentSet.size,
    };
  }, [payments]);

  const formatCurrency = (amount: number) => {
    return `ج.م ${amount.toLocaleString('ar-EG')}`;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-white">لوحة التحكم الرئيسية</h1>
        <p className="text-brand-secondary mt-2">نظرة سريعة على حساباتك يا مستر إسلام.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="إجمالي الدخل" value={formatCurrency(totalIncome)} icon={<DollarSign />} />
        <StatCard title="دخل الشهر الحالي" value={formatCurrency(paymentsThisMonth)} icon={<Calendar />} />
        <StatCard title="عدد الطلاب" value={totalStudents} icon={<Users />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <button 
          onClick={() => setScreen(Screen.MONTHLY_REPORT)} 
          className="bg-brand-gold text-brand-blue p-6 rounded-xl flex items-center justify-center text-xl font-bold gap-4 hover:opacity-90 transition-transform hover:scale-105 shadow-lg"
        >
          <PlusCircle size={32} />
          <span>إضافة دفعة جديدة</span>
        </button>
        <button 
          onClick={() => setScreen(Screen.MONTHLY_REPORT)}
          className="bg-brand-navy border-2 border-brand-gold text-brand-gold p-6 rounded-xl flex items-center justify-center text-xl font-bold gap-4 hover:bg-brand-gold/10 transition-transform hover:scale-105"
        >
          <ClipboardList size={32} />
          <span>عرض كشف الحساب</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;
