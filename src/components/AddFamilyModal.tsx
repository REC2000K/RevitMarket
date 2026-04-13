import { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/families';
import { addFamily } from '@/store/localStorage';
import type { Family } from '@/types';

interface AddFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFamilyModal({ isOpen, onClose, onSuccess }: AddFamilyModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    subcategory: string;
    author: string;
    revitVersion: string;
    fileSize: string;
    fileFormat: 'rfa' | 'rvt' | 'rft';
    tags: string;
    image: string;
  }>({
    name: '',
    description: '',
    category: categories[0]?.id || '',
    subcategory: '',
    author: '',
    revitVersion: '2022+',
    fileSize: '',
    fileFormat: 'rfa',
    tags: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.description || !formData.author) {
      setError('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    const newFamily: Family = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      author: formData.author,
      rating: 0,
      downloads: 0,
      revitVersion: formData.revitVersion,
      fileSize: formData.fileSize || '1.0 MB',
      fileFormat: formData.fileFormat,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      dateAdded: new Date().toISOString().split('T')[0],
      image: formData.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=225&fit=crop',
    };

    addFamily(newFamily);
    setIsSubmitting(false);
    onSuccess();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: categories[0]?.id || '',
      subcategory: '',
      author: '',
      revitVersion: '2022+',
      fileSize: '',
      fileFormat: 'rfa',
      tags: '',
      image: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Добавить семейство</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Название <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Диван модульный 3-местный"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Категория <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Подкатегория
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="Например: Мягкая мебель"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Автор <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Ваше имя или название студии"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Revit Version */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Версия Revit
              </label>
              <select
                value={formData.revitVersion}
                onChange={(e) => setFormData({ ...formData, revitVersion: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
              >
                <option value="2020+">Revit 2020+</option>
                <option value="2021+">Revit 2021+</option>
                <option value="2022+">Revit 2022+</option>
                <option value="2023+">Revit 2023+</option>
                <option value="2024+">Revit 2024+</option>
              </select>
            </div>

            {/* File Size */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Размер файла
              </label>
              <input
                type="text"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="Например: 2.5 MB"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* File Format */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Формат файла
              </label>
              <select
                value={formData.fileFormat}
                onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value as 'rfa' | 'rvt' | 'rft' })}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
              >
                <option value="rfa">RFA (Семейство)</option>
                <option value="rvt">RVT (Проект)</option>
                <option value="rft">RFT (Шаблон)</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Теги (через запятую)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="диван, мебель, гостиная"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                URL изображения
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">
                Оставьте пустым для использования изображения по умолчанию
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Подробное описание семейства, его особенности и параметры..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Добавить семейство
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
