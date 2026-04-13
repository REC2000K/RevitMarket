import type { Category } from '@/types';
import { 
  Sofa, Droplets, Zap, Wind, Lightbulb, DoorOpen, PanelTop, 
  Building2, Settings, Trees, Palette, UtensilsCrossed, Circle
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sofa, Droplets, Zap, Wind, Lightbulb, DoorOpen, PanelTop,
  Building2, Settings, Trees, Palette, UtensilsCrossed, Circle
};

interface CategoryPillProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ category, isActive = false, onClick }: CategoryPillProps) {
  // Dynamically get the icon component
  const IconComponent = iconMap[category.icon] || Circle;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        isActive
          ? 'bg-primary text-white shadow-md'
          : 'bg-gray-100 text-[#374151] hover:bg-gray-200'
      }`}
    >
      <IconComponent className="w-4 h-4" />
      <span>{category.name}</span>
      <span className={`text-xs ${isActive ? 'text-white/70' : 'text-[#6B7280]'}`}>
        {category.count}
      </span>
    </button>
  );
}
