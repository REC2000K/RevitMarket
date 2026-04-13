import { useState, useEffect } from 'react';
import { 
  LogOut, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Box, 
  Users, 
  Download,
  Star,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFamilies, getArticles, getUsers, deleteFamily, deleteArticle, initializeStorage } from '@/store/localStorage';
import { AddFamilyModal } from '@/components/AddFamilyModal';
import { AddArticleModal } from '@/components/AddArticleModal';
import type { Family, KnowledgeArticle } from '@/types';
import type { User } from '@/store/localStorage';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onBack: () => void;
}

export function AdminDashboardPage({ onLogout, onBack }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'families' | 'articles' | 'users'>('families');
  const [families, setFamilies] = useState<Family[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Initialize and load data
  useEffect(() => {
    initializeStorage();
    loadData();
  }, []);

  const loadData = () => {
    setFamilies(getFamilies());
    setArticles(getArticles());
    setUsers(getUsers());
  };

  // Filter data based on search and active tab
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
          a.title.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
        );
      case 'users':
        return users.filter((u) =>
          u.name.toLowerCase().includes(query) ||
          u.login.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteFamily = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это семейство?')) {
      deleteFamily(id);
      loadData();
    }
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту статью?')) {
      deleteArticle(id);
      loadData();
    }
  };

  const totalDownloads = families.reduce((sum, f) => sum + f.downloads, 0);
  const averageRating = families.length > 0 
    ? families.reduce((sum, f) => sum + f.rating, 0) / families.length 
    : 0;

  const renderTable = () => {
    switch (activeTab) {
      case 'families':
        return (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Семейство</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Категория</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Автор</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Рейтинг</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Скачивания</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(paginatedData as Family[]).map((family) => (
                <tr key={family.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={family.image} alt={family.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{family.name}</p>
                        <p className="text-xs text-[#6B7280]">{family.fileFormat.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-[#374151] text-xs rounded-full">{family.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{family.author}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{family.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">
                    {family.downloads >= 1000 ? `${(family.downloads / 1000).toFixed(1)}k` : family.downloads}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[#6B7280] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteFamily(family.id)} className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'articles':
        return (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Статья</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Категория</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Время чтения</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Дата</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(paginatedData as KnowledgeArticle[]).map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#1A1A1A]">{article.title}</p>
                      <p className="text-xs text-[#6B7280] line-clamp-1">{article.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{article.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{article.readTime}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{article.dateAdded}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[#6B7280] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'users':
        return (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Пользователь</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Логин</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Роль</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Дата регистрации</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(paginatedData as User[]).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{user.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-[#1A1A1A]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{user.login}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-[#374151]'}`}>
                      {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1A1A1A]">Revit Market</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded ml-2">Админ</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>На сайт</Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-[#6B7280]">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Box className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-[#6B7280]">Всего семейств</span>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{families.length}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-[#6B7280]">Скачиваний</span>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{(totalDownloads / 1000).toFixed(1)}k</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-[#6B7280]">Средний рейтинг</span>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{averageRating.toFixed(1)}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-[#6B7280]">Пользователей</span>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{users.length}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => { setActiveTab('families'); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'families' ? 'bg-white text-primary shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Семейства
            </button>
            <button
              onClick={() => { setActiveTab('articles'); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'articles' ? 'bg-white text-primary shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Статьи
            </button>
            <button
              onClick={() => { setActiveTab('users'); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'users' ? 'bg-white text-primary shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              <Users className="w-4 h-4" />
              Пользователи
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">
              {activeTab === 'families' && 'Управление семействами'}
              {activeTab === 'articles' && 'Управление статьями'}
              {activeTab === 'users' && 'Управление пользователями'}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <button onClick={loadData} className="p-2 text-[#6B7280] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              {activeTab === 'families' && (
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" onClick={() => setIsFamilyModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              )}
              {activeTab === 'articles' && (
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" onClick={() => setIsArticleModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {renderTable()}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                Показано {paginatedData.length} из {filteredData.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-[#1A1A1A]">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddFamilyModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        onSuccess={() => {
          setIsFamilyModalOpen(false);
          loadData();
        }}
      />
      <AddArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSuccess={() => {
          setIsArticleModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
