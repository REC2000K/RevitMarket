import type { FilterState } from '@/types';
import { categories, fileFormats } from '@/data/families';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({ filters, onFilterChange, isOpen, onClose }: FilterSidebarProps) {
  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const toggleFormat = (format: string) => {
    const newFormats = filters.fileFormats.includes(format)
      ? filters.fileFormats.filter((f) => f !== format)
      : [...filters.fileFormats, format];
    onFilterChange({ ...filters, fileFormats: newFormats });
  };

  const setMinRating = (rating: number) => {
    onFilterChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      revitVersions: [],
      minRating: 0,
      fileFormats: [],
      searchQuery: filters.searchQuery,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minRating > 0 ||
    filters.fileFormats.length > 0;

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">Фильтры</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full border-gray-300 text-[#6B7280]"
        >
          <X className="w-4 h-4 mr-2" />
          Сбросить фильтры
        </Button>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Категории</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
              />
              <span className="text-sm text-[#374151] group-hover:text-[#1A1A1A] transition-colors">
                {category.name}
              </span>
              <span className="text-xs text-[#6B7280] ml-auto">{category.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Рейтинг</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => setMinRating(rating)}
                className="w-4 h-4 border-gray-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#6B7280]">и выше</span>
            </label>
          ))}
        </div>
      </div>

      {/* File Format */}
      <div>
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Формат файла</h3>
        <div className="space-y-2">
          {fileFormats.map((format) => (
            <label
              key={format}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.fileFormats.includes(format)}
                onChange={() => toggleFormat(format)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-[#374151] group-hover:text-[#1A1A1A] transition-colors uppercase">
                {format}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 right-0 w-[320px] bg-white z-50 p-5 overflow-y-auto lg:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
