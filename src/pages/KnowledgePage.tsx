import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Video, FileText, CheckSquare, X } from 'lucide-react';
import { KnowledgeCard } from '@/components/KnowledgeCard';
import { Button } from '@/components/ui/button';
import { getArticles } from '@/store/localStorage';
import type { KnowledgeArticle } from '@/types';

const categories = [
  { id: 'all', name: 'Все', icon: BookOpen },
  { id: 'Уроки', name: 'Уроки', icon: Video },
  { id: 'Статьи', name: 'Статьи', icon: FileText },
  { id: 'Чек-листы', name: 'Чек-листы', icon: CheckSquare },
];

export function KnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Load articles from localStorage
  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Category filter
      if (activeCategory !== 'all' && article.category !== activeCategory) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, articles]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                База знаний
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
              Учитесь и совершенствуйтесь
            </h1>
            <p className="text-lg text-[#6B7280]">
              Гайды, уроки и лучшие практики работы с Revit от профессионалов
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative max-w-2xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Поиск по статьям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-[#6B7280] hover:text-[#1A1A1A]" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-[#374151] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {filteredArticles.map((article) => (
              <KnowledgeCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#6B7280]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Статьи не найдены
            </h3>
            <p className="text-[#6B7280] mb-4">
              Попробуйте изменить поисковый запрос или категорию
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
