import { useState, useEffect } from 'react';
import { KnowledgeCard } from '@/components/KnowledgeCard';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getArticles } from '@/store/localStorage';
import type { KnowledgeArticle } from '@/types';

interface LatestKnowledgeSectionProps {
  onViewAllClick: () => void;
}

export function LatestKnowledgeSection({ onViewAllClick }: LatestKnowledgeSectionProps) {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);

  // Load articles from localStorage
  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const latestArticles = articles.slice(0, 4);

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                База знаний
              </h2>
              <p className="text-[#6B7280] text-sm">
                Гайды, уроки и лучшие практики
              </p>
            </div>
          </div>
          <button
            onClick={onViewAllClick}
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Все статьи
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {latestArticles.map((article) => (
            <KnowledgeCard
              key={article.id}
              article={article}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            Все статьи
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
