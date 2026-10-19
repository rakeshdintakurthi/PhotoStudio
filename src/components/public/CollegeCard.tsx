import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { College } from '@/types';

interface CollegeCardProps {
  college: College;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E8E8E3] hover:border-[#D5D5CD] shadow-xs hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Banner with college logo badge */}
        <div className="relative h-36 overflow-hidden bg-stone-200">
          <img
            src={college.bannerUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shrink-0 border border-white/80 overflow-hidden">
              <img
                src={college.logoUrl}
                alt={college.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="text-white">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-indigo-200 block">
                Est. {college.establishedYear}
              </span>
            </div>
          </div>

          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#171717] shadow-xs">
            {college.totalEvents} Events Covered
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2.5">
          <Link to={`/discover?collegeId=${college.id}`}>
            <h3 className="font-editorial text-lg font-bold text-[#171717] group-hover:text-[#4F46E5] transition-colors leading-snug">
              {college.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-[#737373]">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{college.location}</span>
          </div>

          <p className="text-xs text-[#666] line-clamp-2 leading-relaxed pt-1">
            {college.description}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="px-5 pb-5 pt-2">
        <Link
          to={`/discover?collegeId=${college.id}`}
          className="w-full py-2 px-3 rounded-xl border border-[#E0E0DA] bg-stone-50/50 hover:bg-[#171717] hover:text-white hover:border-[#171717] text-[#171717] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
        >
          <span>View All College Galleries</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
