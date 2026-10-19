import React from 'react';
import { Check, Download, Eye, Maximize2 } from 'lucide-react';
import { Photo } from '@/types';
import { useGalleryStore } from '@/store/galleryStore';
import { downloadSinglePhoto } from '@/utils/zipDownloader';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  allPhotos: Photo[];
  selectionMode?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  index,
  allPhotos,
  selectionMode = false,
}) => {
  const { isPhotoSelected, togglePhotoSelect, openLightbox } = useGalleryStore();
  const selected = isPhotoSelected(photo.id);

  const handleSelectToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePhotoSelect(photo.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSinglePhoto(photo);
  };

  const handleOpenPreview = () => {
    if (selectionMode) {
      togglePhotoSelect(photo.id);
    } else {
      openLightbox(allPhotos, index);
    }
  };

  return (
    <div
      onClick={handleOpenPreview}
      className={`group relative overflow-hidden rounded-xl bg-stone-100 cursor-pointer transition-all duration-300 ${
        selected
          ? 'ring-4 ring-[#4F46E5] ring-offset-2 shadow-lg'
          : 'hover:shadow-xl hover:shadow-stone-300/40'
      }`}
    >
      {/* Newly Uploaded Photo Badge */}
      {(photo.tags?.includes('uploaded') || photo.id.startsWith('ph-user-')) && (
        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>New</span>
        </span>
      )}

      {/* Photo Image */}
      <img
        src={photo.thumbnailUrl || photo.url}
        alt={photo.title}
        loading="lazy"
        onError={(e) => {
          if (e.currentTarget.src !== photo.url) {
            e.currentTarget.src = photo.url;
          }
        }}
        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Hover Overlay with controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-200 ${
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {/* Top bar in overlay: Select checkbox & Quick preview button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Selection Checkbox */}
          <button
            onClick={handleSelectToggle}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              selected
                ? 'bg-[#4F46E5] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-stone-700 backdrop-blur-xs'
            }`}
            title={selected ? 'Deselect photo' : 'Select photo for batch download'}
          >
            {selected ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-xs border-2 border-stone-400 group-hover:border-stone-700" />
            )}
          </button>

          {/* Quick single download */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-stone-800 transition-colors backdrop-blur-xs shadow-xs"
            title="Download original photo"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom bar in overlay: title & resolution */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
          <div className="max-w-[80%]">
            <p className="text-xs font-semibold truncate drop-shadow-sm">{photo.title}</p>
            <span className="text-[10px] text-stone-300 drop-shadow-xs">
              {photo.width} × {photo.height}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-black/40 backdrop-blur-xs text-white">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
