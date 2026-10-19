import { AdminUser } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AdminUser> {
    // Simulated secure studio authentication
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (email.toLowerCase().includes('admin') || password === 'admin123' || email === 'rakesh@luminastudios.com') {
      return {
        id: 'adm-1',
        name: 'Rakesh Verma',
        email: email || 'rakesh@luminastudios.com',
        role: 'super_admin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        token: 'lumina_jwt_mock_token_secure_session',
      };
    }

    throw new Error('Invalid email or password. Use demo login or admin credentials.');
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    const raw = localStorage.getItem('lumina_auth_user');
    return raw ? JSON.parse(raw) : null;
  },
};
