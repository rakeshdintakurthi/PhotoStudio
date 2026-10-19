import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { EventCard } from '@/components/public/EventCard';
import { CategoryPills } from '@/components/public/CategoryPills';
import { eventService } from '@/services/eventService';
import { collegeService } from '@/services/collegeService';
import { EventGallery, College, EventCategory } from '@/types';

export const DiscoverEventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<EventGallery[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters from query params or local state
  const search = searchParams.get('search') || '';
  const collegeId = searchParams.get('collegeId') || '';
  const category = (searchParams.get('category') as EventCategory | 'all') || 'all';
  const year = searchParams.get('year') || 'all';
  const sortBy = (searchParams.get('sortBy') as 'recent' | 'oldest' | 'photos' | 'views') || 'recent';

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch colleges list once
  useEffect(() => {
    collegeService.getAll().then(setColleges);
  }, []);

  // Fetch events when filters change
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const data = await eventService.getAll({
          search,
          collegeId: collegeId || undefined,
          category,
          year: year !== 'all' ? Number(year) : undefined,
          sortBy,
          includePrivate: false,
        });
        setEvents(data);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [search, collegeId, category, year, sortBy]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Pagination slicing
  const totalPages = Math.ceil(events.length / itemsPerPage) || 1;
  const paginatedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const hasActiveFilters = !!search || !!collegeId || category !== 'all' || year !== 'all' || sortBy !== 'recent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Intro */}
      <div className="space-y-2 border-b border-[#EAEAE6] pb-6">
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#171717] tracking-tight">
          Discover Events & Galleries
        </h1>
        <p className="text-sm sm:text-base text-[#737373] max-w-2xl font-light">
          Search across collegiate festivals, graduation ceremonies, royal weddings, and private celebrations to find and download your photo albums.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-5">
        {/* Search Bar & Primary Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              placeholder="Search by event, college, or venue name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D5D5CF] text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* College Filter */}
          <div className="md:col-span-3">
            <select
              value={collegeId}
              onChange={(e) => updateParam('collegeId', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            >
              <option value="">All Institutions</option>
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="md:col-span-2">
            <select
              value={year}
              onChange={(e) => updateParam('year', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            >
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            >
              <option value="recent">Newest Date</option>
              <option value="oldest">Oldest Date</option>
              <option value="photos">Most Photos</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Reset Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F2F2ED]">
          <CategoryPills
            selectedCategory={category}
            onSelectCategory={(cat) => updateParam('category', cat)}
          />

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-semibold hover:text-rose-700 py-1 px-2.5 rounded-lg hover:bg-rose-50 self-start sm:self-auto shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#737373]">
        <span>
          Showing <strong className="text-[#171717] font-semibold">{events.length}</strong> event galleries
          {collegeId && colleges.find((c) => c.id === collegeId) && (
            <span> for {colleges.find((c) => c.id === collegeId)?.name}</span>
          )}
        </span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-stone-200/60 animate-pulse" />
          ))}
        </div>
      ) : paginatedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E8E3] p-8 space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-stone-400 mx-auto stroke-1" />
          <h3 className="font-editorial text-xl font-bold text-[#171717]">No events found</h3>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            We couldn't find any public galleries matching your current search criteria. Try resetting your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#333]"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-stone-700 disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'bg-white border border-[#D5D5CF] text-stone-700 hover:bg-stone-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-[#D5D5CF] bg-white text-stone-700 disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
