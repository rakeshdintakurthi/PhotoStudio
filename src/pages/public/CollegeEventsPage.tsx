import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRight, GraduationCap } from 'lucide-react';
import { collegeService } from '@/services/collegeService';
import { eventService } from '@/services/eventService';
import { College, EventGallery } from '@/types';
import { CollegeCard } from '@/components/public/CollegeCard';
import { EventCard } from '@/components/public/EventCard';

export const CollegeEventsPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [collegeEvents, setCollegeEvents] = useState<EventGallery[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const list = await collegeService.getAll();
        setColleges(list);
        if (list.length > 0) {
          setSelectedCollege(list[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedCollege) {
      eventService
        .getAll({ collegeId: selectedCollege.id, includePrivate: false })
        .then(setCollegeEvents);
    }
  }, [selectedCollege]);

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-[#EAEAE6] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Campus Photography Archival</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#171717] tracking-tight">
          Partner Colleges & Universities
        </h1>
        <p className="text-sm sm:text-base text-[#737373] max-w-2xl font-light">
          Lumina Studios is the official archival and coverage partner for premier universities across the nation. Browse college-specific portals below.
        </p>
      </div>

      {/* College Directory Tabs & Selector */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter universities by name or city..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D5D5CF] text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-xs text-[#737373]">
            {filteredColleges.length} institutions partnered
          </span>
        </div>

        {/* Institution Grid Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((col) => {
            const isSelected = selectedCollege?.id === col.id;
            return (
              <div
                key={col.id}
                onClick={() => setSelectedCollege(col)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-[#4F46E5] bg-white ring-2 ring-[#4F46E5]/20 shadow-md'
                    : 'border-[#E5E5DE] bg-white hover:border-[#C0C0B8] shadow-xs'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-[#EAEAE6]">
                  <img src={col.logoUrl} alt={col.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#171717] truncate">{col.name}</h4>
                  <p className="text-[11px] text-[#737373] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#999]" />
                    <span className="truncate">{col.location}</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {col.totalEvents} fests
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected College Highlight View */}
      {selectedCollege && (
        <div className="space-y-8 pt-4">
          <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[220px] flex flex-col justify-end p-8 border border-stone-800 shadow-xl">
            <img
              src={selectedCollege.bannerUrl}
              alt={selectedCollege.name}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent" />

            <div className="relative z-10 space-y-2 max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
                Official Campus Archive • Est. {selectedCollege.establishedYear}
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-bold">
                {selectedCollege.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                {selectedCollege.description}
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-white">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedCollege.location}
                </span>
                <span>•</span>
                <span>{collegeEvents.length} Festivals & Convocations Covered</span>
              </div>
            </div>
          </div>

          {/* Events Belonging to this College */}
          <div className="space-y-6">
            <h3 className="font-editorial text-2xl font-bold text-[#171717]">
              Festivals & Galleries from {selectedCollege.name}
            </h3>

            {collegeEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collegeEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E8E3] text-xs text-[#737373]">
                No public galleries have been uploaded yet for this campus.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
