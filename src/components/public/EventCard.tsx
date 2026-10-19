import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Image as ImageIcon, MapPin, ArrowRight, Eye, Download } from 'lucide-react';
import { EventGallery } from '@/types';
import { formatDate, getCategoryLabel, getCategoryBadgeClass, formatNumber } from '@/utils/formatters';

interface EventCardProps {
  event: EventGallery;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8E8E3] hover:border-[#D0D0C8] shadow-xs hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
      {/* Cover Image Container */}
      <Link to={`/events/${event.slug || event.id}`} className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={event.coverPhotoUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Category Tag Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-xs backdrop-blur-md bg-white/95 ${getCategoryBadgeClass(event.category)}`}>
            {getCategoryLabel(event.category)}
          </span>
        </div>

        {/* Total Photos Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-medium">
          <ImageIcon className="w-3 h-3" />
          <span>{event.totalPhotos} Photos</span>
        </div>

        {/* Private Lock Icon if Private */}
        {event.isPrivate && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold tracking-wider uppercase">
            Private Access
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* College or Location */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#737373] mb-1.5 truncate">
            {event.collegeName ? (
              <span className="text-[#4F46E5] font-semibold truncate">{event.collegeName}</span>
            ) : (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#999]" />
                {event.location}
              </span>
            )}
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.slug || event.id}`}>
            <h3 className="font-editorial text-lg font-bold text-[#171717] group-hover:text-[#4F46E5] transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Brief Description */}
          <p className="text-xs text-[#737373] line-clamp-2 mt-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-[#F0F0EB] flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#8A8A8A]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#999]" />
              {formatDate(event.date)}
            </span>
            {event.viewCount > 0 && (
              <span className="flex items-center gap-1 hidden sm:flex">
                <Eye className="w-3 h-3 text-[#999]" />
                {formatNumber(event.viewCount)}
              </span>
            )}
          </div>

          <Link
            to={`/events/${event.slug || event.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#171717] group-hover:text-[#4F46E5] transition-colors"
          >
            <span>View Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
