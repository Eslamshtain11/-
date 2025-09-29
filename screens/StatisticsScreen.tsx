
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';
import StatCard from '../components/StatCard';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

const StatisticsScreen: React.FC = () => {
  const { payments } = useData();

  const { monthlyData, groupData, highestMonth, lowestMonth } = useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};
    const groupTotals: { [key: string]: number } = {};

    payments.forEach(p => {
      const month = new Date(p.date).toLocaleString('ar-EG', { month: 'short', year: 'numeric' });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + p.amount;
      groupTotals[p.groupName] = (groupTotals[p.groupName] || 0) + p.amount;
    });

    const monthlyData = Object.entries(monthlyTotals).map(([name, total]) => ({ name, total })).reverse();
    const groupData = Object.entries(groupTotals).map(([name, value]) => ({ name, value }));
    
    let highest = { name: '-', total: 0 };
    let lowest = { name: '-', total: Infinity };

    if (monthlyData.length > 0) {
        highest = monthlyData.reduce((prev, current) => (prev.total > current.total) ? prev : current);
        lowest = monthlyData.reduce((prev, current) => (prev.total < current.total) ? prev : current);
    } else {
        lowest = {name: '-', total: 0}
    }


    return { monthlyData, groupData, highestMonth: highest, lowestMonth: lowest };
  }, [payments]);

  const COLORS = ['#D4AF37', '#FFD700', '#F0E68C', '#BDB76B', '#DAA520'];
  const formatCurrency = (amount: number) => `ج.م ${amount.toLocaleString('ar-EG')}`;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-white">الإحصائيات والرسومات</h1>
        <p className="text-brand-secondary mt-2">تحليل لأدائك المالي على مدار الشهور والمجموعات.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="أعلى شهر" value={formatCurrency(highestMonth.total)} description={highestMonth.name} icon={<TrendingUp />} />
        <StatCard title="أقل شهر" value={formatCurrency(lowestMonth.total)} description={lowestMonth.name} icon={<TrendingDown />} />
        <StatCard title="عدد المجموعات" value={groupData.length} icon={<Users />} />
      </div>

      <div className="bg-brand-navy p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-brand-gold mb-6">إجمالي الدخل كل شهر</h2>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#8892B0" />
              <YAxis stroke="#8892B0" tickFormatter={(tick) => `${tick / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #D4AF37', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#CCD6F6' }}
                formatter={(value: number) => [formatCurrency(value), 'الإجمالي']}
              />
              <Legend wrapperStyle={{color: '#CCD6F6'}}/>
              <Bar dataKey="total" fill="#D4AF37" name="إجمالي الدخل"/>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center text-brand-secondary">لا توجد بيانات كافية لعرض الرسم البياني.</div>
        )}
      </div>

      <div className="bg-brand-navy p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-brand-gold mb-6">توزيع الدخل على المجموعات</h2>
        {groupData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={groupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {groupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip 
                contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #D4AF37', borderRadius: '0.5rem' }}
                formatter={(value: number) => [formatCurrency(value), 'الإجمالي']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
            <div className="h-96 flex items-center justify-center text-brand-secondary">لا توجد بيانات كافية لعرض الرسم البياني.</div>
        )}
      </div>
    </div>
  );
};

export default StatisticsScreen;
