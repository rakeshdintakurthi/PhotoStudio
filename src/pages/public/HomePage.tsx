import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Heart, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  Lock,
  KeyRound,
  Music2,
  Clock
} from 'lucide-react';
import { HeroSection } from '@/components/public/HeroSection';
import { EventCard } from '@/components/public/EventCard';
import { CollegeCard } from '@/components/public/CollegeCard';
import { HowItWorksSection } from '@/components/public/HowItWorksSection';
import { eventService } from '@/services/eventService';
import { collegeService } from '@/services/collegeService';
import { EventGallery, College } from '@/types';

export const HomePage: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<EventGallery[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventGallery[]>([]);
  const [weddingEvents, setWeddingEvents] = useState<EventGallery[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<EventGallery[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [allEvents, colList] = await Promise.all([
          eventService.getAll({ includePrivate: false }),
          collegeService.getAll(),
        ]);
        
        // 1. Featured Events
        setFeaturedEvents(allEvents.slice(0, 3));
        
        // 2. Recently Uploaded Galleries
        const sortedRecent = [...allEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentEvents(sortedRecent.slice(0, 6));

        // 4. Weddings & Celebrations
        const weddings = allEvents.filter(e => e.category === 'wedding' || e.category === 'birthday' || e.category === 'anniversary');
        setWeddingEvents(weddings.slice(0, 3));

        // 5. Cultural Events
        const culturals = allEvents.filter(e => e.category === 'cultural_event' || e.title.toLowerCase().includes('cultural') || e.title.toLowerCase().includes('kuchipudi') || e.title.toLowerCase().includes('annual day'));
        setCulturalEvents(culturals.slice(0, 3));

        // 3. Explore Colleges
        setColleges(colList.slice(0, 4));
      } catch (err) {
        console.error('Error loading homepage data', err);
      }
    }
    loadData();
  }, []);

  const handleQuickPasscodeAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setPasscodeError('Please enter your gallery access passcode.');
      return;
    }
    // Navigate to private-access with passcode pre-filled
    navigate(`/private-access?passcode=${encodeURIComponent(passcode.trim())}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section with AP localization & multi-filter search */}
      <HeroSection />

      {/* SECTION 1: Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spotlight Coverage</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Featured Events
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Hand-picked marquee college fests, cultural nights and milestone celebrations across Vijayawada & Amaravati.
            </p>
          </div>
          <Link
            to="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#4F46E5] transition-colors shrink-0"
          >
            <span>View All Public Galleries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* SECTION 2: Recently Uploaded Galleries */}
      <section className="bg-[#F6F6F2] py-16 border-y border-[#EAEAE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Fresh Deliveries</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
                Recently Uploaded Galleries
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Freshly edited and color-graded high-resolution photo albums ready for individual or complete ZIP download.
              </p>
            </div>
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#4F46E5] transition-colors shrink-0"
            >
              <span>See All Galleries</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Explore Colleges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Campus Partnerships</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Explore Colleges
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Dedicated photographic archives for leading universities and engineering colleges across Andhra Pradesh.
            </p>
          </div>
          <Link
            to="/colleges"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#4F46E5] transition-colors shrink-0"
          >
            <span>View All AP Institutions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Weddings & Celebrations */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
                <Heart className="w-3.5 h-3.5" />
                <span>Telugu Traditions</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Weddings & Celebrations
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Cherished moments from traditional Telugu wedding mandaps, vibrant Haldi & Mehendi ceremonies, and receptions in Vijayawada & Guntur.
              </p>
            </div>
            <Link
              to="/discover?category=wedding"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white transition-colors shrink-0"
            >
              <span>Explore All Weddings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weddingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Cultural Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Music2 className="w-3.5 h-3.5" />
              <span>Heritage & Art</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Cultural Events
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Kuchipudi dance recitals, Carnatic music concerts, and vibrant Telugu cultural festivals captured in stunning clarity.
            </p>
          </div>
          <Link
            to="/discover?category=cultural"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#4F46E5] transition-colors shrink-0"
          >
            <span>Explore Cultural Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {culturalEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* SECTION 6: Private Galleries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-br from-[#171717] via-[#212121] to-[#121212] text-white p-8 sm:p-12 relative overflow-hidden border border-neutral-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Protected Client Galleries</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold leading-tight">
                Private Galleries & Client Portals
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl font-light">
                Were your photos from a private Telugu wedding, anniversary or family celebration? Private galleries are unlisted from public search and protected with high-security passcodes.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Unlisted from Google & Public Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Encrypted Access Passcode</span>
                </div>
              </div>
            </div>

            {/* Quick Access Passcode Input */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <span>Enter Gallery Passcode</span>
              </h3>
              <p className="text-xs text-neutral-300">
                Enter the passcode provided by your event host or photographer invitation:
              </p>

              <form onSubmit={handleQuickPasscodeAccess} className="space-y-3">
                <div className="relative">
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setPasscodeError(null);
                    }}
                    placeholder="e.g. AMARAVATI2026 or SAITEJA2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 text-[#171717] placeholder:text-stone-400 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                {passcodeError && (
                  <p className="text-xs text-rose-400">{passcodeError}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <span>Unlock Gallery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    to="/private-access"
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center transition-colors"
                  >
                    More Details
                  </Link>
                </div>
              </form>

              <p className="text-[11px] text-neutral-400 text-center">
                Try demo passcode: <code className="text-indigo-300 font-mono font-bold">SAITEJA2026</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />
    </div>
  );
};
