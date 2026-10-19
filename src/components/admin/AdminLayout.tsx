import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Image as ImageIcon,
  UploadCloud,
  Lock,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Camera,
  Plus
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Colleges', path: '/admin/colleges', icon: GraduationCap },
    { name: 'Galleries', path: '/admin/galleries', icon: ImageIcon },
    { name: 'Upload Photos', path: '/admin/upload', icon: UploadCloud, highlight: true },
    { name: 'Private Galleries', path: '/admin/private-galleries', icon: Lock },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F2] flex flex-col md:flex-row text-[#171717]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#171717] text-white sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-indigo-400" />
          <span className="font-editorial text-lg font-bold">Lumina Studio Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-neutral-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Blogger simplicity meets modern SaaS) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#171717] text-[#A3A3A3] flex flex-col justify-between z-40 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-neutral-800">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-editorial text-lg font-bold text-white tracking-tight">
                  Lumina Studios
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                  Studio CMS v2.4
                </p>
              </div>
            </Link>

            {/* Quick Create Button */}
            <Link
              to="/admin/upload"
              onClick={() => setSidebarOpen(false)}
              className="mt-5 w-full py-2.5 px-3 rounded-xl bg-white text-[#171717] text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>New Photo Upload</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-260px)]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                      : 'hover:bg-neutral-800/60 hover:text-white text-neutral-400'
                  } ${item.highlight && !isActive ? 'text-indigo-300 font-semibold' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-neutral-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User profile & Live site */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Public Website</span>
            </span>
          </Link>

          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover border border-neutral-700"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Studio Admin'}</p>
                <p className="text-[10px] text-neutral-400 truncate">{user?.email || 'admin@lumina.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
