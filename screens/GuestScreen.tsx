
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { LogOut } from 'lucide-react';

const GuestScreen: React.FC = () => {
  const { payments } = useData();
  const { logout, currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const availableMonths = useMemo(() => {
    const months = new Set(payments.map(p => p.date.slice(0, 7)));
    const currentMonth = new Date().toISOString().slice(0, 7);
    months.add(currentMonth);
    return Array.from(months).sort().reverse();
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => p.date.startsWith(selectedMonth));
  }, [payments, selectedMonth]);

  const monthlyTotal = useMemo(() => {
    return filteredPayments.reduce((acc, p) => acc + p.amount, 0);
  }, [filteredPayments]);
  
  const formatCurrency = (amount: number) => {
    return `ج.م ${amount.toLocaleString('ar-EG')}`;
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center p-4 sm:p-8 text-white">
      <div className="w-full max-w-4xl bg-brand-blue p-6 sm:p-8 rounded-xl shadow-2xl border border-brand-gold/20">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-brand-secondary/30 pb-4">
          <Logo />
          <button onClick={logout} className="flex items-center gap-2 text-brand-secondary hover:text-white transition mt-4 sm:mt-0">
            <LogOut size={20} />
            <span>خروج</span>
          </button>
        </header>

        <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-light">تقرير حسابات مستر <span className="text-brand-gold">{currentUser?.name}</span></h1>
            <p className="text-brand-secondary mt-2">هنا تقدر تشوف ملخص الدخل الشهري وتفاصيله.</p>
        </div>

        <div className="my-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <label htmlFor="month-select" className="text-brand-light">اختر الشهر:</label>
             <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-brand-blue border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-white"
             >
                {availableMonths.map(month => (
                    <option key={month} value={month}>{new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</option>
                ))}
            </select>
        </div>

        <div className="bg-brand-navy text-center p-8 rounded-lg mb-8">
            <h2 className="text-lg text-brand-secondary uppercase">إجمالي دخل الشهر المحدد</h2>
            <p className="text-5xl font-black text-brand-gold mt-2 font-mono">{formatCurrency(monthlyTotal)}</p>
        </div>

        <div className="bg-brand-navy p-2 md:p-4 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-xl font-bold text-white p-4">تفاصيل الدفعات</h3>
          <table className="w-full min-w-[500px] text-right">
            <thead className="border-b-2 border-brand-gold/20">
              <tr>
                <th className="p-4 text-brand-gold font-bold">الطالب</th>
                <th className="p-4 text-brand-gold font-bold">المجموعة</th>
                <th className="p-4 text-brand-gold font-bold">المبلغ المدفوع</th>
                <th className="p-4 text-brand-gold font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? filteredPayments.map((p, index) => (
                <tr key={p.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 text-brand-secondary">{`طالب ${index + 1}`}</td>
                  <td className="p-4 text-brand-light">{p.groupName}</td>
                  <td className="p-4 font-mono text-white">{formatCurrency(p.amount)}</td>
                  <td className="p-4 text-brand-secondary">{new Date(p.date).toLocaleDateString('ar-EG')}</td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={4} className="text-center p-8 text-brand-secondary">
                          لا توجد دفعات مسجلة لهذا الشهر.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default GuestScreen;