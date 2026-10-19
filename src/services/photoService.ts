import { Photo } from '@/types';
import { MOCK_PHOTOS } from './mockData';

const PHOTOS_KEY = 'lumina_photos_v2';

function getStoredPhotos(): Photo[] {
  try {
    const raw = localStorage.getItem(PHOTOS_KEY);
    if (!raw) {
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(MOCK_PHOTOS));
      return MOCK_PHOTOS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_PHOTOS;
  }
}

function savePhotos(photos: Photo[]): void {
  try {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  } catch (err) {
    console.error('Failed to save photos to localStorage', err);
  }
}

export const photoService = {
  async getByEventId(eventId: string): Promise<Photo[]> {
    const photos = getStoredPhotos();
    // 1. Get all photos specifically associated with this eventId
    const eventPhotos = photos.filter((p) => p.eventId === eventId);
    
    // Sort so newly uploaded photos (ph-user- or newest uploadedAt) appear first at the top
    eventPhotos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    if (eventPhotos.length > 0) {
      return eventPhotos;
    }

    // Fallback: If an event has no specific photos yet, provide representative photos with this eventId
    return photos.slice(0, 8).map((p, idx) => ({
      ...p,
      id: `fallback-${eventId}-${idx}`,
      eventId,
    }));
  },

  async getById(id: string): Promise<Photo | null> {
    const photos = getStoredPhotos();
    return photos.find((p) => p.id === id) || null;
  },

  async addBatch(newPhotos: Omit<Photo, 'id' | 'downloadCount' | 'viewsCount' | 'uploadedAt'>[]): Promise<Photo[]> {
    const photos = getStoredPhotos();
    const created: Photo[] = newPhotos.map((p, index) => ({
      ...p,
      id: `ph-user-${Date.now()}-${index}`,
      downloadCount: 0,
      viewsCount: 0,
      uploadedAt: new Date().toISOString(),
      featured: true,
      tags: [...(p.tags || []), 'uploaded'],
    }));

    // Prepend newly uploaded photos to the very front so they appear first everywhere
    savePhotos([...created, ...photos]);
    return created;
  },

  async delete(id: string): Promise<void> {
    const photos = getStoredPhotos().filter((p) => p.id !== id);
    savePhotos(photos);
  },

  async deleteBatch(ids: string[]): Promise<void> {
    const set = new Set(ids);
    const photos = getStoredPhotos().filter((p) => !set.has(p.id));
    savePhotos(photos);
  },

  async incrementDownloads(id: string): Promise<void> {
    const photos = getStoredPhotos();
    const idx = photos.findIndex((p) => p.id === id);
    if (idx !== -1) {
      photos[idx].downloadCount = (photos[idx].downloadCount || 0) + 1;
      savePhotos(photos);
    }
  },

  async incrementViews(id: string): Promise<void> {
    const photos = getStoredPhotos();
    const idx = photos.findIndex((p) => p.id === id);
    if (idx !== -1) {
      photos[idx].viewsCount = (photos[idx].viewsCount || 0) + 1;
      savePhotos(photos);
    }
  },
};
