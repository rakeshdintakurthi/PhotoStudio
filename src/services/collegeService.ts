import { College } from '@/types';
import { MOCK_COLLEGES } from './mockData';

const COLLEGES_KEY = 'lumina_colleges_v2';

function getStoredColleges(): College[] {
  try {
    const raw = localStorage.getItem(COLLEGES_KEY);
    if (!raw) {
      localStorage.setItem(COLLEGES_KEY, JSON.stringify(MOCK_COLLEGES));
      return MOCK_COLLEGES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_COLLEGES;
  }
}

function saveColleges(colleges: College[]): void {
  try {
    localStorage.setItem(COLLEGES_KEY, JSON.stringify(colleges));
  } catch (err) {
    console.error('Failed to save colleges to localStorage', err);
  }
}

export const collegeService = {
  async getAll(): Promise<College[]> {
    return getStoredColleges();
  },

  async getById(id: string): Promise<College | null> {
    const colleges = getStoredColleges();
    return colleges.find((c) => c.id === id || c.slug === id) || null;
  },

  async create(data: Omit<College, 'id' | 'totalEvents'>): Promise<College> {
    const colleges = getStoredColleges();
    const newCollege: College = {
      ...data,
      id: `col-${Date.now()}`,
      totalEvents: 0,
    };
    const updated = [newCollege, ...colleges];
    saveColleges(updated);
    return newCollege;
  },

  async update(id: string, updates: Partial<College>): Promise<College> {
    const colleges = getStoredColleges();
    const index = colleges.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('College not found');
    const updatedCollege = { ...colleges[index], ...updates };
    colleges[index] = updatedCollege;
    saveColleges(colleges);
    return updatedCollege;
  },

  async delete(id: string): Promise<void> {
    const colleges = getStoredColleges().filter((c) => c.id !== id);
    saveColleges(colleges);
  },
};
