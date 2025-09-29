import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Search } from 'lucide-react';

const AdvancedSearchScreen: React.FC = () => {
  const { payments } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const searchResults = useMemo(() => {
    if (!submittedSearch) return [];
    return payments
      .filter(p => p.studentName.toLowerCase().includes(submittedSearch.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [payments, submittedSearch]);

  const totalPaid = useMemo(() => {
    return searchResults.reduce((acc, p) => acc + p.amount, 0);
  }, [searchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-black text-white">بحث متقدم عن طالب</h1>
        <p className="text-brand-secondary mt-2">اكتب اسم طالب عشان تشوف كل تاريخ دفعه.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-brand-navy p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="اكتب اسم الطالب هنا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-blue border border-brand-secondary rounded-lg p-3 pr-10 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-white"
          />
          <Search size={20} className="absolute top-1/2 right-3 -translate-y-1/2 text-brand-secondary" />
        </div>
        <button
          type="submit"
          className="bg-brand-gold text-brand-blue font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
        >
          بحث
        </button>
      </form>
      
      {submittedSearch && (
        <div className="bg-brand-navy p-2 md:p-4 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-xl font-bold text-white p-4">نتائج البحث عن: "{submittedSearch}"</h2>
          <table className="w-full min-w-[600px] text-right">
            <thead className="border-b-2 border-brand-gold/20">
              <tr>
                <th className="p-4 text-brand-gold font-bold">المجموعة</th>
                <th className="p-4 text-brand-gold font-bold">المبلغ المدفوع</th>
                <th className="p-4 text-brand-gold font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 ? searchResults.map(p => (
                <tr key={p.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 text-brand-light">{p.groupName}</td>
                  <td className="p-4 font-mono text-white">ج.م {p.amount.toLocaleString('ar-EG')}</td>
                  <td className="p-4 text-brand-secondary">{new Date(p.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-brand-secondary">
                    لا يوجد طالب بهذا الاسم.
                  </td>
                </tr>
              )}
            </tbody>
            {searchResults.length > 0 && (
                <tfoot>
                    <tr className="border-t-2 border-brand-gold">
                    <td className="p-4 font-black text-xl text-white">الإجمالي اللي دفعه الطالب</td>
                    <td className="p-4 font-black text-xl text-brand-gold font-mono" colSpan={2}>
                        ج.م {totalPaid.toLocaleString('ar-EG')}
                    </td>
                    </tr>
                </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchScreen;