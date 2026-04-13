import { useState, useEffect } from 'react';
import { categories as baseCategories } from '@/data/families';
import { CategoryCard } from '@/components/CategoryCard';
import { ArrowRight } from 'lucide-react';
import { getFamilies } from '@/store/localStorage';
import type { Category } from '@/types';

interface CategoriesSectionProps {
  onCategoryClick: (categoryId: string) => void;
  onViewAllClick: () => void;
}

export function CategoriesSection({ onCategoryClick, onViewAllClick }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>(baseCategories);

  // Update category counts from localStorage
  useEffect(() => {
    const families = getFamilies();
    const updatedCategories = baseCategories.map((cat) => ({
      ...cat,
      count: families.filter((f) => f.category === cat.id).length,
    }));
    setCategories(updatedCategories);
  }, []);

  const displayCategories = categories.slice(0, 8);

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2">
              Популярные категории
            </h2>
            <p className="text-[#6B7280]">
              Выберите категорию для быстрого поиска
            </p>
          </div>
          <button
            onClick={onViewAllClick}
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Все категории
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onCategoryClick(category.id)}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            Все категории
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
