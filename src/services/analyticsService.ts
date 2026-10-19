import { AnalyticsSummary } from '@/types';
import { MOCK_ANALYTICS } from './mockData';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    return MOCK_ANALYTICS;
  },

  async logEventView(eventId: string): Promise<void> {
    console.debug('[Analytics] Event viewed:', eventId);
  },

  async logPhotoDownload(photoId: string, eventId: string): Promise<void> {
    console.debug('[Analytics] Photo downloaded:', { photoId, eventId });
  },
};
