import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Рамзҳо мувофиқат намекунанд.');
      return;
    }

    if (password.length < 6) {
      setError('Дарозии рамз бояд на кам аз 6 аломат бошад.');
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ин почта аллакай ба қайд гирифта шудааст.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Формати почта нодуруст аст.');
      } else {
        setError(err.message || 'Хатогӣ ҳангоми бақайдгирӣ.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="Хароҷоти Ман" className="w-16 h-16 rounded-2xl mx-auto object-contain shadow-xl shadow-sky-500/20" />
          <h2 className="text-2xl font-bold text-white">Бақайдгирии нав</h2>
          <p className="text-xs text-slate-400">Барои оғози истифодаи "Хароҷоти Ман"</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Почтаи электронӣ (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ном@мисол.tj"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Рамз (Парол)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Камаш 6 аломат"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Тасдиқи рамз
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Такрори рамз"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Сабт шуда истодааст...' : 'Эҷоди ҳисоб'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Аллакай ҳисоб доред?{' '}
          <Link to="/login" className="text-sky-400 hover:underline font-medium">
            Ворид шудан
          </Link>
        </p>
      </div>
    </div>
  );
};
