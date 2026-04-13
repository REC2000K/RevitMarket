import { useState, useEffect } from 'react';
import {
  LogOut,
  Plus,
  Search,
  Trash2,
  Box,
  Users,
  Download,
  Star,
  LayoutGrid,
  FileText,
  RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  getArticles,
  getUsers,
  getDownloads
} from '@/store/localStorage';

import { families as defaultFamilies } from '@/data/families';

import { AddArticleModal } from '@/components/AddArticleModal';

import type { Family, KnowledgeArticle } from '@/types';
import type { User } from '@/store/localStorage';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onBack: () => void;
}

// 🔥 Обогащаем families
function getEnrichedFamilies(): Family[] {
  const downloads = getDownloads();

  return defaultFamilies.map((f) => ({
    ...f,
    downloads: downloads[f.id] || 0,
  }));
}

export function AdminDashboardPage({ onLogout, onBack }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'families' | 'articles' | 'users'>('families');

  const [families, setFamilies] = useState<Family[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // 🔥 Загрузка данных
  const loadData = () => {
    setFamilies(getEnrichedFamilies());
    setArticles(getArticles());
    setUsers(getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔍 Фильтрация
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();

    switch (activeTab) {
      case 'families':
        return families.filter((f) =>
          f.name.toLowerCase().includes(query) ||
          f.category.toLowerCase().includes(query) ||
          f.author.toLowerCase().includes(query)
        );

      case 'articles':
        return articles.filter((a) =>
          a.title.toLowerCase().includes(query)
        );

      case 'users':
        return users.filter((u) =>
          u.name.toLowerCase().includes(query) ||
          u.login.toLowerCase().includes(query)
        );

      default:
        return [];
    }
  };

  const filteredData = getFilteredData();

  const totalDownloads = families.reduce((sum, f) => sum + f.downloads, 0);
  const averageRating =
    families.length > 0
      ? families.reduce((sum, f) => sum + f.rating, 0) / families.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b p-4 flex justify-between">
        <h1 className="font-bold">Админ панель</h1>
        <Button onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </header>

      <div className="p-6">

        {/* СТАТИСТИКА */}
        <div className="grid grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl">
            <Box /> {families.length} семейств
          </div>

          <div className="bg-white p-4 rounded-xl">
            <Download /> {totalDownloads}
          </div>

          <div className="bg-white p-4 rounded-xl">
            <Star /> {averageRating.toFixed(1)}
          </div>

          <div className="bg-white p-4 rounded-xl">
            <Users /> {users.length}
          </div>

        </div>

        {/* ТАБЫ */}
        <div className="flex gap-2 mb-4">
          <Button onClick={() => setActiveTab('families')}>
            <LayoutGrid /> Семейства
          </Button>
          <Button onClick={() => setActiveTab('articles')}>
            <FileText /> Статьи
          </Button>
          <Button onClick={() => setActiveTab('users')}>
            <Users /> Пользователи
          </Button>
        </div>

        {/* TOOLBAR */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded"
          />

          <Button onClick={loadData}>
            <RefreshCw />
          </Button>

          {activeTab === 'articles' && (
            <Button onClick={() => setIsArticleModalOpen(true)}>
              <Plus /> Добавить
            </Button>
          )}
        </div>

        {/* СПИСОК */}
        <div className="bg-white rounded-xl p-4">

          {activeTab === 'families' && (
            <div className="space-y-2">
              {(filteredData as Family[]).map((f) => (
                <div key={f.id} className="flex justify-between border p-3 rounded">

                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-sm text-gray-500">{f.category}</div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <span>⭐ {f.rating}</span>
                    <span>⬇ {f.downloads}</span>
                  </div>

                </div>
              ))}
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-2">
              {(filteredData as KnowledgeArticle[]).map((a) => (
                <div key={a.id}>{a.title}</div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-2">
              {(filteredData as User[]).map((u) => (
                <div key={u.id}>{u.name}</div>
              ))}
            </div>
          )}

        </div>
      </div>

      <AddArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
