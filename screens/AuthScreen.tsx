import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'guest'>('login');
  const { login, signup, loginAsGuest } = useAuth();

  // State for user login
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // State for sign up
  const [name, setName] = useState('');

  // State for guest login
  const [guestCode, setGuestCode] = useState('');

  // Common state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const clearState = () => {
      setError('');
      setSuccess('');
      setPhone('');
      setPassword('');
      setName('');
      setGuestCode('');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    try {
      await login(phone.trim(), password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("كلمة المرور لازم تكون 6 حروف أو أرقام على الأقل.");
        return;
    }
    clearState();
    setLoading(true);
    try {
        const data = await signup(name.trim(), phone.trim(), password);
        if (data.user && !data.session) {
            setSuccess("تم إنشاء الحساب بنجاح! من فضلك سجل دخولك.");
            // pre-fill phone for login convenience
            const registeredPhone = phone;
            clearState();
            setPhone(registeredPhone);
            setMode('login');
        } else {
            // This case happens if email confirmation is disabled, user is logged in right away.
            // No need to do anything, the auth listener will handle navigation.
        }
    } catch (err: any) {
        setError(err.message || "حصل خطأ، حاول تاني.");
    } finally {
        setLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestCode.trim()) {
      setError("من فضلك أدخل كود الدخول.");
      return;
    }
    clearState();
    setLoading(true);
    try {
      await loginAsGuest(guestCode);
    } catch (err: any)      {
      setError(err.message || 'حدث خطأ ما.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserLogin = () => (
    <div className="bg-brand-blue p-8 rounded-xl shadow-2xl border border-brand-gold/20">
      <h2 className="text-3xl font-bold text-center text-white mb-2">أهلاً بك يا مستر</h2>
      <p className="text-center text-brand-secondary mb-8">سجل دخولك عشان تشوف حساباتك.</p>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-brand-light mb-2">رقم الموبايل</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-center"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-brand-light mb-2">كلمة المرور</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-center"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-500"
        >
          {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  );
  
  const renderUserSignup = () => (
    <div className="bg-brand-blue p-8 rounded-xl shadow-2xl border border-brand-gold/20">
      <h2 className="text-3xl font-bold text-center text-white mb-2">إنشاء حساب جديد</h2>
      <p className="text-center text-brand-secondary mb-8">املأ بياناتك عشان تبدأ.</p>
      <form onSubmit={handleSignUp} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-brand-light mb-2">اسمك</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-center"
            required
          />
        </div>
        <div>
          <label htmlFor="phone-signup" className="block text-brand-light mb-2">رقم الموبايل (ده هيكون اسم المستخدم)</label>
          <input
            type="tel"
            id="phone-signup"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-center"
            required
          />
        </div>
        <div>
          <label htmlFor="password-signup" className="block text-brand-light mb-2">كلمة المرور (6 حروف أو أرقام على الأقل)</label>
          <input
            type="password"
            id="password-signup"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-center"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-500"
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
        </button>
      </form>
    </div>
  );

  const renderGuestLogin = () => (
    <div className="bg-brand-blue p-8 rounded-xl shadow-2xl border border-brand-gold/20">
      <h2 className="text-3xl font-bold text-center text-white mb-2">أهلاً بك يا زائر</h2>
      <p className="text-center text-brand-secondary mb-8">أدخل كود الدخول عشان تشوف ملخص الحسابات.</p>
      <form onSubmit={handleGuestLogin} className="space-y-6">
        <div>
          <label htmlFor="guestCode" className="block text-brand-light mb-2">كود الدخول</label>
          <input
            type="text"
            id="guestCode"
            value={guestCode}
            onChange={(e) => setGuestCode(e.target.value)}
            className="w-full bg-brand-navy border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-center tracking-[0.2em] font-mono"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-500"
        >
          {loading ? 'جاري الدخول...' : 'دخول كزائر'}
        </button>
      </form>
    </div>
  );
  
  const renderForm = () => {
      switch(mode) {
          case 'login': return renderUserLogin();
          case 'signup': return renderUserSignup();
          case 'guest': return renderGuestLogin();
      }
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        {renderForm()}
        
        {error && <p className="text-red-400 text-sm text-center mt-4 p-3 bg-red-900/50 rounded-lg">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center mt-4 p-3 bg-green-900/50 rounded-lg">{success}</p>}


        <div className="mt-6 text-center space-y-2">
          {mode !== 'signup' && (
            <button
                onClick={() => { clearState(); setMode('signup'); }}
                className="text-brand-secondary hover:text-brand-gold transition"
            >
                معنديش حساب.. هعمل واحد جديد
            </button>
          )}
           {mode !== 'login' && (
            <button
                onClick={() => { clearState(); setMode('login'); }}
                className="text-brand-secondary hover:text-brand-gold transition block mx-auto"
            >
               عندي حساب بالفعل
            </button>
          )}
          <div className="border-t border-brand-secondary/20 my-2"></div>
           {mode !== 'guest' ? (
            <button
                onClick={() => { clearState(); setMode('guest'); }}
                className="text-brand-secondary hover:text-brand-gold transition"
            >
                دخول كزائر
            </button>
           ) : (
            <button
                onClick={() => { clearState(); setMode('login'); }}
                className="text-brand-secondary hover:text-brand-gold transition"
            >
               دخول كصاحب حساب
            </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;