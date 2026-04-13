import { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { categories } from '@/data/families';
import { CategoryPill } from '@/components/CategoryPill';
import { getFamilies } from '@/store/localStorage';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryClick: (categoryId: string) => void;
  activeCategory: string | null;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  onCategoryClick,
  activeCategory,
}: HeroSectionProps) {
  const [familyCount, setFamilyCount] = useState(0);
  const popularCategories = categories.slice(0, 6);

  // Load family count from localStorage
  useEffect(() => {
    const families = getFamilies();
    setFamilyCount(families.length);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {familyCount > 0 ? `${familyCount}+ семейств` : 'Более 10,000 семейств'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4 leading-tight">
            База знаний и семейств
            <span className="text-primary"> для Revit</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[#6B7280] mb-8 max-w-xl mx-auto">
            Скачивайте готовые семейства, читайте гайды и улучшайте свою работу в Autodesk Revit
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#6B7280]" />
            </div>
            <input
              type="text"
              placeholder="Поиск семейств, категорий..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-full border border-gray-200 bg-white text-base shadow-lg shadow-gray-100 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors">
              Найти
            </button>
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-[#6B7280] mr-2 py-2">Популярное:</span>
            {popularCategories.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => onCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
}
