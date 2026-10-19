export type EventCategory = 
  | 'college_fest'
  | 'cultural_event'
  | 'convocation'
  | 'wedding'
  | 'anniversary'
  | 'birthday'
  | 'private_event';

export interface College {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  location: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  establishedYear: number;
  totalEvents: number;
}

export interface PhotoExif {
  camera?: string;
  lens?: string;
  focalLength?: string;
  iso?: number;
  shutterSpeed?: string;
  aperture?: string;
}

export interface Photo {
  id: string;
  eventId: string;
  title: string;
  url: string; // High-res CDN URL
  thumbnailUrl: string; // WebP compressed thumbnail
  width: number;
  height: number;
  aspectRatio: number;
  sizeBytes: number;
  capturedAt: string;
  uploadedAt: string;
  downloadCount: number;
  viewsCount: number;
  tags: string[];
  exif?: PhotoExif;
  featured?: boolean;
}

export interface EventGallery {
  id: string;
  title: string;
  slug: string;
  collegeId?: string;
  collegeName?: string;
  category: EventCategory;
  date: string;
  year: number;
  location: string;
  photographer: string;
  coverPhotoUrl: string;
  description: string;
  totalPhotos: number;
  status: 'published' | 'draft' | 'archived';
  isPrivate: boolean;
  privateAccessCode?: string;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateGalleryAccess {
  id: string;
  eventId: string;
  eventTitle: string;
  slug: string;
  accessCode: string;
  clientName: string;
  clientEmail: string;
  expiresAt: string | null;
  allowHighResDownloads: boolean;
  watermarkEnabled: boolean;
  totalViews: number;
  totalDownloads: number;
  createdAt: string;
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'photographer' | 'editor';
  avatarUrl: string;
  token?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  savedPhotoIds: string[];
  sharedGallerySlugs: string[];
  createdAt: string;
}

export interface UploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  storageKey?: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  totalPhotos: number;
  totalColleges: number;
  totalDownloads: number;
  totalViews: number;
  storageUsedBytes: number;
  monthlyUploads: { month: string; uploads: number; downloads: number }[];
  categoryBreakdown: { category: string; count: number }[];
  topEvents: { id: string; title: string; views: number; downloads: number }[];
}
