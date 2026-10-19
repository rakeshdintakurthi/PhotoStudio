import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Camera, 
  Download, 
  CheckSquare, 
  Square, 
  Share2, 
  ArrowLeft, 
  Archive, 
  Sparkles, 
  Check, 
  Loader2, 
  Eye, 
  Layers,
  X
} from 'lucide-react';
import { eventService } from '@/services/eventService';
import { photoService } from '@/services/photoService';
import { EventGallery, Photo } from '@/types';
import { formatDate, getCategoryLabel, getCategoryBadgeClass, formatNumber } from '@/utils/formatters';
import { PhotoCard } from '@/components/public/PhotoCard';
import { useGalleryStore } from '@/store/galleryStore';
import { downloadPhotosAsZip } from '@/utils/zipDownloader';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [event, setEvent] = useState<EventGallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // ZIP download state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');

  const {
    selectedPhotoIds,
    selectAll,
    deselectAll,
    openLightbox
  } = useGalleryStore();

  useEffect(() => {
    async function loadEventAndPhotos() {
      if (!slug) return;
      setLoading(true);
      try {
        const ev = await eventService.getById(slug);
        if (ev) {
          setEvent(ev);
          eventService.incrementViews(ev.id);
          const pList = await photoService.getByEventId(ev.id);
          setPhotos(pList);
        }
      } finally {
        setLoading(false);
      }
    }
    loadEventAndPhotos();
  }, [slug]);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedPhotosList = photos.filter((p) => selectedPhotoIds.has(p.id));
  const isAllSelected = photos.length > 0 && selectedPhotosList.length === photos.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll(photos);
    }
  };

  // Download only the user's selected photos as a ZIP
  const handleDownloadSelectedZip = async () => {
    if (selectedPhotosList.length === 0) return;
    setIsZipping(true);
    try {
      const filename = `${event?.title || 'Gallery'}_Selected_Photos.zip`;
      await downloadPhotosAsZip(selectedPhotosList, filename, (percent, status) => {
        setZipProgress(percent);
        setZipStatusText(status);
      });
      if (event) {
        eventService.incrementDownloads(event.id, selectedPhotosList.length);
      }
    } catch (err) {
      console.error('ZIP generation failed', err);
      alert('Unable to generate ZIP. Please try downloading photos individually.');
    } finally {
      setTimeout(() => {
        setIsZipping(false);
        setZipProgress(0);
        setZipStatusText('');
      }, 1000);
    }
  };

  // Download the entire gallery album as a ZIP
  const handleDownloadFullAlbumZip = async () => {
    if (photos.length === 0) return;
    setIsZipping(true);
    try {
      const filename = `${event?.title || 'Album'}_Complete_Gallery.zip`;
      await downloadPhotosAsZip(photos, filename, (percent, status) => {
        setZipProgress(percent);
        setZipStatusText(status);
      });
      if (event) {
        eventService.incrementDownloads(event.id, photos.length);
      }
    } catch (err) {
      console.error('Full album ZIP failed', err);
      alert('Unable to package full album. Please try downloading selected photos.');
    } finally {
      setTimeout(() => {
        setIsZipping(false);
        setZipProgress(0);
        setZipStatusText('');
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5] mx-auto" />
        <p className="text-xs text-[#737373]">Loading high-resolution gallery album...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#171717]">Gallery Not Found</h2>
        <p className="text-xs text-[#737373]">This event gallery may have expired, been set to private, or moved.</p>
        <Link to="/discover" className="inline-block px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold">
          Browse All Events
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {/* Event Header Banner */}
      <div className="bg-white border-b border-[#EAEAE6] pt-6 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Back Link */}
          <div className="flex items-center justify-between">
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737373] hover:text-[#171717] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Events</span>
            </Link>

            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-black py-1.5 px-3 rounded-full border border-[#D5D5CF] bg-white transition-all shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Gallery'}</span>
            </button>
          </div>

          {/* Title & Metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(event.category)}`}>
                  {getCategoryLabel(event.category)}
                </span>
                {event.collegeName && (
                  <Link
                    to={`/colleges`}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    {event.collegeName}
                  </Link>
                )}
                {event.isPrivate && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Private Client Album
                  </span>
                )}
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#171717] tracking-tight leading-tight">
                {event.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#666] leading-relaxed max-w-3xl">
                {event.description}
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#737373]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#999]" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#999]" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-indigo-500" />
                  <span>Covered by {event.photographer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#999]" />
                  <span>{photos.length} Photographs</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="lg:col-span-4 bg-[#FAFAF8] p-5 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#737373] block">
                Album Download Options
              </span>

              <button
                onClick={handleDownloadFullAlbumZip}
                disabled={isZipping || photos.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Archive className="w-4 h-4 text-indigo-400" />
                <span>Download Full Album (ZIP)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#737373] pt-1">
                <span>Lossless High-Res JPGs</span>
                <span className="font-mono">{formatNumber(event.downloadCount)} downloads to date</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAE6]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D5D5CF] bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-xs"
            >
              {isAllSelected ? (
                <>
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-stone-400" />
                  <span>Select All ({photos.length})</span>
                </>
              )}
            </button>

            {selectedPhotosList.length > 0 && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {selectedPhotosList.length} selected
              </span>
            )}
          </div>

          <p className="text-xs text-[#737373]">
            Click any photo to open full-screen viewer with EXIF metadata, or select multiple for batch download.
          </p>
        </div>

        {/* Masonry Columns Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="break-inside-avoid">
              <PhotoCard
                photo={photo}
                index={index}
                allPhotos={photos}
                selectionMode={selectedPhotosList.length > 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Selection Bar (when photos are selected) */}
      {selectedPhotosList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#171717] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
              {selectedPhotosList.length}
            </span>
            <span className="hidden sm:inline">Photos Selected</span>
          </div>

          <div className="h-4 w-px bg-neutral-700 hidden sm:block" />

          <button
            onClick={handleDownloadSelectedZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Selected ZIP</span>
          </button>

          <button
            onClick={deselectAll}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* ZIP Generation Modal Overlay */}
      {isZipping && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#E8E8E3] animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
              <Archive className="w-7 h-7 stroke-[1.75] animate-bounce" />
            </div>

            <div>
              <h3 className="font-editorial text-xl font-bold text-[#171717]">
                Packaging Archive...
              </h3>
              <p className="text-xs text-[#737373] mt-1">
                {zipStatusText || 'Fetching photos and generating lossless ZIP...'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-[#E5E5DE]">
              <div
                className="bg-[#4F46E5] h-full rounded-full transition-all duration-200"
                style={{ width: `${zipProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-stone-700 font-mono">{zipProgress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
