import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, RefreshCw } from 'lucide-react';

const GuestAccessScreen: React.FC = () => {
  const { currentUser, generateGuestCode } = useAuth();
  const [copied, setCopied] = useState(false);

  // The guest code should be part of the currentUser object from AuthContext
  const guestCode = currentUser?.guestCode;

  const handleCopy = () => {
    if (guestCode) {
      navigator.clipboard.writeText(guestCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateNewCode = () => {
    if (window.confirm("متأكد إنك عايز تعمل كود جديد؟ الكود القديم هيتلغي.")) {
        generateGuestCode();
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-black text-white">مشاركة التقارير مع الضيوف</h1>
        <p className="text-brand-secondary mt-2">من هنا تقدر تعمل كود تخلّي بيه أي حد يشوف ملخص حساباتك من غير ما يشوف التفاصيل.</p>
      </header>

      <div className="bg-brand-navy p-8 rounded-xl shadow-lg max-w-lg mx-auto text-center">
        <h2 className="text-xl font-bold text-brand-light mb-4">كود الدخول للزائر</h2>
        <p className="text-brand-secondary mb-6">
          ادي الكود ده لأي شخص عايز يشوف ملخص المرتب الشهري. الكود ده بيسمح بالاطلاع على الإجمالي فقط.
        </p>
        
        <div className="bg-brand-blue border-2 border-dashed border-brand-gold/50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-5xl font-black text-brand-gold tracking-[0.2em] font-mono select-all">
            {guestCode || '----'}
          </p>
          <button 
            onClick={handleCopy}
            className="p-3 bg-brand-secondary text-white rounded-lg hover:bg-opacity-80 transition"
            aria-label="نسخ الكود"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>
        {copied && <p className="text-green-400 mt-2">تم النسخ!</p>}
        
        <button 
          onClick={handleGenerateNewCode}
          className="mt-8 bg-brand-gold text-brand-blue font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md w-full md:w-auto mx-auto"
        >
          <RefreshCw size={20} />
          <span>إنشاء كود جديد</span>
        </button>
      </div>
    </div>
  );
};

export default GuestAccessScreen;