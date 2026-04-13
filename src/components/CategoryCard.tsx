import type { Category } from '@/types';
import { 
  Sofa, Droplets, Zap, Wind, Lightbulb, DoorOpen, PanelTop, 
  Building2, Settings, Trees, Palette, UtensilsCrossed, Circle
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sofa, Droplets, Zap, Wind, Lightbulb, DoorOpen, PanelTop,
  Building2, Settings, Trees, Palette, UtensilsCrossed, Circle
};

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Circle;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#0066FF]/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-[#0066FF]/10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#0066FF]/20">
          <IconComponent className="w-6 h-6 text-[#0066FF]" />
        </div>
        <span className="text-sm text-[#6B7280] bg-gray-100 px-2 py-1 rounded-full">
          {category.count}
        </span>
      </div>
      <h3 className="font-semibold text-[#1A1A1A] text-lg mb-1 group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-[#6B7280]">
        {category.count} семейств
      </p>
    </div>
  );
}
