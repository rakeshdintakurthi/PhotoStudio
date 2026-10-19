import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { College } from '@/types';

const collegeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(2, 'Slug is required'),
  location: z.string().min(3, 'Location is required'),
  establishedYear: z.number().min(1800).max(2030),
  description: z.string().min(10, 'Description is required'),
  logoUrl: z.string().url('Must be a valid URL'),
  bannerUrl: z.string().url('Must be a valid URL'),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CollegeFormData) => Promise<void>;
  initialData?: College | null;
}

export const CollegeModal: React.FC<CollegeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: '',
      slug: '',
      location: '',
      establishedYear: 1980,
      description: '',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80',
    },
  });

  const nameVal = watch('name');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
        location: initialData.location,
        establishedYear: initialData.establishedYear,
        description: initialData.description,
        logoUrl: initialData.logoUrl,
        bannerUrl: initialData.bannerUrl,
      });
    } else {
      reset({
        name: '',
        slug: '',
        location: '',
        establishedYear: 1980,
        description: '',
        logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80',
      });
    }
  }, [initialData, reset, isOpen]);

  // Auto-generate slug when name changes for new entries
  useEffect(() => {
    if (!initialData && nameVal) {
      const generated = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generated);
    }
  }, [nameVal, initialData, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data: CollegeFormData) => {
    await onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E8E8E3] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#E8E8E3] flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#171717]">
              {initialData ? 'Edit College Partner' : 'Add New College / University'}
            </h2>
            <p className="text-xs text-[#737373]">
              Partner universities and educational institutions covered by the studio.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Institution Name *</label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. St. Xavier’s University"
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
            />
            {errors.name && <span className="text-rose-500 mt-1 block">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">URL Slug *</label>
              <input
                type="text"
                {...register('slug')}
                placeholder="st-xaviers"
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              />
              {errors.slug && <span className="text-rose-500 mt-1 block">{errors.slug.message}</span>}
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Established Year *</label>
              <input
                type="number"
                {...register('establishedYear', { valueAsNumber: true })}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">City, State / Campus Location *</label>
            <input
              type="text"
              {...register('location')}
              placeholder="e.g. Mumbai, Maharashtra"
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
            />
            {errors.location && <span className="text-rose-500 mt-1 block">{errors.location.message}</span>}
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Description *</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Overview of the campus, signature annual festivals, and student traditions..."
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Logo URL *</label>
              <input
                type="text"
                {...register('logoUrl')}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Banner Image URL *</label>
              <input
                type="text"
                {...register('bannerUrl')}
                className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-xs text-[#171717]"
              />
            </div>
          </div>

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
              {initialData ? 'Update College' : 'Add College'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
