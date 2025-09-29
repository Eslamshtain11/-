
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="bg-brand-navy p-6 rounded-xl shadow-lg border border-white/10 flex items-start gap-4">
      <div className="bg-brand-blue p-3 rounded-full text-brand-gold">
        {icon}
      </div>
      <div>
        <h3 className="text-brand-secondary text-sm font-bold uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
        {description && <p className="text-brand-secondary text-sm mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default StatCard;
