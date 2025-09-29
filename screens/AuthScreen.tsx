import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

type AuthMode = 'login' | 'signup' | 'guest';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  const { login, signup, loginAsGuest } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [guestCode, setGuestCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(phone, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4 || !/^\d+$/.test(password)) {
      setError("كلمة المرور لازم تكون 4 أرقام أو أكتر.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup({ name, phone, password });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginAsGuest(guestCode);
      if (!result.success) {
        setError('الكود ده غلط.');
      }
    } catch (err: any) {
      setError('حصلت مشكلة، حاول تاني.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch(mode) {
      case 'signup':
        return (
          <>
            <h2 className="text-3xl font-bold text-center text-white mb-2">حساب جديد</h2>
            <p className="text-center text-brand-secondary mb-8">املأ بياناتك عشان تبدأ.</p>
            <form onSubmit={handleSignup} className="space-y-4">
              <input type="text" placeholder="الاسم بالكامل" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold outline-none transition text-white"/>
              <input type="tel" placeholder="رقم الموبايل" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold outline-none transition text-white"/>
              <input type="password" placeholder="كلمة المرور (أرقام فقط)" value={password} onChange={e => setPassword(e.target.value)} required inputMode="numeric" pattern="\d*" className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold outline-none transition text-white"/>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-500">{loading ? 'لحظات...' : 'إنشاء الحساب'}</button>
            </form>
            <p className="text-center mt-6 text-brand-secondary">عندك حساب؟ <button onClick={() => setMode('login')} className="text-brand-gold font-bold hover:underline">سجل دخولك</button></p>
          </>
        );
      case 'guest':
        return (
          <>
            <h2 className="text-3xl font-bold text-center text-white mb-2">الدخول كزائر</h2>
            <p className="text-center text-brand-secondary mb-8">اكتب الكود عشان تشوف التقرير.</p>
            <form onSubmit={handleGuestLogin} className="space-y-4">
              <input type="text" placeholder="اكتب الكود هنا" value={guestCode} onChange={e => setGuestCode(e.target.value)} required inputMode="numeric" pattern="\d*" className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold outline-none transition text-center tracking-[0.5em] text-white"/>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-500">{loading ? 'لحظات...' : 'دخول'}</button>
            </form>
            <p className="text-center mt-6"><button onClick={() => setMode('login')} className="text-brand-gold font-bold hover:underline">رجوع لتسجيل الدخول</button></p>
          </>
        );
      case 'login':
      default:
        return (
          <>
            <h2 className="text-3xl font-bold text-center text-white mb-2">أهلاً بك يا مستر</h2>
            <p className="text-center text-brand-secondary mb-8">سجل دخولك عشان تشوف حساباتك.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="tel" placeholder="رقم الموبايل" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold outline-none transition text-white"/>
              <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold outline-none transition text-white"/>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-500">{loading ? 'لحظات...' : 'تسجيل الدخول'}</button>
            </form>
            <div className="text-center mt-6 space-y-2">
              <p className="text-brand-secondary">ماعندكش حساب؟ <button onClick={() => setMode('signup')} className="text-brand-gold font-bold hover:underline">اعمل حساب جديد</button></p>
              <p className="text-brand-secondary">أو <button onClick={() => setMode('guest')} className="text-brand-gold font-bold hover:underline">ادخل كزائر</button></p>
            </div>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-brand-blue p-8 rounded-xl shadow-2xl border border-brand-gold/20">
          {error && <p className="text-red-400 text-sm text-center bg-red-900/50 border border-red-500 rounded-md p-3 mb-4">{error}</p>}
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;