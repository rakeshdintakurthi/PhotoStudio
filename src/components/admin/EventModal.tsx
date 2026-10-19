import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { EventGallery, College, EventCategory } from '@/types';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  collegeId: z.string().optional(),
  category: z.enum([
    'college_fest',
    'cultural_event',
    'convocation',
    'wedding',
    'anniversary',
    'birthday',
    'private_event',
  ]),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(2, 'Location is required'),
  photographer: z.string().min(2, 'Photographer name is required'),
  coverPhotoUrl: z.string().url('Must be a valid image URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['published', 'draft', 'archived']),
  isPrivate: z.boolean(),
  privateAccessCode: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<void>;
  initialData?: EventGallery | null;
  colleges: College[];
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  colleges,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      collegeId: '',
      category: 'college_fest',
      date: new Date().toISOString().split('T')[0],
      location: '',
      photographer: 'Lumina Studios Lead',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=85',
      description: '',
      status: 'published',
      isPrivate: false,
      privateAccessCode: '',
    },
  });

  const isPrivate = watch('isPrivate');
  const coverPhotoUrl = watch('coverPhotoUrl');

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        collegeId: initialData.collegeId || '',
        category: initialData.category,
        date: initialData.date,
        location: initialData.location,
        photographer: initialData.photographer,
        coverPhotoUrl: initialData.coverPhotoUrl,
        description: initialData.description,
        status: initialData.status,
        isPrivate: initialData.isPrivate,
        privateAccessCode: initialData.privateAccessCode || '',
      });
    } else {
      reset({
        title: '',
        collegeId: '',
        category: 'college_fest',
        date: new Date().toISOString().split('T')[0],
        location: '',
        photographer: 'Lumina Studios Lead',
        coverPhotoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=85',
        description: '',
        status: 'published',
        isPrivate: false,
        privateAccessCode: '',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: EventFormData) => {
    await onSave(data);
    onClose();
  };

  const sampleImages = [
    { label: 'College Fest', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=85' },
    { label: 'Convocation', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=85' },
    { label: 'Royal Wedding', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&auto=format&fit=crop&q=85' },
    { label: 'Cultural Gala', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=85' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#E8E8E3] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E8E3] flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#171717]">
              {initialData ? 'Edit Event Gallery' : 'Create New Event Gallery'}
            </h2>
            <p className="text-xs text-[#737373]">
              Organize festival, campus ceremony, or private event coverage details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Title */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Event Title *</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Zephyr 2024: Annual Cultural Extravaganza"
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-xs text-[#171717]"
            />
            {errors.title && <span className="text-rose-500 mt-1 block">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Category *</label>
              <select
                {...register('category')}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              >
                <option value="college_fest">College Fest</option>
                <option value="convocation">Convocation & Graduation</option>
                <option value="cultural_event">Cultural & Arts</option>
                <option value="wedding">Wedding & Reception</option>
                <option value="anniversary">Anniversary</option>
                <option value="birthday">Birthday Party</option>
                <option value="private_event">Private Gala</option>
              </select>
            </div>

            {/* College Selection */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Associated College</label>
              <select
                {...register('collegeId')}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              >
                <option value="">None / Private Event</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Event Date *</label>
              <input
                type="date"
                {...register('date')}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              />
              {errors.date && <span className="text-rose-500 mt-1 block">{errors.date.message}</span>}
            </div>

            {/* Location */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Venue / Location *</label>
              <input
                type="text"
                {...register('location')}
                placeholder="e.g. Quadrangle, St. Xavier’s"
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              />
              {errors.location && <span className="text-rose-500 mt-1 block">{errors.location.message}</span>}
            </div>

            {/* Photographer */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Photographer *</label>
              <input
                type="text"
                {...register('photographer')}
                placeholder="e.g. Rakesh Verma"
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              />
            </div>
          </div>

          {/* Cover Photo URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-stone-700">Cover Photo URL *</label>
              <div className="flex items-center gap-1.5 text-[11px] text-[#737373]">
                <span>Presets:</span>
                {sampleImages.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setValue('coverPhotoUrl', s.url)}
                    className="underline text-indigo-600 hover:text-indigo-800"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              {...register('coverPhotoUrl')}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
            />
            {errors.coverPhotoUrl && <span className="text-rose-500 mt-1 block">{errors.coverPhotoUrl.message}</span>}

            {/* Thumbnail Preview */}
            {coverPhotoUrl && (
              <div className="mt-2 h-28 w-full rounded-xl overflow-hidden bg-stone-100 border border-[#E0E0DB]">
                <img src={coverPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Description *</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Highlight festival moments, crowd size, special performances, and key segments..."
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
            />
            {errors.description && <span className="text-rose-500 mt-1 block">{errors.description.message}</span>}
          </div>

          {/* Publish Status & Private Access */}
          <div className="p-4 rounded-xl bg-stone-50 border border-[#E5E5DE] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-800 block">Publication Status</span>
                <span className="text-[11px] text-[#737373]">Control whether this gallery is visible publicly or saved as a draft.</span>
              </div>
              <select
                {...register('status')}
                className="p-2 rounded-lg border border-[#D5D5CF] bg-white text-xs font-semibold text-[#171717]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="pt-3 border-t border-[#E5E5DE] flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-800 block">Password-Protected Private Gallery</span>
                <span className="text-[11px] text-[#737373]">Private galleries are excluded from public search and require a passcode.</span>
              </div>
              <input
                type="checkbox"
                {...register('isPrivate')}
                className="w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500"
              />
            </div>

            {isPrivate && (
              <div className="pt-2">
                <label className="font-semibold text-stone-700 block mb-1">Access Passcode *</label>
                <input
                  type="text"
                  {...register('privateAccessCode')}
                  placeholder="e.g. FEST2024 or SECRET123"
                  className="w-full p-2 rounded-lg border border-[#D5D5CF] uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <span>{initialData ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
