import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { UploadCloud, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { UploadDropzone } from '@/components/admin/UploadDropzone';
import { eventService } from '@/services/eventService';
import { EventGallery } from '@/types';

export const AdminUploadPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';

  const [events, setEvents] = useState<EventGallery[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [uploadSuccessCount, setUploadSuccessCount] = useState<number | null>(null);

  useEffect(() => {
    eventService.getAll({ includePrivate: true }).then((list) => {
      setEvents(list);
      if (!selectedEventId && list.length > 0) {
        setSelectedEventId(list[0].id);
      }
    });
  }, [selectedEventId]);

  const targetEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div>
      <AdminHeader
        title="Direct Batch Photo Upload"
        subtitle="Stream hundreds of high-resolution RAW & JPG captures directly into Cloudflare R2 object storage via presigned URLs."
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Success Alert Banner */}
        {uploadSuccessCount !== null && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">
                  {uploadSuccessCount} Photographs successfully streamed to Cloudflare R2!
                </p>
                <p className="text-[11px] text-emerald-700">
                  Metadata saved to database. Thumbnails generated and CDN caches purged.
                </p>
              </div>
            </div>

            {targetEvent && (
              <Link
                to={`/events/${targetEvent.slug || targetEvent.id}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
              >
                <span>View Updated Public Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* Upload Dropzone Component */}
        <UploadDropzone
          events={events}
          selectedEventId={selectedEventId}
          onSelectEventId={setSelectedEventId}
          onUploadSuccess={(count) => {
            setUploadSuccessCount(count);
          }}
        />
      </div>
    </div>
  );
};
