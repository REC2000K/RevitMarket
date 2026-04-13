import type { KnowledgeArticle } from '@/types';
import { 
  BookOpen, Library, Share2, Zap, Layers, CheckSquare, FileText,
  Clock, ArrowRight
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Library, Share2, Zap, Layers, CheckSquare, FileText
};

interface KnowledgeCardProps {
  article: KnowledgeArticle;
  onClick?: () => void;
}

export function KnowledgeCard({ article, onClick }: KnowledgeCardProps) {
  const IconComponent = iconMap[article.icon] || FileText;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-200 p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20"
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary/10">
          <IconComponent className="w-6 h-6 text-[#6B7280] group-hover:text-primary transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              {article.category}
            </span>
            <span className="text-xs text-[#6B7280] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <h3 className="font-semibold text-[#1A1A1A] text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {article.title}
          </h3>

          <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">
            {article.description}
          </p>

          <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Читать</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
