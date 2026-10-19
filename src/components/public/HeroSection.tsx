import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Shield, DownloadCloud, MapPin, GraduationCap, Calendar, SlidersHorizontal } from 'lucide-react';
import { collegeService } from '@/services/collegeService';
import { College } from '@/types';

export const HeroSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    collegeService.getAll().then(setColleges);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (selectedCollege) params.set('collegeId', selectedCollege);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedDate) params.set('year', selectedDate);

    const qs = params.toString();
    navigate(qs ? `/discover?${qs}` : '/discover');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#EAEAE6]">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-100/60 via-purple-50/40 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Heading & Multi-Filter Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E2DC] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span className="text-xs font-semibold text-[#171717] tracking-wide">
                Lumina Studios & Galleries
              </span>
              <span className="text-[#888]">•</span>
              <span className="text-xs text-[#737373]">Vijayawada & Andhra Pradesh</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#171717] leading-[1.12]">
              Every Moment. <br />
              <span className="italic font-normal text-[#4F46E5]">Beautifully</span> Captured.
            </h1>

            <p className="text-base sm:text-lg text-[#666666] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover beautiful memories from college festivals, weddings and celebrations across Andhra Pradesh.
            </p>

            {/* Advanced Multi-Filter Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto lg:mx-0 pt-2">
              <div className="p-3 rounded-2xl bg-white border border-[#DDDCD7] shadow-xl shadow-stone-200/50 space-y-2.5">
                
                {/* Primary Event/Keyword Query */}
                <div className="flex items-center pl-3 pr-2 py-1.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search events, festivals, convocations or celebrations..."
                    className="w-full text-xs sm:text-sm py-1 bg-transparent focus:outline-none placeholder:text-stone-400 text-[#171717]"
                  />
                </div>

                {/* Filter Dropdown Selectors: College, Location, Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* College Selector */}
                  <div className="relative">
                    <select
                      value={selectedCollege}
                      onChange={(e) => setSelectedCollege(e.target.value)}
                      aria-label="Filter by college"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
                    >
                      <option value="">All Colleges</option>
                      {colleges.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.shortName || col.name}
                        </option>
                      ))}
                    </select>
                    <GraduationCap className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Location Selector */}
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      aria-label="Filter by location"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All Locations</option>
                      <option value="Vijayawada">Vijayawada</option>
                      <option value="Guntur">Guntur</option>
                      <option value="Amaravati">Amaravati</option>
                      <option value="Mangalagiri">Mangalagiri</option>
                      <option value="Tenali">Tenali</option>
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Date Selector */}
                  <div className="relative">
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      aria-label="Filter by date or year"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All Dates</option>
                      <option value="2026">2026 Events</option>
                      <option value="2025">2025 Events</option>
                    </select>
                    <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500 hidden sm:inline-flex items-center gap-1 pl-1">
                    <SlidersHorizontal className="w-3 h-3 text-indigo-500" />
                    <span>Search 1,200+ high-res photographs across AP</span>
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-95 ml-auto"
                  >
                    <span>Search Galleries</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#737373]">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-indigo-600" />
                <span>Original High-Res JPG & ZIP</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Protected Private Client Galleries</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Zero Image Compression</span>
              </div>
            </div>
          </div>

          {/* Right Column: Localized Andhra Pradesh Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="grid grid-cols-2 gap-3.5">
                {/* Column 1 - Fest & Wedding */}
                <div className="space-y-3.5">
                  <div className="overflow-hidden rounded-2xl shadow-xl border border-white/60 bg-white group">
                    <img
                      src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
                      alt="College Fest VIVA 2026"
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                        College Festival
                      </span>
                      <p className="text-xs font-semibold text-[#171717] truncate">
                        VIVA 2026 • SRM AP Amaravati
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl shadow-xl border border-white/60 bg-white group">
                    <img
                      src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80"
                      alt="Telugu Wedding Reception Vijayawada"
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        Telugu Wedding
                      </span>
                      <p className="text-xs font-semibold text-[#171717] truncate">
                        Sai Teja & Yamini • Vijayawada
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2 - Convocation & Cultural Dance */}
                <div className="space-y-3.5 pt-6">
                  <div className="overflow-hidden rounded-2xl shadow-xl border border-white/60 bg-white group">
                    <img
                      src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80"
                      alt="Convocation Ceremony VRSEC"
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        Convocation
                      </span>
                      <p className="text-xs font-semibold text-[#171717] truncate">
                        Graduation 2026 • VRSEC
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl shadow-xl border border-white/60 bg-white group">
                    <img
                      src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80"
                      alt="Kuchipudi Classical Dance Night"
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-3 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                        Kuchipudi Dance
                      </span>
                      <p className="text-xs font-semibold text-[#171717] truncate">
                        Telugu Cultural Night • Vijayawada
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Chip */}
              <div className="absolute -bottom-4 -left-4 bg-[#171717] text-white p-3.5 rounded-2xl shadow-2xl border border-neutral-700 hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  100%
                </div>
                <div>
                  <div className="text-xs font-semibold">High-Res Original Files</div>
                  <div className="text-[10px] text-neutral-400">Instant direct download without compression</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
