import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Search, Lock, User, Menu, X, ArrowUpRight, Shield, Heart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useGalleryStore } from '@/store/galleryStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated: isAdminAuthenticated, user: adminUser } = useAuthStore();
  const { isCustomerAuthenticated, customer } = useCustomerStore();
  const { searchQuery, setSearchQuery } = useGalleryStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Discover Events', path: '/discover' },
    { name: 'Colleges', path: '/colleges' },
    { name: 'Private Gallery', path: '/private-access', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-[#EAEAE6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#171717] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Camera className="w-5 h-5 text-indigo-400 stroke-[1.75]" />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#171717]">
                Lumina
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#737373] -mt-1">
                Studios & Galleries
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 py-1 ${
                    isActive
                      ? 'text-[#4F46E5] font-semibold border-b-2 border-[#4F46E5]'
                      : 'text-[#4A4A4A] hover:text-[#171717]'
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 opacity-80" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="hidden lg:flex items-center gap-3.5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search college, fest, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 pl-9 pr-4 py-2 text-xs rounded-full border border-[#E0E0DB] bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all placeholder:text-[#999]"
              />
              <Search className="w-3.5 h-3.5 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Customer Authentication Link */}
            {isCustomerAuthenticated ? (
              <Link
                to="/account"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  location.pathname === '/account'
                    ? 'border-[#4F46E5] bg-indigo-50 text-indigo-700'
                    : 'border-[#D5D5CF] bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                  {customer?.name.charAt(0)}
                </div>
                <span>My Account</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-full hover:bg-stone-100 transition-colors"
              >
                Customer Login
              </Link>
            )}

            {/* Photographer Portal / Admin Dashboard Link */}
            {isAdminAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full border border-[#D5D5CF] bg-white hover:bg-stone-50 transition-colors shadow-xs"
              >
                <img
                  src={adminUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                  alt="Admin"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-[#171717]">Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#171717] text-white hover:bg-[#2B2B2B] transition-all shadow-xs group"
              >
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>Photographer Portal</span>
                <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/private-access"
              className="p-2 text-[#4A4A4A] hover:text-[#171717]"
              title="Private Gallery"
            >
              <Lock className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171717] rounded-lg hover:bg-stone-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAEAE6] bg-[#FAFAF8] px-4 pt-3 pb-6 space-y-4 animate-in fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search events, colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#E0E0DB] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 px-3 text-sm font-medium text-[#262626] rounded-md hover:bg-stone-100"
              >
                {link.icon && <link.icon className="w-4 h-4 text-[#737373]" />}
                {link.name}
              </Link>
            ))}

            {isCustomerAuthenticated ? (
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 px-3 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md"
              >
                <User className="w-4 h-4" />
                <span>My Customer Account ({customer?.name})</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 px-3 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-md"
              >
                <User className="w-4 h-4" />
                <span>Customer Login / Register</span>
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-[#EAEAE6]">
            {isAdminAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-lg bg-[#171717] text-white"
              >
                Go to Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-lg bg-[#171717] text-white"
              >
                Photographer Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
