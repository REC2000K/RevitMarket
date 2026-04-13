import { ArrowLeft, Star, Download, Heart, Share2, Calendar, User, FileArchive, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Family } from '@/types';
import { getFamilies, recordDownload } from '@/store/localStorage';
import { FamilyCard } from '@/components/FamilyCard';
import { useState, useEffect } from 'react';

interface FamilyDetailPageProps {
  family: Family;
  onBack: () => void;
  onFamilyClick: (family: Family) => void;
}

export function FamilyDetailPage({ family, onBack, onFamilyClick }: FamilyDetailPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [localDownloads, setLocalDownloads] = useState(family.downloads);
  const [allFamilies, setAllFamilies] = useState<Family[]>([]);

  // Load families from localStorage
  useEffect(() => {
    setAllFamilies(getFamilies());
  }, []);

  // Get related families (same category, excluding current)
  const relatedFamilies = allFamilies
    .filter((f) => f.category === family.category && f.id !== family.id)
    .slice(0, 3);

  const formatDownloads = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleDownload = () => {
    recordDownload(family.id);
    setLocalDownloads(prev => prev + 1);
    alert(`Семейство "${family.name}" скачано!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A1A] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к каталогу</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
              <div className="aspect-video bg-gray-100">
                <img
                  src={family.image}
                  alt={family.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                    {family.subcategory || family.category}
                  </span>
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                    {family.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                      isLiked
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="relative w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    {showCopied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Share2 className="w-5 h-5 text-gray-500" />
                    )}
                    {showCopied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                        Скопировано!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[#6B7280] text-lg mb-8">{family.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-[#1A1A1A]">{family.rating}</span>
                  <span className="text-[#6B7280]">рейтинг</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#6B7280]" />
                  <span className="font-semibold text-[#1A1A1A]">
                    {formatDownloads(localDownloads)}
                  </span>
                  <span className="text-[#6B7280]">скачиваний</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#6B7280]" />
                  <span className="text-[#6B7280]">
                    Добавлено {new Date(family.dateAdded).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Автор</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium text-[#1A1A1A]">{family.author}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Версия Revit</p>
                  <span className="font-medium text-[#1A1A1A]">{family.revitVersion}</span>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Размер файла</p>
                  <span className="font-medium text-[#1A1A1A]">{family.fileSize}</span>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Формат</p>
                  <div className="flex items-center gap-2">
                    <FileArchive className="w-4 h-4 text-primary" />
                    <span className="font-medium text-[#1A1A1A] uppercase">
                      {family.fileFormat}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <p className="text-sm text-[#6B7280] mb-3">Теги</p>
              <div className="flex flex-wrap gap-2">
                {family.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 text-[#374151] text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white mb-4"
                onClick={handleDownload}
              >
                <a href={family.downloadPath} download>
                  <Download className="w-5 h-5 mr-2" />
                  Скачать семейство
                </a>
              </Button>
              <p className="text-center text-sm text-[#6B7280]">
                {family.fileSize} · {family.fileFormat.toUpperCase()}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-[#6B7280] mb-4">
                  Это семейство совместимо с:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    Revit {family.revitVersion}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Families */}
        {relatedFamilies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">
              Похожие семейства
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {relatedFamilies.map((relatedFamily) => (
                <FamilyCard
                  key={relatedFamily.id}
                  family={relatedFamily}
                  onClick={() => onFamilyClick(relatedFamily)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
