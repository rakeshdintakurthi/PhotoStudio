import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, RefreshCw, Key } from 'lucide-react';
import { PrivateGalleryAccess, EventGallery } from '@/types';

const privateSchema = z.object({
  eventId: z.string().min(1, 'Please select an associated event'),
  eventTitle: z.string().min(1, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  accessCode: z.string().min(4, 'Passcode must be at least 4 characters'),
  clientName: z.string().min(2, 'Client name is required'),
  clientEmail: z.string().email('Valid email is required'),
  expiresAt: z.string().nullable().optional(),
  allowHighResDownloads: z.boolean(),
  watermarkEnabled: z.boolean(),
  isActive: z.boolean(),
});

type PrivateFormData = z.infer<typeof privateSchema>;

interface PrivateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PrivateFormData) => Promise<void>;
  initialData?: PrivateGalleryAccess | null;
  events: EventGallery[];
}

export const PrivateGalleryModal: React.FC<PrivateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  events,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PrivateFormData>({
    resolver: zodResolver(privateSchema),
    defaultValues: {
      eventId: '',
      eventTitle: '',
      slug: '',
      accessCode: '',
      clientName: '',
      clientEmail: '',
      expiresAt: '',
      allowHighResDownloads: true,
      watermarkEnabled: false,
      isActive: true,
    },
  });

  const selectedEventId = watch('eventId');

  // When event selection changes, populate title and slug automatically
  useEffect(() => {
    if (selectedEventId && !initialData) {
      const ev = events.find((e) => e.id === selectedEventId);
      if (ev) {
        setValue('eventTitle', ev.title);
        setValue('slug', `${ev.slug || ev.id}-vip`);
        // Generate a random high-entropy passcode
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setValue('accessCode', randomCode);
      }
    }
  }, [selectedEventId, events, initialData, setValue]);

  useEffect(() => {
    if (initialData) {
      reset({
        eventId: initialData.eventId,
        eventTitle: initialData.eventTitle,
        slug: initialData.slug,
        accessCode: initialData.accessCode,
        clientName: initialData.clientName,
        clientEmail: initialData.clientEmail,
        expiresAt: initialData.expiresAt ? initialData.expiresAt.split('T')[0] : '',
        allowHighResDownloads: initialData.allowHighResDownloads,
        watermarkEnabled: initialData.watermarkEnabled,
        isActive: initialData.isActive,
      });
    } else {
      reset({
        eventId: events[0]?.id || '',
        eventTitle: events[0]?.title || '',
        slug: events[0] ? `${events[0].slug}-vip` : '',
        accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        clientName: '',
        clientEmail: '',
        expiresAt: '',
        allowHighResDownloads: true,
        watermarkEnabled: false,
        isActive: true,
      });
    }
  }, [initialData, reset, isOpen, events]);

  if (!isOpen) return null;

  const generatePasscode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setValue('accessCode', code);
  };

  const onSubmit = async (data: PrivateFormData) => {
    await onSave({
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E8E8E3] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#E8E8E3] flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#171717]">
              {initialData ? 'Edit Private Gallery Access' : 'Create Private Protected Gallery'}
            </h2>
            <p className="text-xs text-[#737373]">
              Generate secure client links with custom passcodes and expiration dates.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
          {/* Associated Event */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Select Event *</label>
            <select
              {...register('eventId')}
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-xs text-[#171717]"
            >
              <option value="">Select an event</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.totalPhotos} photos)
                </option>
              ))}
            </select>
            {errors.eventId && <span className="text-rose-500 mt-1 block">{errors.eventId.message}</span>}
          </div>

          {/* Custom Gallery Title */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Custom Gallery Display Title *</label>
            <input
              type="text"
              {...register('eventTitle')}
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] text-xs text-[#171717]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slug / Link URL */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Unique URL Slug *</label>
              <input
                type="text"
                {...register('slug')}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] text-xs text-[#171717]"
              />
              {errors.slug && <span className="text-rose-500 mt-1 block">{errors.slug.message}</span>}
            </div>

            {/* Access Passcode */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-700">Access Passcode *</label>
                <button
                  type="button"
                  onClick={generatePasscode}
                  className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Random</span>
                </button>
              </div>
              <input
                type="text"
                {...register('accessCode')}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] font-mono uppercase tracking-widest text-xs font-bold text-[#171717]"
              />
              {errors.accessCode && <span className="text-rose-500 mt-1 block">{errors.accessCode.message}</span>}
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Client Name *</label>
              <input
                type="text"
                {...register('clientName')}
                placeholder="e.g. Dr. Sameer Kapoor"
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Client Notification Email *</label>
              <input
                type="email"
                {...register('clientEmail')}
                placeholder="client@gmail.com"
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] text-xs text-[#171717]"
              />
            </div>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Access Expiration Date (Optional)</label>
            <input
              type="date"
              {...register('expiresAt')}
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-xs text-[#171717]"
            />
          </div>

          {/* Toggles */}
          <div className="p-4 rounded-xl bg-stone-50 border border-[#E5E5DE] space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-stone-800">Allow High-Resolution Original Downloads</span>
              <input
                type="checkbox"
                {...register('allowHighResDownloads')}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-stone-800">Apply Studio Watermark to Previews</span>
              <input
                type="checkbox"
                {...register('watermarkEnabled')}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#E5E5DE]">
              <span className="font-semibold text-stone-800">Active Link Access</span>
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#E8E8E3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D5D5CF] text-stone-700 hover:bg-stone-100 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-semibold text-xs"
            >
              {initialData ? 'Save Changes' : 'Generate Private Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
