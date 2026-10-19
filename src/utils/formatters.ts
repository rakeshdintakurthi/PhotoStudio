import { EventCategory } from '@/types';

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getCategoryLabel(category: EventCategory): string {
  const map: Record<EventCategory, string> = {
    college_fest: 'College Fest',
    cultural_event: 'Cultural Event',
    convocation: 'Graduation & Convocation',
    wedding: 'Wedding & Reception',
    anniversary: 'Anniversary',
    birthday: 'Birthday Party',
    private_event: 'Private Gala & Family',
  };
  return map[category] || category;
}

export function getCategoryBadgeClass(category: EventCategory): string {
  switch (category) {
    case 'college_fest':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'cultural_event':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'convocation':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'wedding':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'anniversary':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'birthday':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-stone-50 text-stone-700 border-stone-200';
  }
}
