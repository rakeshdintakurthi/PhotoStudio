import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCustomerStore } from '@/store/customerStore';

export const CustomerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const { loginCustomer } = useCustomerStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate authentication check
    setTimeout(() => {
      loginCustomer({
        id: `cust-${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email.trim(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        savedPhotoIds: ['ph-101', 'ph-301', 'ph-801'],
        sharedGallerySlugs: ['harika-chaitanya-haldi-guntur'],
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      navigate('/account');
    }, 600);
  };

  const handleDemoLogin = () => {
    loginCustomer({
      id: 'cust-demo-1',
      name: 'Aditya Varma',
      email: 'aditya.varma@gmail.com',
      phone: '+91 98480 22334',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      savedPhotoIds: ['ph-101', 'ph-301', 'ph-801'],
      sharedGallerySlugs: ['harika-chaitanya-haldi-guntur'],
      createdAt: '2026-01-10T10:00:00Z',
    });
    navigate('/account');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setForgotSent(true);
      setTimeout(() => {
        setForgotSent(false);
        setShowForgotModal(false);
        setForgotEmail('');
      }, 2500);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#FAFAF8]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E8E3] shadow-xl shadow-stone-200/50 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#171717] flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5 text-indigo-400 stroke-[1.75]" />
            </div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#171717]">
              Lumina Studios
            </span>
          </Link>
          <h1 className="font-editorial text-2xl font-bold text-[#171717] pt-2">
            Customer Sign In
          </h1>
          <p className="text-xs text-[#737373]">
            Access your saved favorites, shared event albums, and download history.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#171717]"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-[#4F46E5] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#171717]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-stone-400 hover:text-stone-700 absolute right-3 top-1/2 -translate-y-1/2"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500"
              />
              <span className="text-stone-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo 1-Click Customer Button */}
        <div className="pt-3 border-t border-[#F0F0EB] space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[#4F46E5] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>One-Click Demo Customer Sign In</span>
          </button>
          <p className="text-[11px] text-center text-[#737373]">
            Instant access with preloaded saved favorites and shared Andhra Pradesh wedding album.
          </p>
        </div>

        {/* Register Prompt */}
        <div className="text-center text-xs text-[#737373] pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#4F46E5] hover:underline">
            Register here
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#E8E8E3] animate-in zoom-in-95">
            <h3 className="font-editorial text-lg font-bold text-[#171717]">Reset Password</h3>
            <p className="text-xs text-[#737373]">
              Enter your email address and we'll send you a password reset link.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password reset link sent to your email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 rounded-lg border border-[#D5D5CF] text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#171717] text-white font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
