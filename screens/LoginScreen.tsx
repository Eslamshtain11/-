import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // FIX: The login function from useAuth expects phone and password, but was called with no arguments on line 15.
  // The handler is updated to be async, take both inputs, and call login correctly with error handling.
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

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
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
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-500"
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
