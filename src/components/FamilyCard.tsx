import { Star, Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Family } from '@/types';
import { useState } from 'react';
import { recordDownload } from '@/store/localStorage';

interface FamilyCardProps {
  family: Family;
  onClick?: () => void;
  onDownload?: () => void;
}

export function FamilyCard({ family, onClick, onDownload }: FamilyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localDownloads, setLocalDownloads] = useState(family.downloads);

  const formatDownloads = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordDownload(family.id);
    setLocalDownloads(prev => prev + 1);
    if (onDownload) onDownload();
    
    // Show download notification
    alert(`Семейство "${family.name}" скачано!`);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={family.image}
          alt={family.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white font-medium">
          {family.fileFormat.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-[#6B7280] mb-1 uppercase tracking-wide">
          {family.subcategory || family.category}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-[#1A1A1A] text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {family.name}
        </h3>

        {/* Author */}
        <p className="text-sm text-[#6B7280] mb-3">{family.author}</p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-[#1A1A1A]">{family.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">{formatDownloads(localDownloads)}</span>
            </div>
          </div>
          <span className="text-xs text-[#6B7280] bg-gray-100 px-2 py-1 rounded">
            {family.revitVersion}
          </span>
        </div>

        {/* Button */}
        <a
          href={family.downloadPath}
          download
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Скачать
          </Button>
        </a>
      </div>
    </div>
  );
}
