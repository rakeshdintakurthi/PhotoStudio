import React, { useEffect, useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Download, Info, Heart, 
  Share2, Camera, Calendar, Check, Maximize2 
} from 'lucide-react';
import { useGalleryStore } from '@/store/galleryStore';
import { formatDate } from '@/utils/formatters';
import { downloadSinglePhoto } from '@/utils/zipDownloader';

export const Lightbox: React.FC = () => {
  const { 
    activeLightboxIndex, 
    lightboxPhotos, 
    closeLightbox, 
    nextLightbox, 
    prevLightbox,
    openLightbox
  } = useGalleryStore();

  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const currentPhoto = activeLightboxIndex !== null ? lightboxPhotos[activeLightboxIndex] : null;

  // Keyboard controls
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'i' || e.key === 'I') setShowInfo((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, closeLightbox, nextLightbox, prevLightbox]);

  if (activeLightboxIndex === null || !currentPhoto) return null;

  const isLiked = !!liked[currentPhoto.id];

  const handleToggleLike = () => {
    setLiked((prev) => ({ ...prev, [currentPhoto.id]: !prev[currentPhoto.id] }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(currentPhoto.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadSinglePhoto(currentPhoto);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between backdrop-blur-md select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent text-white z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-neutral-300">
            {activeLightboxIndex + 1} / {lightboxPhotos.length}
          </span>
          <h3 className="text-sm font-semibold truncate max-w-xs sm:max-w-md hidden sm:block text-neutral-200">
            {currentPhoto.title}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleLike}
            className={`p-2.5 rounded-full transition-colors ${
              isLiked ? 'text-rose-500 bg-white/20' : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title="Favorite Photo"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2.5 rounded-full transition-colors ${
              showInfo ? 'bg-white/20 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title="EXIF & Image Details"
          >
            <Info className="w-5 h-5" />
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy Direct Image Link"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all shadow-md ml-1"
            title="Download High Resolution Photo"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={closeLightbox}
            className="p-2.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Center Area with Prev/Next buttons */}
      <div className="relative flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={prevLightbox}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 transition-all hover:scale-105"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The Image */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={currentPhoto.url || currentPhoto.thumbnailUrl}
            alt={currentPhoto.title}
            onError={(e) => {
              if (currentPhoto.thumbnailUrl && e.currentTarget.src !== currentPhoto.thumbnailUrl) {
                e.currentTarget.src = currentPhoto.thumbnailUrl;
              }
            }}
            className="max-w-full max-h-[75vh] object-contain rounded-sm shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={nextLightbox}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 transition-all hover:scale-105"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Floating EXIF / Metadata Sidebar Drawer */}
        {showInfo && (
          <div className="absolute top-4 right-4 z-30 w-80 bg-neutral-900/95 border border-neutral-700/80 rounded-2xl p-5 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                Capture Details
              </h4>
              <button
                onClick={() => setShowInfo(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 text-xs">
              <div>
                <span className="text-neutral-400 block mb-0.5">Title</span>
                <span className="font-medium text-neutral-200">{currentPhoto.title}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Resolution</span>
                <span className="font-mono text-neutral-300">
                  {currentPhoto.width} × {currentPhoto.height} px
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Captured Date</span>
                <span className="text-neutral-300">{formatDate(currentPhoto.capturedAt)}</span>
              </div>

              {currentPhoto.exif && (
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-400 block">
                    Camera & Settings
                  </span>

                  {currentPhoto.exif.camera && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Camera</span>
                      <span className="text-neutral-200 font-medium">{currentPhoto.exif.camera}</span>
                    </div>
                  )}

                  {currentPhoto.exif.lens && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Lens</span>
                      <span className="text-neutral-300 truncate max-w-[160px]">{currentPhoto.exif.lens}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    {currentPhoto.exif.focalLength && (
                      <div className="bg-neutral-800/80 p-2 rounded-lg">
                        <span className="text-neutral-400 block">Focal Length</span>
                        <span className="font-medium text-neutral-200">{currentPhoto.exif.focalLength}</span>
                      </div>
                    )}
                    {currentPhoto.exif.aperture && (
                      <div className="bg-neutral-800/80 p-2 rounded-lg">
                        <span className="text-neutral-400 block">Aperture</span>
                        <span className="font-medium text-neutral-200">{currentPhoto.exif.aperture}</span>
                      </div>
                    )}
                    {currentPhoto.exif.shutterSpeed && (
                      <div className="bg-neutral-800/80 p-2 rounded-lg">
                        <span className="text-neutral-400 block">Shutter</span>
                        <span className="font-medium text-neutral-200">{currentPhoto.exif.shutterSpeed}</span>
                      </div>
                    )}
                    {currentPhoto.exif.iso && (
                      <div className="bg-neutral-800/80 p-2 rounded-lg">
                        <span className="text-neutral-400 block">ISO</span>
                        <span className="font-medium text-neutral-200">{currentPhoto.exif.iso}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="px-6 py-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 max-w-4xl py-1">
          {lightboxPhotos.map((photo, idx) => {
            const isCurrent = idx === activeLightboxIndex;
            return (
              <button
                key={photo.id}
                onClick={() => openLightbox(lightboxPhotos, idx)}
                className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  isCurrent
                    ? 'border-[#4F46E5] scale-110 shadow-lg shadow-indigo-500/20 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
