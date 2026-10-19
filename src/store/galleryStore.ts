import { create } from 'zustand';
import { Photo } from '@/types';

interface GalleryState {
  // Multi-selection state
  selectedPhotoIds: Set<string>;
  togglePhotoSelect: (photoId: string) => void;
  selectAll: (photos: Photo[]) => void;
  deselectAll: () => void;
  isPhotoSelected: (photoId: string) => boolean;
  
  // Lightbox state
  activeLightboxIndex: number | null;
  lightboxPhotos: Photo[];
  openLightbox: (photos: Photo[], initialIndex: number) => void;
  closeLightbox: () => void;
  nextLightbox: () => void;
  prevLightbox: () => void;

  // Global search input in navbar
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  selectedPhotoIds: new Set<string>(),

  togglePhotoSelect: (photoId: string) => {
    const current = new Set(get().selectedPhotoIds);
    if (current.has(photoId)) {
      current.delete(photoId);
    } else {
      current.add(photoId);
    }
    set({ selectedPhotoIds: current });
  },

  selectAll: (photos: Photo[]) => {
    const allIds = new Set(photos.map((p) => p.id));
    set({ selectedPhotoIds: allIds });
  },

  deselectAll: () => {
    set({ selectedPhotoIds: new Set<string>() });
  },

  isPhotoSelected: (photoId: string) => {
    return get().selectedPhotoIds.has(photoId);
  },

  // Lightbox
  activeLightboxIndex: null,
  lightboxPhotos: [],
  openLightbox: (photos: Photo[], initialIndex: number) => {
    set({ lightboxPhotos: photos, activeLightboxIndex: initialIndex });
  },
  closeLightbox: () => {
    set({ activeLightboxIndex: null, lightboxPhotos: [] });
  },
  nextLightbox: () => {
    const { activeLightboxIndex, lightboxPhotos } = get();
    if (activeLightboxIndex !== null && activeLightboxIndex < lightboxPhotos.length - 1) {
      set({ activeLightboxIndex: activeLightboxIndex + 1 });
    } else if (activeLightboxIndex !== null && lightboxPhotos.length > 0) {
      set({ activeLightboxIndex: 0 }); // Loop back
    }
  },
  prevLightbox: () => {
    const { activeLightboxIndex, lightboxPhotos } = get();
    if (activeLightboxIndex !== null && activeLightboxIndex > 0) {
      set({ activeLightboxIndex: activeLightboxIndex - 1 });
    } else if (activeLightboxIndex !== null && lightboxPhotos.length > 0) {
      set({ activeLightboxIndex: lightboxPhotos.length - 1 }); // Loop to end
    }
  },

  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
