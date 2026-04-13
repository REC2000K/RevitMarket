import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { categories } from '@/data/families';
import { FamilyCard } from '@/components/FamilyCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { CategoryPill } from '@/components/CategoryPill';
import { Button } from '@/components/ui/button';
import { getFamilies } from '@/store/localStorage';
import type { FilterState, Family, ViewMode } from '@/types';

interface CatalogPageProps {
  onFamilyClick: (family: Family) => void;
  initialCategory?: string | null;
}

export function CatalogPage({ onFamilyClick, initialCategory = null }: CatalogPageProps) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    revitVersions: [],
    minRating: 0,
    fileFormats: [],
    searchQuery: '',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  // Load families from localStorage
  useEffect(() => {
    setFamilies(getFamilies());
  }, []);

  const filteredFamilies = useMemo(() => {
    return families.filter((family) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(family.category)) {
        return false;
      }

      // Version filter
      if (filters.revitVersions.length > 0) {
        const familyVersion = family.revitVersion.replace('+', '');
        const matches = filters.revitVersions.some(
          (v) => parseInt(familyVersion) >= parseInt(v)
        );
        if (!matches) return false;
      }

      // Rating filter
      if (filters.minRating > 0 && family.rating < filters.minRating) {
        return false;
      }

      // Format filter
      if (filters.fileFormats.length > 0 && !filters.fileFormats.includes(family.fileFormat)) {
        return false;
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          family.name.toLowerCase().includes(query) ||
          family.description.toLowerCase().includes(query) ||
          family.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [filters, families]);

  const handleCategoryClick = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleDownload = () => {
    // Refresh families data after download
    setFamilies(getFamilies());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2">
            Каталог семейств
          </h1>
          <p className="text-[#6B7280]">
            {filteredFamilies.length} семейств найдено
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Поиск по названию, описанию или тегам..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-[#6B7280] hover:text-[#1A1A1A]" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="lg:hidden border-gray-300"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Фильтры
            </Button>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-white text-[#6B7280] hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-white text-[#6B7280] hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200 overflow-x-auto">
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              category={category}
              isActive={filters.categories.includes(category.id)}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          {/* Results */}
          <div className="flex-1">
            {filteredFamilies.length > 0 ? (
              <div
                className={`grid gap-4 lg:gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredFamilies.map((family) => (
                  <FamilyCard
                    key={family.id}
                    family={family}
                    onClick={() => onFamilyClick(family)}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[#6B7280]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-[#6B7280] mb-4">
                  Попробуйте изменить параметры фильтров или поисковый запрос
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      categories: [],
                      revitVersions: [],
                      minRating: 0,
                      fileFormats: [],
                      searchQuery: '',
                    })
                  }
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
