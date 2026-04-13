import { useState, useEffect } from 'react';
import { FamilyCard } from '@/components/FamilyCard';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { getFamilies } from '@/store/localStorage';
import type { Family } from '@/types';

interface FeaturedFamiliesSectionProps {
  onViewAllClick: () => void;
  onFamilyClick: (family: Family) => void;
}

export function FeaturedFamiliesSection({ onViewAllClick, onFamilyClick }: FeaturedFamiliesSectionProps) {
  const [families, setFamilies] = useState<Family[]>([]);

  // Load families from localStorage
  useEffect(() => {
    setFamilies(getFamilies());
  }, []);

  // Get top 8 families by downloads
  const featuredFamilies = [...families]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 8);

  const handleDownload = () => {
    // Refresh families data after download
    setFamilies(getFamilies());
  };

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                Популярные семейства
              </h2>
              <p className="text-[#6B7280] text-sm">
                Чаще всего скачивают эту неделю
              </p>
            </div>
          </div>
          <button
            onClick={onViewAllClick}
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Смотреть все
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {featuredFamilies.map((family) => (
            <FamilyCard
              key={family.id}
              family={family}
              onClick={() => onFamilyClick(family)}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            Смотреть все
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
