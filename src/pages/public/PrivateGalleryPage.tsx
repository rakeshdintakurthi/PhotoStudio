import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Archive,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { privateGalleryService } from '@/services/privateGalleryService';
import { eventService } from '@/services/eventService';
import { photoService } from '@/services/photoService';
import { PrivateGalleryAccess, EventGallery, Photo } from '@/types';
import { formatDate } from '@/utils/formatters';
import { PhotoCard } from '@/components/public/PhotoCard';
import { useGalleryStore } from '@/store/galleryStore';
import { downloadPhotosAsZip } from '@/utils/zipDownloader';

export const PrivateGalleryPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get('code') || '';

  const [passcode, setPasscode] = useState(codeParam);
  const [galleryAccess, setGalleryAccess] = useState<PrivateGalleryAccess | null>(null);
  const [eventData, setEventData] = useState<EventGallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // ZIP download state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');

  const { selectedPhotoIds, selectAll, deselectAll } = useGalleryStore();

  const handleUnlock = async (codeToTry?: string) => {
    const code = codeToTry || passcode;
    if (!code.trim()) {
      setError('Please enter your invitation passcode.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Validate with private gallery service
      const res = await privateGalleryService.validateAccess(slug || code, code);
      if (!res.valid || !res.gallery) {
        setError(res.error || 'Invalid passcode. Please check your invitation email.');
        setIsVerifying(false);
        return;
      }

      setGalleryAccess(res.gallery);

      // Load associated event and private photos
      const ev = await eventService.getById(res.gallery.eventId);
      if (ev) {
        setEventData(ev);
        const pList = await photoService.getByEventId(ev.id);
        setPhotos(pList);
      }
    } catch {
      setError('Unable to verify passcode. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-attempt unlock if code is in URL param
  useEffect(() => {
    if (codeParam) {
      handleUnlock(codeParam);
    }
  }, [codeParam]);

  const selectedPhotosList = photos.filter((p) => selectedPhotoIds.has(p.id));
  const isAllSelected = photos.length > 0 && selectedPhotosList.length === photos.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll(photos);
    }
  };

  const handleDownloadZip = async (selectedOnly: boolean) => {
    const targetPhotos = selectedOnly ? selectedPhotosList : photos;
    if (targetPhotos.length === 0) return;

    setIsZipping(true);
    try {
      const filename = `${galleryAccess?.eventTitle || 'Private_Gallery'}_${selectedOnly ? 'Selected' : 'Full'}.zip`;
      await downloadPhotosAsZip(targetPhotos, filename, (percent, status) => {
        setZipProgress(percent);
        setZipStatusText(status);
      });
    } catch (err) {
      console.error('ZIP failed', err);
      alert('Unable to generate ZIP. Please try downloading photos individually.');
    } finally {
      setTimeout(() => {
        setIsZipping(false);
        setZipProgress(0);
        setZipStatusText('');
      }, 1000);
    }
  };

  // If NOT unlocked, render secure password-entry screen
  if (!galleryAccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E8E3] shadow-2xl shadow-stone-200/50 space-y-6 text-center">
          {/* Lock Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-indigo-400 stroke-[1.75]" />
          </div>

          <div className="space-y-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717]">
              Private Client Gallery
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              This collection is private and protected. Please enter your confidential passcode to unlock your photographs.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUnlock();
            }}
            className="space-y-4"
          >
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                  placeholder="ENTER PASSCODE"
                  className="w-full text-center py-3.5 px-4 text-sm font-mono tracking-widest uppercase font-bold rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#171717] bg-stone-50 focus:bg-white transition-all"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-semibold mt-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-4 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isVerifying ? 'Verifying Passcode...' : 'Unlock Private Gallery'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demonstration Passcode Quick-Chips */}
          <div className="pt-4 border-t border-[#F0F0EB] space-y-2">
            <span className="text-[11px] font-semibold text-[#888] uppercase tracking-wider block">
              Demo Access Passcodes:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['KAPOOR25', 'AARAV2024', 'FORT2024'].map((demoCode) => (
                <button
                  key={demoCode}
                  type="button"
                  onClick={() => {
                    setPasscode(demoCode);
                    handleUnlock(demoCode);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-semibold transition-colors"
                >
                  {demoCode}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-stone-400">
              Click any demo code above to test instant client unlock.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED PRIVATE GALLERY VIEW
  return (
    <div className="pb-28">
      {/* Unlocked Banner */}
      <div className="bg-stone-900 text-white pt-10 pb-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Private Access Authenticated</span>
            </div>

            <button
              onClick={() => setGalleryAccess(null)}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Lock Gallery / Exit
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs text-neutral-400 block">
                Exclusive Album for <strong className="text-white">{galleryAccess.clientName}</strong>
              </span>
              <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight">
                {galleryAccess.eventTitle}
              </h1>
              {galleryAccess.expiresAt && (
                <p className="text-xs text-neutral-400">
                  Access valid until {formatDate(galleryAccess.expiresAt)}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownloadZip(false)}
                disabled={isZipping || photos.length === 0}
                className="px-5 py-3 rounded-xl bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                <Archive className="w-4 h-4 text-indigo-600" />
                <span>Download Entire Album (ZIP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAEAE6]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D5D5CF] bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50"
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

          <span className="text-xs text-[#737373]">
            {photos.length} High-Resolution Photographs
          </span>
        </div>

        {/* Masonry Columns */}
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

      {/* Floating Batch Bar */}
      {selectedPhotosList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#171717] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-6 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <span className="text-xs font-semibold">
            {selectedPhotosList.length} photos selected
          </span>
          <button
            onClick={() => handleDownloadZip(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold"
          >
            <Download className="w-4 h-4" />
            <span>Download Selected (ZIP)</span>
          </button>
          <button onClick={deselectAll} className="text-xs text-neutral-400 hover:text-white">
            Clear
          </button>
        </div>
      )}

      {/* ZIP Progress Modal */}
      {isZipping && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <Archive className="w-8 h-8 text-indigo-600 mx-auto animate-bounce" />
            <h3 className="font-editorial text-xl font-bold text-[#171717]">Packaging Private Album...</h3>
            <p className="text-xs text-[#737373]">{zipStatusText}</p>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${zipProgress}%` }} />
            </div>
            <span className="text-xs font-bold text-stone-700 font-mono">{zipProgress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
