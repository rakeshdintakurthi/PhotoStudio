import React, { useEffect, useState } from 'react';
import { 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Download, 
  Search, 
  Star, 
  Eye, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { eventService } from '@/services/eventService';
import { photoService } from '@/services/photoService';
import { EventGallery, Photo } from '@/types';
import { formatBytes, formatDate } from '@/utils/formatters';

export const AdminGalleriesPage: React.FC = () => {
  const [events, setEvents] = useState<EventGallery[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    eventService.getAll({ includePrivate: true }).then((list) => {
      setEvents(list);
      if (list.length > 0) {
        setSelectedEventId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      setLoading(true);
      photoService.getByEventId(selectedEventId).then((pList) => {
        setPhotos(pList);
        setLoading(false);
      });
    }
  }, [selectedEventId]);

  const handleDeletePhoto = async (photoId: string) => {
    if (confirm('Delete this photograph from the gallery album?')) {
      await photoService.delete(photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
  };

  const currentEvent = events.find((e) => e.id === selectedEventId);

  const filteredPhotos = photos.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <AdminHeader
        title="Galleries & Photo Manager"
        subtitle="Organize photo assets, examine EXIF data, set cover images, and manage download limits."
        action={
          currentEvent && (
            <a
              href={`/events/${currentEvent.slug || currentEvent.id}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-[#D5D5CF] bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <span>View Public Album</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Gallery Selector & Search */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E3] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Select Gallery to Inspect
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-xs font-medium text-[#171717]"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.totalPhotos} photos)
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 max-w-xs relative self-end sm:self-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter photos by title or tag..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Gallery Overview Banner */}
        {currentEvent && (
          <div className="bg-[#FAFAF8] p-4 rounded-xl border border-[#EAEAE6] flex flex-wrap items-center justify-between gap-4 text-xs text-[#737373]">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-stone-900">{filteredPhotos.length} Photos in Album</span>
              <span>•</span>
              <span>Photographer: <strong className="text-stone-800">{currentEvent.photographer}</strong></span>
              <span>•</span>
              <span>Date: {formatDate(currentEvent.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Lossless R2 Delivery Active
              </span>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group bg-white rounded-xl border border-[#E8E8E3] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Delete button */}
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 text-xs space-y-1">
                <p className="font-semibold text-stone-900 truncate" title={photo.title}>
                  {photo.title}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#737373]">
                  <span>{photo.width}×{photo.height}</span>
                  <span>{formatBytes(photo.sizeBytes)}</span>
                </div>
                {photo.exif?.camera && (
                  <p className="text-[10px] text-indigo-600 truncate font-mono">
                    {photo.exif.camera}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
