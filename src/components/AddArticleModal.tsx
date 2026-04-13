import { useState } from 'react';
import { X, Upload, FileText, BookOpen, Video, CheckSquare, Share2, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addArticle } from '@/store/localStorage';
import type { KnowledgeArticle } from '@/types';

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const articleIcons = [
  { value: 'BookOpen', label: 'Книга', icon: BookOpen },
  { value: 'Video', label: 'Видео', icon: Video },
  { value: 'CheckSquare', label: 'Чек-лист', icon: CheckSquare },
  { value: 'FileText', label: 'Статья', icon: FileText },
  { value: 'Share2', label: 'Гайд', icon: Share2 },
  { value: 'Zap', label: 'Совет', icon: Zap },
  { value: 'Layers', label: 'Урок', icon: Layers },
];

const articleCategories = ['Уроки', 'Статьи', 'Чек-листы', 'Гайды', 'Советы'];

export function AddArticleModal({ isOpen, onClose, onSuccess }: AddArticleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: articleCategories[0],
    icon: 'BookOpen',
    readTime: '10 мин',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.description) {
      setError('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    const newArticle: KnowledgeArticle = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      icon: formData.icon,
      readTime: formData.readTime,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    addArticle(newArticle);
    setIsSubmitting(false);
    onSuccess();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: articleCategories[0],
      icon: 'BookOpen',
      readTime: '10 мин',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Добавить статью</h2>
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

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Заголовок <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Как создать параметрическое семейство"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Категория
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
              >
                {articleCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Время чтения
              </label>
              <select
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
              >
                <option value="5 мин">5 минут</option>
                <option value="10 мин">10 минут</option>
                <option value="15 мин">15 минут</option>
                <option value="20 мин">20 минут</option>
                <option value="30 мин">30 минут</option>
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Иконка
              </label>
              <div className="grid grid-cols-4 gap-2">
                {articleIcons.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: value })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                      formData.icon === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-[#6B7280]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание содержания статьи..."
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
                  Добавить статью
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
