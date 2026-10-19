import React from 'react';
import { Search, CheckSquare, Download, Sparkles } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Find Your Event or Enter Passcode',
      description: 'Search by college, festival name, or celebration date. For private weddings and family galas, enter your unique access passcode.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Browse & Select Your Memories',
      description: 'Enjoy crisp thumbnail previews and full-screen lightbox viewing with camera EXIF details. Select individual favorites or choose the entire album.',
      icon: CheckSquare,
    },
    {
      step: '03',
      title: 'Download in Full Resolution',
      description: 'Download photos individually or package multiple selected captures into a neatly structured ZIP file with a single click, powered by Cloudflare R2.',
      icon: Download,
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-[#EAEAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Simple & Seamless Experience
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#737373]">
            Designed for college students, faculty, wedding guests, and families to discover and save their cherished photographs effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-8 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0C8] transition-all hover:shadow-lg hover:shadow-stone-200/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E5E0] shadow-xs flex items-center justify-center text-[#4F46E5]">
                  <item.icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="font-editorial text-2xl font-bold text-stone-300">
                  {item.step}
                </span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#171717] pt-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
