import React from 'react';
import { EventCategory } from '@/types';
import { Sparkles, GraduationCap, Heart, Gift, PartyPopper, Calendar, Compass } from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: EventCategory | 'all';
  onSelectCategory: (category: EventCategory | 'all') => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: { key: EventCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'all', label: 'All Events', icon: Compass },
    { key: 'college_fest', label: 'College Fests', icon: PartyPopper },
    { key: 'convocation', label: 'Convocations', icon: GraduationCap },
    { key: 'cultural_event', label: 'Cultural & Arts', icon: Sparkles },
    { key: 'wedding', label: 'Weddings', icon: Heart },
    { key: 'anniversary', label: 'Anniversaries', icon: Calendar },
    { key: 'birthday', label: 'Birthdays', icon: Gift },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.key;
        const Icon = cat.icon;
        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-[#171717] text-white shadow-md shadow-stone-800/20'
                : 'bg-white border border-[#E0E0DB] text-[#555] hover:border-[#B5B5AF] hover:text-[#171717]'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-300' : 'text-[#888]'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
