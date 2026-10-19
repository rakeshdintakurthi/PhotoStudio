import { create } from 'zustand';
import { CustomerUser } from '@/types';

interface CustomerState {
  customer: CustomerUser | null;
  isCustomerAuthenticated: boolean;
  loginCustomer: (customer: CustomerUser) => void;
  logoutCustomer: () => void;
  toggleFavoritePhoto: (photoId: string) => void;
  isPhotoFavorite: (photoId: string) => boolean;
  addSharedGallery: (slug: string) => void;
}

const CUSTOMER_STORAGE_KEY = 'lumina_customer_user_v1';

function getInitialCustomer(): CustomerUser | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
}

export const useCustomerStore = create<CustomerState>((set, get) => {
  const initial = getInitialCustomer();
  return {
    customer: initial,
    isCustomerAuthenticated: !!initial,

    loginCustomer: (customer: CustomerUser) => {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
      set({ customer, isCustomerAuthenticated: true });
    },

    logoutCustomer: () => {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      set({ customer: null, isCustomerAuthenticated: false });
    },

    toggleFavoritePhoto: (photoId: string) => {
      const current = get().customer;
      if (!current) return;
      const setIds = new Set(current.savedPhotoIds || []);
      if (setIds.has(photoId)) {
        setIds.delete(photoId);
      } else {
        setIds.add(photoId);
      }
      const updated: CustomerUser = {
        ...current,
        savedPhotoIds: Array.from(setIds),
      };
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
      set({ customer: updated });
    },

    isPhotoFavorite: (photoId: string) => {
      const current = get().customer;
      return current ? (current.savedPhotoIds || []).includes(photoId) : false;
    },

    addSharedGallery: (slug: string) => {
      const current = get().customer;
      if (!current) return;
      const slugs = new Set(current.sharedGallerySlugs || []);
      slugs.add(slug);
      const updated: CustomerUser = {
        ...current,
        sharedGallerySlugs: Array.from(slugs),
      };
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
      set({ customer: updated });
    },
  };
});
