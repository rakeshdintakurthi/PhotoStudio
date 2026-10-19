import { create } from 'zustand';
import { AdminUser } from '@/types';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'lumina_auth_user';

function getInitialUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
}

export const useAuthStore = create<AuthState>((set) => {
  const initialUser = getInitialUser();
  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    login: (user: AdminUser) => {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      set({ user: null, isAuthenticated: false });
    },
  };
});
