import { PrivateGalleryAccess } from '@/types';
import { MOCK_PRIVATE_GALLERIES } from './mockData';

const PRIVATE_KEY = 'lumina_private_galleries_v2';

function getStoredPrivate(): PrivateGalleryAccess[] {
  try {
    const raw = localStorage.getItem(PRIVATE_KEY);
    if (!raw) {
      localStorage.setItem(PRIVATE_KEY, JSON.stringify(MOCK_PRIVATE_GALLERIES));
      return MOCK_PRIVATE_GALLERIES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_PRIVATE_GALLERIES;
  }
}

function savePrivate(galleries: PrivateGalleryAccess[]): void {
  try {
    localStorage.setItem(PRIVATE_KEY, JSON.stringify(galleries));
  } catch (err) {
    console.error('Failed to save private galleries', err);
  }
}

export const privateGalleryService = {
  async getAll(): Promise<PrivateGalleryAccess[]> {
    return getStoredPrivate();
  },

  async getBySlug(slug: string): Promise<PrivateGalleryAccess | null> {
    const list = getStoredPrivate();
    return list.find((g) => g.slug === slug || g.id === slug) || null;
  },

  async getByCode(code: string): Promise<PrivateGalleryAccess | null> {
    const clean = code.trim().toUpperCase();
    const list = getStoredPrivate();
    return list.find((g) => g.accessCode.toUpperCase() === clean && g.isActive) || null;
  },

  async validateAccess(slugOrCode: string, inputCode: string): Promise<{ valid: boolean; gallery?: PrivateGalleryAccess; error?: string }> {
    const list = getStoredPrivate();
    const target = list.find(
      (g) => g.slug === slugOrCode || g.accessCode.toUpperCase() === slugOrCode.toUpperCase()
    );

    if (!target) {
      return { valid: false, error: 'Gallery not found. Please check your link or invitation code.' };
    }

    if (!target.isActive) {
      return { valid: false, error: 'Access to this private gallery has been revoked or archived by the studio.' };
    }

    if (target.expiresAt && new Date(target.expiresAt).getTime() < Date.now()) {
      return { valid: false, error: 'This private gallery access link has expired.' };
    }

    if (target.accessCode.toUpperCase() !== inputCode.trim().toUpperCase()) {
      return { valid: false, error: 'Incorrect access passcode. Please check your invitation email.' };
    }

    return { valid: true, gallery: target };
  },

  async create(data: Omit<PrivateGalleryAccess, 'id' | 'createdAt' | 'totalViews' | 'totalDownloads'>): Promise<PrivateGalleryAccess> {
    const list = getStoredPrivate();
    const newGallery: PrivateGalleryAccess = {
      ...data,
      id: `pvg-${Date.now()}`,
      totalViews: 0,
      totalDownloads: 0,
      createdAt: new Date().toISOString(),
    };
    savePrivate([newGallery, ...list]);
    return newGallery;
  },

  async update(id: string, updates: Partial<PrivateGalleryAccess>): Promise<PrivateGalleryAccess> {
    const list = getStoredPrivate();
    const index = list.findIndex((g) => g.id === id);
    if (index === -1) throw new Error('Private gallery not found');
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    savePrivate(list);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const list = getStoredPrivate().filter((g) => g.id !== id);
    savePrivate(list);
  },
};
