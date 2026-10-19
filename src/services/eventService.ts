import { EventGallery, EventCategory } from '@/types';
import { MOCK_EVENTS } from './mockData';

const EVENTS_KEY = 'lumina_events_v2';

function getStoredEvents(): EventGallery[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(MOCK_EVENTS));
      return MOCK_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_EVENTS;
  }
}

function saveEvents(events: EventGallery[]): void {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to localStorage', err);
  }
}

export interface EventFilterOptions {
  search?: string;
  collegeId?: string;
  category?: EventCategory | 'all';
  location?: string;
  year?: number | 'all';
  includePrivate?: boolean;
  status?: 'all' | 'published' | 'draft' | 'archived';
  sortBy?: 'recent' | 'oldest' | 'photos' | 'views';
}

export const eventService = {
  async getAll(filters?: EventFilterOptions): Promise<EventGallery[]> {
    let events = getStoredEvents();

    if (filters) {
      if (!filters.includePrivate) {
        // Exclude private galleries from public discovery as required
        events = events.filter((e) => !e.isPrivate);
      }

      if (filters.status && filters.status !== 'all') {
        events = events.filter((e) => e.status === filters.status);
      } else if (!filters.includePrivate) {
        // Default public only sees published
        events = events.filter((e) => e.status === 'published');
      }

      if (filters.collegeId) {
        events = events.filter((e) => e.collegeId === filters.collegeId);
      }

      if (filters.location && filters.location !== 'all') {
        const loc = filters.location.toLowerCase();
        events = events.filter((e) => e.location.toLowerCase().includes(loc));
      }

      if (filters.category && filters.category !== 'all') {
        events = events.filter((e) => e.category === filters.category);
      }

      if (filters.year && filters.year !== 'all') {
        events = events.filter((e) => e.year === Number(filters.year));
      }

      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        events = events.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.collegeName?.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        );
      }

      if (filters.sortBy) {
        if (filters.sortBy === 'recent') {
          events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (filters.sortBy === 'oldest') {
          events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (filters.sortBy === 'photos') {
          events.sort((a, b) => b.totalPhotos - a.totalPhotos);
        } else if (filters.sortBy === 'views') {
          events.sort((a, b) => b.viewCount - a.viewCount);
        }
      }
    }

    return events;
  },

  async getById(idOrSlug: string): Promise<EventGallery | null> {
    const events = getStoredEvents();
    return events.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || null;
  },

  async getFeatured(): Promise<EventGallery[]> {
    const events = await this.getAll({ includePrivate: false });
    return events.slice(0, 3);
  },

  async getRecent(limit: number = 6): Promise<EventGallery[]> {
    const events = await this.getAll({ includePrivate: false, sortBy: 'recent' });
    return events.slice(0, limit);
  },

  async create(data: Omit<EventGallery, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'viewCount'>): Promise<EventGallery> {
    const events = getStoredEvents();
    const newEvent: EventGallery = {
      ...data,
      id: `ev-${Date.now()}`,
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveEvents([newEvent, ...events]);
    return newEvent;
  },

  async update(id: string, updates: Partial<EventGallery>): Promise<EventGallery> {
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');
    const updated = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    events[index] = updated;
    saveEvents(events);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const events = getStoredEvents().filter((e) => e.id !== id);
    saveEvents(events);
  },

  async incrementViews(id: string): Promise<void> {
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index !== -1) {
      events[index].viewCount = (events[index].viewCount || 0) + 1;
      saveEvents(events);
    }
  },

  async incrementDownloads(id: string, count: number = 1): Promise<void> {
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index !== -1) {
      events[index].downloadCount = (events[index].downloadCount || 0) + count;
      saveEvents(events);
    }
  },
};
