import { HeroSection } from '@/sections/HeroSection';
import { CategoriesSection } from '@/sections/CategoriesSection';
import { FeaturedFamiliesSection } from '@/sections/FeaturedFamiliesSection';
import { LatestKnowledgeSection } from '@/sections/LatestKnowledgeSection';
import type { Family } from '@/types';

interface HomePageProps {
  onCatalogClick: () => void;
  onKnowledgeClick: () => void;
  onCategoryClick: (categoryId: string) => void;
  onFamilyClick: (family: Family) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string | null;
  onActiveCategoryChange: (categoryId: string | null) => void;
}

export function HomePage({
  onCatalogClick,
  onKnowledgeClick,
  onCategoryClick,
  onFamilyClick,
  searchQuery,
  onSearchChange,
  activeCategory,
  onActiveCategoryChange,
}: HomePageProps) {
  const handleCategoryClick = (categoryId: string) => {
    onActiveCategoryChange(activeCategory === categoryId ? null : categoryId);
    onCategoryClick(categoryId);
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
      />
      <CategoriesSection
        onCategoryClick={(categoryId) => {
          onActiveCategoryChange(categoryId);
          onCatalogClick();
        }}
        onViewAllClick={onCatalogClick}
      />
      <FeaturedFamiliesSection
        onViewAllClick={onCatalogClick}
        onFamilyClick={onFamilyClick}
      />
      <LatestKnowledgeSection onViewAllClick={onKnowledgeClick} />
    </div>
  );
}
