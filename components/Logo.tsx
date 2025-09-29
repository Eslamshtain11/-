import React from 'react';
import { logoBase64 } from '../assets/logo';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <img src={logoBase64} alt="شعار المحاسب الشخصي" className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold/50" />
      <div>
        <h1 className="text-xl font-black text-white whitespace-nowrap">المحاسب الشخصي</h1>
      </div>
    </div>
  );
};

export default Logo;
